# Genera las pistas de musica/: loops originales de house sintetizados desde cero,
# así que no tienen derechos de terceros. Cada pista tiene su tempo, tonalidad y patrones.
#   uv run --with numpy python music.py           → todas
#   uv run --with numpy python music.py noche     → una sola
# render.py usa la pista y el compás de arranque que indica cada reel en reels.js
# (campo music: { track, bar }), recortada y con fade out.
import sys
import wave
from pathlib import Path

HERE = Path(__file__).parent
SR = 44100
BARS = 16

# Acordes en MIDI, dos compases cada uno.
#   arp:  orden de las notas del arpegio (0-2 acorde +1 octava, 3 = tercera +2 octavas)
#   bass: 'offbeat' (contratiempo) o 'rolling' (semicorcheas salvo el tiempo fuerte)
#   kick: 'four' (en negras) o 'half' (1 y 3, más relajado)
TRACKS = {
    # progressive en La menor, la original
    'progresivo': dict(bpm=124, chords=[(57, 60, 64), (53, 57, 60), (48, 55, 64), (55, 59, 62)],
                       arp=[0, 1, 2, 3, 2, 1, 0, 2], bass='offbeat', kick='four', seed=7,
                       pad=0.12, arp_gain=0.09, bright=8),
    # deep house oscuro en Re menor, bajo rodante
    'noche': dict(bpm=118, chords=[(50, 53, 57), (46, 50, 53), (43, 46, 50), (45, 49, 52)],
                  arp=[0, 2, 1, 2, 0, 2, 3, 2], bass='rolling', kick='four', seed=11,
                  pad=0.10, arp_gain=0.07, bright=5),
    # brillante en Do mayor, arpegio que sube
    'brillante': dict(bpm=126, chords=[(60, 64, 67), (55, 59, 62), (57, 60, 64), (53, 57, 60)],
                      arp=[0, 1, 2, 3, 0, 1, 2, 3], bass='offbeat', kick='four', seed=3,
                      pad=0.11, arp_gain=0.10, bright=10),
    # tranqui en Mi menor, bombo en 1 y 3
    'tranqui': dict(bpm=108, chords=[(52, 55, 59), (48, 52, 55), (55, 59, 62), (50, 54, 57)],
                    arp=[2, 1, 0, 1, 3, 1, 0, 1], bass='offbeat', kick='half', seed=21,
                    pad=0.14, arp_gain=0.08, bright=6),
    # tenso en Do menor, rodante y rápido
    'tenso': dict(bpm=128, chords=[(48, 51, 55), (44, 48, 51), (51, 55, 58), (46, 50, 53)],
                  arp=[0, 0, 2, 1, 0, 3, 2, 1], bass='rolling', kick='four', seed=5,
                  pad=0.09, arp_gain=0.09, bright=9),
}


def bar_seconds(track):
    return 4 * 60 / TRACKS[track]['bpm']


def make(name, cfg):
    import numpy as np

    beat = 60 / cfg['bpm']
    bar = 4 * beat
    n = int(BARS * bar * SR)
    rng = np.random.default_rng(cfg['seed'])
    chords = cfg['chords']

    def hz(m):
        return 440 * 2 ** ((m - 69) / 12)

    def saw(f, t, harm=10, tilt=1.4):
        out = np.zeros_like(t)
        for k in range(1, harm + 1):
            if f * k > 12000:
                break
            out += np.sin(2 * np.pi * f * k * t) / k**tilt
        return out

    def place(buf, sig, start):
        i = int(start * SR)
        j = min(i + len(sig), len(buf))
        if i < len(buf):
            buf[i:j] += sig[: j - i]

    def chord_at(b):
        return chords[(b // 2) % 4]

    # Sidechain: todo lo que no es bombo "respira" con cada negra (o cada blanca si es half)
    step = beat if cfg['kick'] == 'four' else 2 * beat
    t_all = np.arange(n) / SR
    phase = (t_all % step) / step
    duck = 1 - 0.65 * np.exp(-phase * step / 0.11)
    duck[: int(bar * SR)] = 1  # el primer compás (intro, sin bombo) no respira

    kick, clap, hats, bass = (np.zeros(n) for _ in range(4))
    pad, arp = np.zeros((n, 2)), np.zeros((n, 2))

    # Bombo
    tk = np.arange(int(0.4 * SR)) / SR
    f_k = 45 + 110 * np.exp(-tk / 0.035)
    k = np.sin(2 * np.pi * np.cumsum(f_k) / SR) * np.exp(-tk / 0.18)
    k += 0.3 * np.sin(2 * np.pi * np.cumsum(f_k) / SR) * np.exp(-tk / 0.01)  # click
    hits = range(4) if cfg['kick'] == 'four' else (0, 2)
    for b in range(1, BARS):
        for q in hits:
            place(kick, k, b * bar + q * beat)

    # Clap en 2 y 4
    tc = np.arange(int(0.25 * SR)) / SR
    noise = rng.standard_normal(len(tc))
    nz = noise - np.convolve(noise, np.ones(6) / 6, mode="same")
    c = nz * (np.exp(-tc / 0.06) + 0.6 * np.exp(-np.maximum(tc - 0.012, 0) / 0.05) * (tc > 0.012))
    for b in range(2, BARS):
        for q in (1, 3):
            place(clap, c, b * bar + q * beat)

    # Hats: abierto a contratiempo, cerrado en semicorcheas suave
    def hat(dur, decay):
        t = np.arange(int(dur * SR)) / SR
        x = rng.standard_normal(len(t))
        hp = x - np.convolve(x, np.ones(3) / 3, mode="same")
        return hp * np.exp(-t / decay)

    open_h, closed_h = hat(0.2, 0.05), hat(0.06, 0.012)
    for b in range(BARS):
        for q in range(4):
            place(hats, open_h * (0.5 if b == 0 else 1), b * bar + q * beat + beat / 2)
            if b >= 4:
                for s in (0, 1, 3):
                    place(hats, closed_h * 0.35, b * bar + q * beat + s * beat / 4)

    # Bajo (raíz del acorde, una octava abajo)
    rolling = cfg['bass'] == 'rolling'
    for b in range(1, BARS):
        root = chord_at(b)[0] - 12
        length = beat * (0.22 if rolling else 0.45)
        tb = np.arange(int(length * SR)) / SR
        env = np.minimum(tb / 0.005, 1) * np.exp(-tb / (0.09 if rolling else 0.16))
        note = (saw(hz(root), tb, harm=6, tilt=1.8) + 0.8 * np.sin(2 * np.pi * hz(root) * tb)) * env
        for q in range(4):
            offs = (1, 2, 3) if rolling else (2,)
            for s in offs:
                place(bass, note * (0.8 if rolling else 1), b * bar + q * beat + s * beat / 4)

    # Pad: tres voces desafinadas por nota, ataque lento, abierto en estéreo
    for b in range(0, BARS, 2):
        dur = 2 * bar
        tp = np.arange(int(dur * SR)) / SR
        env = np.minimum(tp / 0.6, 1) * np.minimum((dur - tp) / 0.3, 1)
        for m in chord_at(b):
            for d, pan in ((-0.08, 0.2), (0, 0.5), (0.08, 0.8)):
                v = saw(hz(m + d), tp, harm=cfg['bright'], tilt=1.6) * env * cfg['pad']
                place(pad[:, 0], v * (1 - pan), b * bar)
                place(pad[:, 1], v * pan, b * bar)

    # Arpegio en semicorcheas, con delay de corchea con puntillo
    for b in range(BARS):
        ch = chord_at(b)
        notes = [m + 12 for m in ch] + [ch[1] + 24]
        for s in range(16):
            m = notes[cfg['arp'][s % 8]]
            ta = np.arange(int(0.22 * SR)) / SR
            env = np.minimum(ta / 0.003, 1) * np.exp(-ta / 0.07)
            v = (np.sin(2 * np.pi * hz(m) * ta) + 0.3 * saw(hz(m), ta, harm=5, tilt=2)) * env
            v *= cfg['arp_gain'] * (0.6 + 0.4 * (s % 4 == 0)) * min(1, 0.4 + b / 4)
            pan = 0.35 if s % 2 else 0.65
            place(arp[:, 0], v * (1 - pan), b * bar + s * beat / 4)
            place(arp[:, 1], v * pan, b * bar + s * beat / 4)

    delay = int(0.75 * beat * SR)
    echo = np.zeros_like(arp)
    src = arp.copy()
    for rep, g in enumerate((0.45, 0.28, 0.16)):
        shift = delay * (rep + 1)
        side = rep % 2  # ping-pong
        echo[shift:, 1 - side] += src[:-shift, side] * g + src[:-shift, 1 - side] * g * 0.3
    arp += echo

    def mono(x, g):
        return np.stack([x * g, x * g], axis=1)

    mix = (
        mono(kick, 0.9)
        + mono(clap, 0.12)
        + np.stack([hats * 0.10, hats * 0.13], axis=1)
        + mono(bass * duck, 0.32)
        + pad * duck[:, None]
        + arp * duck[:, None]
    )
    mix = np.tanh(mix * 1.1)
    mix /= np.max(np.abs(mix)) / 0.89

    out = HERE / "musica" / f"{name}.wav"
    out.parent.mkdir(exist_ok=True)
    with wave.open(str(out), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((mix * 32767).astype("<i2").tobytes())
    print(out, f"{n / SR:.1f}s")


if __name__ == "__main__":
    only = set(sys.argv[1:])
    for name, cfg in TRACKS.items():
        if not only or name in only:
            make(name, cfg)
