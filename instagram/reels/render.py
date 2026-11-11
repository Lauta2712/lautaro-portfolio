# Renderiza los reels de reels.js a MP4 (1080×1920, 30 fps, H.264 con la pista de musica/ que
# indica cada reel, arrancando en el compás que diga; si no hay, pista muda. Las pistas se generan
# con music.py)
# y guarda una portada PNG de cada uno.
#   uv run --with playwright --with imageio-ffmpeg python render.py          → todos
#   uv run --with playwright --with imageio-ffmpeg python render.py 02-a-mano → uno solo
import asyncio
import subprocess
import sys
from pathlib import Path

import imageio_ffmpeg
from playwright.async_api import async_playwright

from music import bar_seconds

HERE = Path(__file__).parent
FPS = 30
ONLY = set(sys.argv[1:])


def audio_in(total, music):
    track = HERE / "musica" / f"{music['track']}.wav" if music else None
    if not track or not track.exists():
        return ["-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo"]
    start = music.get("bar", 0) * bar_seconds(music["track"])
    fade = (f"afade=t=in:d=0.05,afade=t=out:st={max(total - 1.5, 0):.2f}:d=1.5,volume=-4dB")
    return ["-ss", f"{start:.3f}", "-i", str(track), "-af", fade]


async def main():
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    (HERE / "mp4").mkdir(exist_ok=True)
    (HERE / "portadas").mkdir(exist_ok=True)
    async with async_playwright() as p:
        browser = await p.chromium.launch(executable_path="/usr/bin/google-chrome")
        page = await browser.new_page(viewport={"width": 1080, "height": 1920})
        await page.goto(f"file://{HERE / 'reel.html'}")
        await page.wait_for_function("document.title === 'ready'")
        for key in await page.evaluate("Object.keys(window.REELS)"):
            if ONLY and key not in ONLY:
                continue
            total = await page.evaluate(f"load({key!r})")
            music = await page.evaluate(f"window.REELS[{key!r}].music || null")
            await page.evaluate("render(1.2)")
            await page.screenshot(path=HERE / "portadas" / f"{key}.png")
            out = HERE / "mp4" / f"{key}.mp4"
            proc = subprocess.Popen(
                [ffmpeg, "-y", "-loglevel", "error",
                 "-f", "image2pipe", "-framerate", str(FPS), "-i", "-",
                 *audio_in(total, music),
                 "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18", "-preset", "medium",
                 "-c:a", "aac", "-shortest", "-movflags", "+faststart", str(out)],
                stdin=subprocess.PIPE,
            )
            frames = round(total * FPS)
            for i in range(frames):
                await page.evaluate(f"render({i / FPS})")
                proc.stdin.write(await page.screenshot(type="png"))
            proc.stdin.close()
            proc.wait()
            print(key, f"{total:.1f}s", frames, "cuadros")
        await browser.close()


asyncio.run(main())
