import { useEffect, useMemo, useRef, useState } from 'react';
import { getFontEmbedCSS, toPng } from 'html-to-image';
import { COVER_DRAFT, MAX_SLIDES, NAMES_DRAFT, parseNames } from '../../data/taller';
import Slide from './Slide';
import styles from './Taller.module.css';

// Taller: página oculta para armar los posteos de Instagram con el sistema
// L20N. No está enlazada desde el sitio y no se indexa.

const STORAGE_KEY = 'l20n-taller';
const SIZE = { width: 1080, height: 1350 };

function loadDraft() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {};
  } catch {
    return {};
  }
}

function download(dataUrl, filename) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  a.click();
}

export default function Taller() {
  const [draft] = useState(loadDraft);
  const [number, setNumber] = useState(draft.number ?? '001');
  const [cover, setCover] = useState(draft.cover ?? COVER_DRAFT);
  const [names, setNames] = useState(draft.names ?? NAMES_DRAFT);
  const [busy, setBusy] = useState(false);
  const nodes = useRef([]);

  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex';
    document.head.appendChild(meta);
    document.title = 'Taller · L20N';
    return () => meta.remove();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ number, cover, names }));
    } catch {
      // Sin almacenamiento el taller funciona igual, solo no recuerda el borrador.
    }
  }, [number, cover, names]);

  const slides = useMemo(() => [
    { kind: 'cover', text: cover },
    ...parseNames(names).map((n) => ({ kind: 'name', ...n })),
    { kind: 'end' },
  ], [cover, names]);

  const tooMany = slides.length > MAX_SLIDES;

  async function exportSlides(indexes) {
    setBusy(true);
    try {
      await document.fonts.ready;
      const fontEmbedCSS = await getFontEmbedCSS(nodes.current[0]);
      for (const i of indexes) {
        const url = await toPng(nodes.current[i], { ...SIZE, pixelRatio: 1, fontEmbedCSS });
        download(url, `l20n-${number}-${String(i + 1).padStart(2, '0')}.png`);
      }
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setCover(COVER_DRAFT);
    setNames(NAMES_DRAFT);
  }

  return (
    <div className={styles.page}>
      <aside className={styles.panel}>
        <h1 className={styles.title}>Taller</h1>

        <label className={styles.field}>
          <span>Número de archivo</span>
          <input value={number} onChange={(e) => setNumber(e.target.value)} />
        </label>

        <label className={styles.field}>
          <span>Portada</span>
          <textarea rows={3} value={cover} onChange={(e) => setCover(e.target.value)} />
        </label>

        <label className={styles.field}>
          <span>Nombres · uno por línea, "nombre | motivo", # para ocultar</span>
          <textarea rows={18} value={names} onChange={(e) => setNames(e.target.value)} spellCheck={false} />
        </label>

        <p className={tooMany ? styles.warn : styles.count}>
          {slides.length} slides{tooMany && ` · Instagram acepta hasta ${MAX_SLIDES}`}
        </p>

        <div className={styles.actions}>
          <button type="button" onClick={() => exportSlides(slides.map((_, i) => i))} disabled={busy}>
            {busy ? 'Exportando…' : 'Descargar todas'}
          </button>
          <button type="button" className={styles.ghost} onClick={reset} disabled={busy}>
            Volver al borrador
          </button>
        </div>
      </aside>

      <main className={styles.grid}>
        {slides.map((slide, i) => (
          <figure key={i} className={styles.thumb}>
            <div className={styles.frame}>
              <div className={styles.scaler}>
                <Slide
                  ref={(el) => { nodes.current[i] = el; }}
                  slide={slide}
                  number={number}
                  index={i + 1}
                  total={slides.length}
                />
              </div>
            </div>
            <figcaption>
              <button type="button" className={styles.ghost} onClick={() => exportSlides([i])} disabled={busy}>
                PNG {String(i + 1).padStart(2, '0')} ↓
              </button>
            </figcaption>
          </figure>
        ))}
      </main>
    </div>
  );
}
