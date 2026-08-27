import './styles/global.css';
import GlobalField from './components/Background/GlobalField';
import Navbar     from './components/Navbar/Navbar';
import Hero       from './components/Hero/Hero';
import About      from './components/About/About';
import Experience from './components/Experience/Experience';
import Projects   from './components/Projects/Projects';
import TechStack  from './components/TechStack/TechStack';
import Contact    from './components/Contact/Contact';

export default function App() {
  return (
    <>
      <GlobalField />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <TechStack />
        <Contact />
      </main>
    </>
  );
}
