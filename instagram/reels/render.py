# Renderiza los reels de reels.js a MP4 (1080×1920, 30 fps, H.264 con pista de audio muda)
# y guarda una portada PNG de cada uno.
#   uv run --with playwright --with imageio-ffmpeg python render.py          → todos
#   uv run --with playwright --with imageio-ffmpeg python render.py 02-a-mano → uno solo
import asyncio
import subprocess
import sys
from pathlib import Path

import imageio_ffmpeg
from playwright.async_api import async_playwright

HERE = Path(__file__).parent
FPS = 30
ONLY = set(sys.argv[1:])


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
            await page.evaluate("render(1.2)")
            await page.screenshot(path=HERE / "portadas" / f"{key}.png")
            out = HERE / "mp4" / f"{key}.mp4"
            proc = subprocess.Popen(
                [ffmpeg, "-y", "-loglevel", "error",
                 "-f", "image2pipe", "-framerate", str(FPS), "-i", "-",
                 "-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo",
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
