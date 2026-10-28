import { lazy, Suspense, useEffect } from 'react';
import './styles/global.css';
import Navbar  from './components/Navbar/Navbar';
import Intro   from './components/Intro/Intro';
import Archive from './components/Archive/Archive';
import About   from './components/About/About';
import Contact from './components/Contact/Contact';
import Cursor  from './components/Cursor/Cursor';
import Gridlines from './components/Gridlines/Gridlines';
import CommandPalette from './components/CommandPalette/CommandPalette';
import CvPage  from './pages/CvPage';
import ToolsPage from './pages/ToolsPage';
import { startLenis, stopLenis } from './lib/lenis';

// Fondos trae la librería de exportación a PNG: carga aparte del resto.
const WallpapersPage = lazy(() => import('./pages/WallpapersPage'));

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, '');
  const PAGES = { '/cv': 'cv', '/tools': 'tools', '/fondos': 'fondos' };
  const page = PAGES[path] ?? 'home';

  useEffect(() => {
    startLenis();
    return stopLenis;
  }, [page]);

  return (
    <>
      <Gridlines />
      <Cursor />
      <CommandPalette />
      <Navbar page={page} />
      <main>
        {page === 'cv' ? (
          <CvPage />
        ) : page === 'tools' ? (
          <ToolsPage />
        ) : page === 'fondos' ? (
          <Suspense fallback={null}>
            <WallpapersPage />
          </Suspense>
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
