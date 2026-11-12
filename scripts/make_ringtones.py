"""Synthesise the bundled ringtones.

The tones are generated rather than downloaded, so they carry no licence of
their own and can be rebuilt byte for byte: the output only depends on this
file. Each one is a short loop; the integration plays it again as soon as the
media player reports it has finished, for as long as the alarm rings.

    python scripts/make_ringtones.py

WAV rather than MP3 because the standard library writes it without an
encoder. A player that fetches a file from a URL plays it; an Echo fetches
nothing and gets a sound from Amazon's library instead (see sound.py).
"""

import math
import pathlib
import struct
import wave

RATE = 22050
OUT = pathlib.Path(__file__).parent.parent / "custom_components/alarm_clocks/sounds"


def tone(freq: float, seconds: float, partials=((1, 1.0),), decay: float = 0.0) -> list[float]:
    """A tone with the given partials, a short fade-in and an optional decay."""
    count = int(RATE * seconds)
    fade = int(RATE * 0.005)
    samples = []
    for i in range(count):
        t = i / RATE
        value = sum(amp * math.sin(2 * math.pi * freq * mult * t) for mult, amp in partials)
        if decay:
            value *= math.exp(-decay * t)
        # Fade both ends so that no tone starts or stops with a click.
        value *= min(1.0, i / fade, (count - 1 - i) / fade)
        samples.append(value)
    return samples


def silence(seconds: float) -> list[float]:
    return [0.0] * int(RATE * seconds)


def mix(*layers: tuple[float, list[float]]) -> list[float]:
    """Lay tones over each other, each starting at its offset in seconds."""
    length = max(int(RATE * start) + len(samples) for start, samples in layers)
    out = [0.0] * length
    for start, samples in layers:
        offset = int(RATE * start)
        for i, value in enumerate(samples):
            out[offset + i] += value
    return out


SQUARISH = ((1, 1.0), (3, 0.3), (5, 0.12))
BELL = ((1, 1.0), (2.76, 0.45), (5.4, 0.2), (8.93, 0.08))
MARIMBA = ((1, 1.0), (4, 0.25), (10, 0.05))


def classic() -> list[float]:
    """The bedside alarm clock: four beeps, a pause, four beeps."""
    burst: list[float] = []
    for _ in range(4):
        burst += tone(1000, 0.09, SQUARISH) + silence(0.07)
    return burst + silence(0.45) + burst + silence(0.6)


def digital() -> list[float]:
    """A wristwatch: quick chirps alternating between two pitches."""
    out: list[float] = []
    for _ in range(2):
        for freq in (2000, 2400, 2000, 2400, 2000, 2400):
            out += tone(freq, 0.05, SQUARISH) + silence(0.03)
        out += silence(0.5)
    return out


def chime() -> list[float]:
    """A rising bell arpeggio, left to ring out."""
    notes = (523.25, 659.25, 783.99, 1046.5)
    return mix(
        *((index * 0.35, tone(freq, 2.4, BELL, decay=2.2)) for index, freq in enumerate(notes))
    ) + silence(0.4)


def gentle() -> list[float]:
    """A soft, low marimba figure for the lighter sleeper."""
    figure = (392.0, 493.88, 587.33, 493.88, 392.0, 587.33)
    return mix(
        *((index * 0.42, tone(freq, 1.2, MARIMBA, decay=4.5)) for index, freq in enumerate(figure))
    ) + silence(0.8)


RINGTONES = {"classic": classic, "digital": digital, "chime": chime, "gentle": gentle}


def write(path: pathlib.Path, samples: list[float]) -> None:
    """Normalise to -3 dBFS and write 16-bit mono."""
    peak = max(abs(value) for value in samples) or 1.0
    scale = 0.708 * 32767 / peak
    with wave.open(str(path), "wb") as out:
        out.setnchannels(1)
        out.setsampwidth(2)
        out.setframerate(RATE)
        out.writeframes(b"".join(struct.pack("<h", round(v * scale)) for v in samples))


if __name__ == "__main__":
    OUT.mkdir(exist_ok=True)
    for name, build in RINGTONES.items():
        samples = build()
        write(OUT / f"{name}.wav", samples)
        print(f"{name}.wav  {len(samples) / RATE:.2f} s")
