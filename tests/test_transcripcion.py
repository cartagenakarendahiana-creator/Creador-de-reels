import unittest

from creador_reels.segmentos import Tramo
from creador_reels.transcripcion import (
    Palabra,
    agrupar_frases,
    es_muletilla,
    generar_ass,
    generar_srt,
    palabras_editadas,
)


class TestTranscripcion(unittest.TestCase):
    def test_muletillas(self):
        for m in ["eh", "Ehh,", "mmm", "um...", "ah"]:
            self.assertTrue(es_muletilla(m), m)
        for p in ["este", "hola", "me", "un"]:
            self.assertFalse(es_muletilla(p), p)

    def test_palabras_editadas_siguen_el_corte(self):
        palabras = [Palabra(1.0, 1.4, "Hola"), Palabra(2.0, 2.3, "eh"), Palabra(4.2, 4.6, "amigos")]
        r = palabras_editadas(palabras, [Tramo(0.9, 1.5), Tramo(4.0, 5.0)])
        self.assertEqual([p.texto for p in r], ["Hola", "amigos"])
        self.assertAlmostEqual(r[0].inicio, 0.1)
        self.assertAlmostEqual(r[1].inicio, 0.8)

    def test_agrupar_respeta_puntuacion_y_largo(self):
        ps = [Palabra(i * 0.3, i * 0.3 + 0.25, w) for i, w in enumerate("hola. esto es una prueba larga".split())]
        frases = [f.texto for f in agrupar_frases(ps, max_palabras=3)]
        self.assertEqual(frases, ["hola.", "esto es una", "prueba larga"])

    def test_formatos(self):
        f = [Palabra(0.0, 1.25, "hola {mundo}")]
        ass = generar_ass(f, 1080, 1920)
        self.assertIn("Dialogue: 0,0:00:00.00,0:00:01.25,Reel,,0,0,0,,HOLA (MUNDO)", ass)
        self.assertIn("00:00:00,000 --> 00:00:01,250", generar_srt(f))


if __name__ == "__main__":
    unittest.main()
