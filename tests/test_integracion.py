"""Prueba de extremo a extremo con un video sintético generado por FFmpeg."""

import shutil
import subprocess
import tempfile
import unittest
from pathlib import Path

from creador_reels import ffmpeg
from creador_reels.cli import main


@unittest.skipUnless(shutil.which("ffmpeg"), "requiere ffmpeg")
class TestIntegracion(unittest.TestCase):
    def setUp(self):
        self.dir = Path(tempfile.mkdtemp())
        self.addCleanup(shutil.rmtree, self.dir)
        self.video = self.dir / "entrada.mp4"
        # 10 s: "voz" (tono) en 1-3 s y 6-8 s, silencio en el resto.
        subprocess.run(
            [
                "ffmpeg", "-y", "-loglevel", "error",
                "-f", "lavfi", "-i", "testsrc2=size=640x360:rate=30:duration=10",
                "-f", "lavfi", "-i",
                "aevalsrc='0.5*sin(2*PI*220*t)*(between(t,1,3)+between(t,6,8))':s=48000:d=10",
                "-c:v", "libx264", "-preset", "ultrafast", "-c:a", "aac", "-shortest",
                str(self.video),
            ],
            check=True,
        )

    def test_recorta_silencios_y_mantiene_sincronia(self):
        salida = self.dir / "salida.mp4"
        self.assertEqual(main([str(self.video), "-o", str(salida), "--margen", "0.1"]), 0)
        info = ffmpeg.analizar(salida)
        # 2 tramos de 2 s + márgenes de 0.1 s a cada lado.
        self.assertAlmostEqual(info.duracion, 4.4, delta=0.15)
        r = subprocess.run(
            ["ffprobe", "-v", "error", "-show_entries", "stream=codec_type,duration",
             "-of", "csv=p=0", str(salida)],
            capture_output=True, text=True, check=True,
        )
        duraciones = [float(l.split(",")[1]) for l in r.stdout.split()]
        self.assertLess(abs(duraciones[0] - duraciones[1]), 0.05, "audio y video desfasados")

    def test_vertical_con_musica(self):
        musica = self.dir / "musica.wav"
        subprocess.run(
            ["ffmpeg", "-y", "-loglevel", "error", "-f", "lavfi", "-i",
             "sine=frequency=440:duration=1", str(musica)],
            check=True,
        )
        salida = self.dir / "vertical.mp4"
        self.assertEqual(
            main([str(self.video), "-o", str(salida), "--vertical", "--musica", str(musica)]), 0
        )
        info = ffmpeg.analizar(salida)
        self.assertEqual((info.ancho, info.alto), (1080, 1920))


if __name__ == "__main__":
    unittest.main()
