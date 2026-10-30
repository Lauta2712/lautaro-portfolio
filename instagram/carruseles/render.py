# Renderiza carruseles (1080×1350) e historias destacadas (1080×1920) a PNG, una imagen por slide.
#   uv run --with playwright python render.py              → todo
#   uv run --with playwright python render.py brief        → uno solo (carrusel o destacada)
import asyncio
import sys
from pathlib import Path

from playwright.async_api import async_playwright

HERE = Path(__file__).parent
PAGES = {
    "carrusel.html": ["brief", "compass", "monteca"],
    "historias.html": ["servicios", "proceso"],
}
ONLY = set(sys.argv[1:])


async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(executable_path="/usr/bin/google-chrome")
        page = await browser.new_page(viewport={"width": 1080, "height": 1920})
        for html, keys in PAGES.items():
            for key in keys:
                if ONLY and key not in ONLY:
                    continue
                await page.goto(f"file://{HERE / html}?p={key}")
                await page.wait_for_function("document.title === 'ready'")
                out = HERE / "png" / key
                out.mkdir(parents=True, exist_ok=True)
                for f in out.glob("*.png"):
                    f.unlink()
                for i, post in enumerate(await page.query_selector_all(".post"), 1):
                    await post.screenshot(path=out / f"{key}-{i:02d}.png")
                print(key, i)
        await browser.close()


asyncio.run(main())
