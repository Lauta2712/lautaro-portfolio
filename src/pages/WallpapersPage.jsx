import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getFontEmbedCSS, toPng } from 'html-to-image';
import { dataFromSeed, signatureLetters } from '../components/Signature/signature';
import styles from './WallpapersPage.module.css';

// Fondos: la firma L20N de cualquier texto (un nombre, una fecha, lo que
// sea) como fondo de pantalla. Mismo texto, misma firma.

const FORMS = {
  line: [[0, 1, 2, 3]],
  stacked: [[0, 1], [2, 3]],
  column: [[0], [1], [2], [3]],
};

// Cuánto de la pantalla puede ocupar la firma, a lo ancho y a lo alto.
const FILL = { width: 0.8, height: 0.72 };

// El fondo se dibuja a la mitad de su tamaño y se exporta al doble.
const RATIO = 2;

function screenSize() {
  const dpr = window.devicePixelRatio || 1;
  return { width: Math.round(window.screen.width * dpr), height: Math.round(window.screen.height * dpr) };
}

const SIZES = [
  { id: 'screen', ...screenSize() },
  { id: 'phone', width: 1179, height: 2556 },
  { id: 'android', width: 1080, height: 2400 },
  { id: 'desktop', width: 2560, height: 1440 },
  { id: '4k', width: 3840, height: 2160 },
];

const randomSeed = () => Math.random().toString(36).slice(2, 7);

function Wallpaper({ seed, form, bg, width, height, ref }) {
  const sigRef = useRef(null);
  const letters = signatureLetters(dataFromSeed(seed || ' '));

  // Mide la firma a 100px y la escala hasta llenar el espacio que le toca.
  useLayoutEffect(() => {
    const el = sigRef.current;
    if (!el) return undefined;
    let alive = true;
    const fit = () => {
      if (!alive) return;
      el.style.fontSize = '100px';
      const scale = Math.min((width * FILL.width) / el.scrollWidth, (height * FILL.height) / el.scrollHeight);
      el.style.fontSize = `${100 * scale}px`;
    };
    fit();
    document.fonts?.ready.then(fit);
    return () => { alive = false; };
  }, [seed, form, width, height]);

  return (
    <div ref={ref} className={`${styles.wallpaper} ${styles[bg]}`} style={{ width, height }}>
      <div ref={sigRef} className={styles.sig} aria-label="L20N" role="img">
        {FORMS[form].map((row, i) => (
          <div key={i} className={styles.row}>
            {row.map((j) => (
              <span key={j} style={letters[j].style} aria-hidden="true">{letters[j].letter}</span>
            ))}
          </div>
        ))}
      </div>
      <span className={styles.seed} style={{ fontSize: Math.min(width, height) * 0.022 }}>{seed}</span>
    </div>
  );
}

export default function WallpapersPage() {
  const { t } = useTranslation();
  const [seed, setSeed] = useState(randomSeed);
  const [form, setForm] = useState('line');
  const [bg, setBg] = useState('dark');
  const [sizeId, setSizeId] = useState('screen');
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState({ width: 0, height: 0 });
  const stageRef = useRef(null);
  const nodeRef = useRef(null);

  const size = SIZES.find((s) => s.id === sizeId);
  const logical = { width: size.width / RATIO, height: size.height / RATIO };
  // La vista previa entra a lo ancho y a lo sumo ocupa el 72% del alto de la ventana.
  const preview = stage.width ? Math.min(stage.width / logical.width, stage.height / logical.height) : 0;
  const title = t('wallpapers.title');

  useEffect(() => {
    const previous = document.title;
    document.title = `${title} · L20N`;
    return () => { document.title = previous; };
  }, [title]);

  useLayoutEffect(() => {
    const el = stageRef.current;
    const measure = () => setStage({ width: el.clientWidth, height: window.innerHeight * 0.72 });
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    window.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  async function download() {
    setBusy(true);
    try {
      await document.fonts.ready;
      const node = nodeRef.current;
      const fontEmbedCSS = await getFontEmbedCSS(node);
      const url = await toPng(node, { ...logical, pixelRatio: RATIO, fontEmbedCSS });
      const name = (seed || 'l20n').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const a = document.createElement('a');
      a.href = url;
      a.download = `l20n-${name}-${size.width}x${size.height}.png`;
      a.click();
    } finally {
      setBusy(false);
    }
  }

  const options = (key, values, current, set) => (
    <div className={styles.field}>
      <span className={styles.label}>{t(`wallpapers.${key}`)}</span>
      <div className={styles.options}>
        {values.map((v) => (
          <button
            key={v}
            type="button"
            className={v === current ? styles.on : styles.off}
            aria-pressed={v === current}
            onClick={() => set(v)}
          >
            {t(`wallpapers.${key}s.${v}`)}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className={styles.page}>
      <header className={`wrap ${styles.head}`}>
        <a href="/" className={styles.back}>← {t('cv.back')}</a>
        <h1 className={styles.title}>{title}</h1>
      </header>

      <div className={`wrap ${styles.body}`}>
        <div ref={stageRef} className={styles.stage}>
          <div className={styles.box} style={{ width: logical.width * preview, height: logical.height * preview }}>
            <div className={styles.scaler} style={{ transform: `scale(${preview})` }}>
              <Wallpaper ref={nodeRef} seed={seed} form={form} bg={bg} {...logical} />
            </div>
          </div>
        </div>

        <div className={styles.controls}>
          <label className={styles.field}>
            <span className={styles.label}>{t('wallpapers.seed')}</span>
            <div className={styles.seedRow}>
              <input
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                maxLength={40}
                spellCheck={false}
                autoComplete="off"
              />
              <button type="button" className={styles.off} onClick={() => setSeed(randomSeed())}>
                {t('wallpapers.another')}
              </button>
            </div>
          </label>

          {options('form', Object.keys(FORMS), form, setForm)}
          {options('bg', ['dark', 'light'], bg, setBg)}
          {options('size', SIZES.map((s) => s.id), sizeId, setSizeId)}

          <p className={styles.dims}>{size.width} × {size.height}</p>

          <button type="button" className={styles.cta} onClick={download} disabled={busy}>
            {busy ? t('wallpapers.busy') : `${t('wallpapers.download')} ↓`}
          </button>
        </div>
      </div>
    </div>
  );
}
