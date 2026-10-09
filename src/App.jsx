import { lazy, Suspense, useEffect } from 'react';
import './styles/global.css';
import Navbar  from './components/Navbar/Navbar';
import Intro   from './components/Intro/Intro';
import Archive from './components/Archive/Archive';
import About   from './components/About/About';
import Contact from './components/Contact/Contact';
import Cursor  from './components/Cursor/Cursor';
import CvPage  from './pages/CvPage';
import { startLenis, stopLenis } from './lib/lenis';

// El taller (posteos de Instagram) es una herramienta interna: va aparte del bundle.
const Taller = lazy(() => import('./pages/Taller/Taller'));

function Gridlines() {
  return (
    <div className="gridlines" aria-hidden="true">
      <div className="wrap">
        {Array.from({ length: 6 }, (_, i) => <span key={i} />)}
      </div>
    </div>
  );
}

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, '');
  const page = path === '/cv' ? 'cv' : path === '/taller' ? 'taller' : 'home';

  useEffect(() => {
    if (page === 'taller') return;
    startLenis();
    return stopLenis;
  }, [page]);

  if (page === 'taller') {
    return (
      <Suspense fallback={null}>
        <Taller />
      </Suspense>
    );
  }

  return (
    <>
      <Gridlines />
      <Cursor />
      <Navbar page={page} />
      <main>
        {page === 'cv' ? (
          <CvPage />
        ) : (
          <>
            <Intro />
            <Archive />
            <About />
            <Contact />
          </>
        )}
      </main>
    </>
  );
}
