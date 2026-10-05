import unittest

from creador_reels.segmentos import (
    Tramo,
    ajustar_a_fotogramas,
    parsear_silencedetect,
    restar,
    reubicar,
    tramos_de_habla,
)

LOG = """
[silencedetect @ 0x1] silence_start: 0
[silencedetect @ 0x1] silence_end: 1.5 | silence_duration: 1.5
[silencedetect @ 0x1] silence_start: 3.0
[silencedetect @ 0x1] silence_end: 5.0 | silence_duration: 2.0
[silencedetect @ 0x1] silence_start: 8.2
"""


class TestSegmentos(unittest.TestCase):
    def test_parsear_incluye_silencio_final_abierto(self):
        s = parsear_silencedetect(LOG, 10.0)
        self.assertEqual(s, [Tramo(0, 1.5), Tramo(3.0, 5.0), Tramo(8.2, 10.0)])

    def test_tramos_con_margen(self):
        t = tramos_de_habla(parsear_silencedetect(LOG, 10.0), 10.0, margen=0.1)
        self.assertEqual(len(t), 2)
        self.assertAlmostEqual(t[0].inicio, 1.4)
        self.assertAlmostEqual(t[0].fin, 3.1)
        self.assertAlmostEqual(t[1].fin, 8.3)

    def test_pausas_cortas_se_conservan(self):
        silencios = [Tramo(2.0, 2.3)]
        t = tramos_de_habla(silencios, 5.0, margen=0.05, hueco_min=0.25)
        self.assertEqual(t, [Tramo(0, 5.0)])

    def test_descarta_chasquidos(self):
        silencios = [Tramo(0, 2.0), Tramo(2.1, 5.0)]
        self.assertEqual(tramos_de_habla(silencios, 5.0, tramo_min=0.2), [])

    def test_restar_muletilla(self):
        r = restar([Tramo(0, 4)], [Tramo(1.0, 1.5)])
        self.assertEqual(r, [Tramo(0, 1.0), Tramo(1.5, 4)])

    def test_ajuste_a_fotogramas(self):
        r = ajustar_a_fotogramas([Tramo(0.51, 1.49)], 10)
        self.assertEqual(r, [Tramo(0.5, 1.5)])

    def test_reubicar(self):
        tramos = [Tramo(1, 2), Tramo(4, 6)]
        self.assertEqual(reubicar(1.5, tramos), 0.5)
        self.assertEqual(reubicar(5, tramos), 2.0)
        self.assertIsNone(reubicar(3, tramos))
        self.assertIsNone(reubicar(7, tramos))


if __name__ == "__main__":
    unittest.main()
