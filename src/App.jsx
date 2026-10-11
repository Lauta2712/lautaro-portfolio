import { useEffect } from 'react';
import './styles/global.css';
import Navbar  from './components/Navbar/Navbar';
import Intro   from './components/Intro/Intro';
import Archive from './components/Archive/Archive';
import About   from './components/About/About';
import Contact from './components/Contact/Contact';
import Cursor  from './components/Cursor/Cursor';
import CvPage  from './pages/CvPage';
import ToolsPage from './pages/ToolsPage';
import { startLenis, stopLenis } from './lib/lenis';

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
  const page = path === '/cv' ? 'cv' : path === '/tools' ? 'tools' : 'home';

  useEffect(() => {
    startLenis();
    return stopLenis;
  }, [page]);

  return (
    <>
      <Gridlines />
      <Cursor />
      <Navbar page={page} />
      <main>
        {page === 'cv' ? (
          <CvPage />
        ) : page === 'tools' ? (
          <ToolsPage />
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
