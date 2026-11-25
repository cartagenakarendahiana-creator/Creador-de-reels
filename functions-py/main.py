"""Transcripción gratis con Whisper (faster-whisper) dentro de Firebase.

Se activa cuando un video pasa a status "transcribir": descarga el audio,
lo transcribe con marcas de tiempo por palabra, guarda transcript.json
y deja el video en "planificar" para que Claude haga la edición.
"""
import json
import os
import tempfile
import time

from firebase_admin import firestore, initialize_app, storage
from firebase_functions import firestore_fn, options

initialize_app()

MODEL_SIZE = os.environ.get("WHISPER_MODEL", "small")
_model = None


def get_model():
    global _model
    if _model is None:
        from faster_whisper import WhisperModel

        _model = WhisperModel(
            MODEL_SIZE,
            device="cpu",
            compute_type="int8",
            cpu_threads=4,
            download_root="/tmp/whisper-models",
        )
    return _model


def set_job(job_id, data):
    data["updatedAt"] = firestore.SERVER_TIMESTAMP
    firestore.client().document(f"jobs/{job_id}").set(data, merge=True)


@firestore_fn.on_document_updated(
    document="jobs/{jobId}",
    region="us-central1",
    memory=options.MemoryOption.GB_8,
    cpu=4,
    timeout_sec=540,
    max_instances=2,
    concurrency=1,
)
def transcribir(event: firestore_fn.Event[firestore_fn.Change[firestore_fn.DocumentSnapshot | None]]) -> None:
    before = event.data.before.to_dict() if event.data.before else {}
    after = event.data.after.to_dict() if event.data.after else None
    if not after or after.get("status") != "transcribir" or before.get("status") == "transcribir":
        return

    job_id = event.params["jobId"]
    duration = float(after.get("duration") or 0) or 1.0
    try:
        set_job(job_id, {"step": "Escuchando tu video…", "progress": 0})
        bucket = storage.bucket()
        with tempfile.TemporaryDirectory() as tmp:
            audio = os.path.join(tmp, "audio.mp3")
            bucket.blob(f"jobs/{job_id}/audio.mp3").download_to_filename(audio)

            model = get_model()
            segments, info = model.transcribe(
                audio,
                language=after.get("language") or "es",
                word_timestamps=True,
                beam_size=5,
                vad_filter=False,
                condition_on_previous_text=False,
            )

            words, texts = [], []
            last_update = time.time()
            for seg in segments:
                texts.append(seg.text.strip())
                for w in seg.words or []:
                    t = w.word.strip()
                    if t:
                        words.append({"text": t, "start": round(w.start, 3), "end": round(w.end, 3), "type": "word"})
                if time.time() - last_update > 4:
                    last_update = time.time()
                    pct = min(99, int(seg.end / duration * 100))
                    set_job(job_id, {"step": f"Escuchando tu video… {pct}%", "progress": pct})

        if not words:
            raise RuntimeError("No encontré voz en el video.")

        transcript = {"language": info.language, "text": " ".join(texts), "words": words}
        bucket.blob(f"jobs/{job_id}/transcript.json").upload_from_string(
            json.dumps(transcript, ensure_ascii=False), content_type="application/json"
        )
        set_job(job_id, {
            "status": "planificar",
            "step": "Claude está editando…",
            "transcriptText": transcript["text"][:5000],
            "progress": firestore.DELETE_FIELD,
        })
    except Exception as e:  # noqa: BLE001
        print("Error transcribiendo", job_id, repr(e))
        set_job(job_id, {"status": "error", "error": f"No se pudo transcribir: {str(e)[:300]}"})
