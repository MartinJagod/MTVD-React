import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import ReactGA from 'react-ga4'; // ← IMPORTANTE

import Home from './pages/Home/index.jsx';
import Intro from './pages/Intro.jsx';
import Privacy from "./pages/Privacy/Privacy";
import ProjectsSection from './pages/Projects/projectsSection';
import ProjectsHome from './pages/Projects/projectsHome.jsx';
import ProjectEntry from './pages/Projects/ProjectEntry.jsx';
import AwardsAndPress from './pages/PressAndAwards/AwardsAndPress';
import Studio from './pages/Studio/Studio';
import Contact from './pages/Contact/Contact.jsx';
import ScrollToTop from './components/ScrollToTop';

import './App.css';

/* ———————————————————————————————————————— */

function NotFoundRedirect() {
  const navigate = useNavigate();
  useEffect(() => { navigate('/'); }, [navigate]);
  return null;
}

/* Hook personalizado para enviar pageview */
function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    ReactGA.initialize('G-9D3VNBH4CT'); // ← tu ID de medición
  }, []);

  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: location.pathname + location.search });
  }, [location]);
}

/* Solo las rutas que llevan animación */
function AnimatedRoutes() {
  const location = useLocation();
  usePageTracking(); // ← Agregamos el tracking acá

  return (
    <TransitionGroup>
      <CSSTransition
        key={location.pathname}
        classNames="slide-left"
        timeout={1000}
      >
        <Routes location={location}>
          <Route path="/project/:category/:projectName" element={<ProjectEntry />} />
          <Route path="/projects" element={<ProjectsSection />} />
          <Route path="/projectsHome" element={<ProjectsSection />} />
          <Route path="/awardsandpress" element={<AwardsAndPress />} />
          <Route path="/studio" element={<Studio />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFoundRedirect />} />
        </Routes>
      </CSSTransition>
    </TransitionGroup>
  );
}

/* ———————————————————————————————————————— */

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/intro" element={<Intro />} />
        <Route path="/*" element={<AnimatedRoutes />} />
      </Routes>
    </Router>
  );
}
