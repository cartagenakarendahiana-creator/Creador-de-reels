"""Cálculo de los tramos de habla que se conservan en la edición.

Todo aquí son funciones puras (sin FFmpeg) para poder probarlas fácilmente.
"""

from __future__ import annotations

import math
import re
from dataclasses import dataclass


@dataclass(frozen=True)
class Tramo:
    inicio: float
    fin: float

    @property
    def duracion(self) -> float:
        return self.fin - self.inicio


_RE_INICIO = re.compile(r"silence_start:\s*(-?[\d.]+)")
_RE_FIN = re.compile(r"silence_end:\s*(-?[\d.]+)")


def parsear_silencedetect(salida: str, duracion: float) -> list[Tramo]:
    """Extrae los silencios del log de stderr del filtro `silencedetect`."""
    silencios: list[Tramo] = []
    inicio: float | None = None
    for linea in salida.splitlines():
        if m := _RE_INICIO.search(linea):
            inicio = max(0.0, float(m.group(1)))
        elif (m := _RE_FIN.search(linea)) and inicio is not None:
            silencios.append(Tramo(inicio, min(duracion, float(m.group(1)))))
            inicio = None
    if inicio is not None:  # el audio termina en silencio
        silencios.append(Tramo(inicio, duracion))
    return silencios


def complemento(cortes: list[Tramo], duracion: float) -> list[Tramo]:
    """Devuelve las partes de [0, duracion] que no están cubiertas por `cortes`."""
    resultado: list[Tramo] = []
    cursor = 0.0
    for c in sorted(cortes, key=lambda t: t.inicio):
        if c.inicio > cursor:
            resultado.append(Tramo(cursor, c.inicio))
        cursor = max(cursor, c.fin)
    if cursor < duracion:
        resultado.append(Tramo(cursor, duracion))
    return resultado


def unir(tramos: list[Tramo], hueco_max: float = 0.0) -> list[Tramo]:
    """Une tramos solapados o separados por menos de `hueco_max` segundos."""
    resultado: list[Tramo] = []
    for t in sorted(tramos, key=lambda t: t.inicio):
        if resultado and t.inicio - resultado[-1].fin <= hueco_max:
            ultimo = resultado[-1]
            resultado[-1] = Tramo(ultimo.inicio, max(ultimo.fin, t.fin))
        else:
            resultado.append(t)
    return resultado


def tramos_de_habla(
    silencios: list[Tramo],
    duracion: float,
    margen: float = 0.12,
    hueco_min: float = 0.25,
    tramo_min: float = 0.2,
) -> list[Tramo]:
    """Convierte silencios detectados en los tramos de habla a conservar.

    - `margen`: segundos que se añaden antes y después de cada tramo para no
      cortar el ataque ni la cola de las sílabas (respiración natural).
    - `hueco_min`: pausas más cortas que esto se mantienen para no romper el
      ritmo del habla.
    - `tramo_min`: tramos más cortos se descartan (chasquidos, golpes).
    """
    habla = complemento(silencios, duracion)
    habla = [t for t in habla if t.duracion >= tramo_min]
    con_margen = [
        Tramo(max(0.0, t.inicio - margen), min(duracion, t.fin + margen)) for t in habla
    ]
    return unir(con_margen, hueco_min)


def restar(tramos: list[Tramo], cortes: list[Tramo], tramo_min: float = 0.05) -> list[Tramo]:
    """Quita los intervalos `cortes` (p. ej. muletillas) de `tramos`."""
    resultado = list(tramos)
    for c in cortes:
        nuevo: list[Tramo] = []
        for t in resultado:
            if c.fin <= t.inicio or c.inicio >= t.fin:
                nuevo.append(t)
                continue
            if c.inicio > t.inicio:
                nuevo.append(Tramo(t.inicio, c.inicio))
            if c.fin < t.fin:
                nuevo.append(Tramo(c.fin, t.fin))
        resultado = nuevo
    return [t for t in resultado if t.duracion >= tramo_min]


def ajustar_a_fotogramas(tramos: list[Tramo], fps: float) -> list[Tramo]:
    """Alinea los cortes a fotogramas exactos.

    El audio se puede cortar en cualquier muestra, pero el video solo en
    fotogramas. Si no se alinean, cada corte introduce un pequeño desfase y,
    tras decenas de cortes, los labios dejan de coincidir con la voz.
    """
    if fps <= 0:
        return tramos
    resultado = []
    for t in tramos:
        inicio = math.floor(t.inicio * fps + 1e-6) / fps
        fin = math.ceil(t.fin * fps - 1e-6) / fps
        if fin > inicio:
            resultado.append(Tramo(round(inicio, 6), round(fin, 6)))
    return unir(resultado)


def reubicar(t: float, tramos: list[Tramo]) -> float | None:
    """Convierte un instante del video original al tiempo del video editado.

    Devuelve None si ese instante fue recortado.
    """
    acumulado = 0.0
    for tramo in tramos:
        if t < tramo.inicio:
            return None
        if t <= tramo.fin:
            return acumulado + (t - tramo.inicio)
        acumulado += tramo.duracion
    return None


def duracion_total(tramos: list[Tramo]) -> float:
    return sum(t.duracion for t in tramos)
