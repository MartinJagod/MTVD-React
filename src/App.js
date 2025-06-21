import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import Home from './pages/Home/index.jsx';
import Intro from './pages/Intro.jsx';              // ← tu componente Intro
import ProjectsSection from './pages/Projects/projectsSection';
import ProjectsHome from './pages/Projects/projectsHome.jsx';
import Project from './pages/Projects/Project.jsx';
import AwardsAndPress from './pages/PressAndAwards/AwardsAndPress';
import Studio from './pages/Studio/Studio';
import Contact from './pages/Contact/Contact.jsx';
import ScrollToTop from './components/ScrollToTop';

import './App.css';

/* ———————————————————————————————————————— */

function NotFoundRedirect() {
  const navigate = useNavigate();
  React.useEffect(() => { navigate('/'); }, [navigate]);
  return null;
}

/* Solo las rutas que llevan animación */
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <TransitionGroup>
      <CSSTransition
        key={location.pathname}
        classNames="slide-left"
        timeout={1000}
      >
        <Routes location={location}>
          <Route path="/project/:category/:projectName" element={<Project />} />
          <Route path="/projects" element={<ProjectsSection />} />
          <Route path="/projectsHome" element={<ProjectsHome />} />
          <Route path="/project/:id" element={<Project />} />
          <Route path="/awardsandpress" element={<AwardsAndPress />} />
          <Route path="/studio" element={<Studio />} />
          <Route path="/contact" element={<Contact />} />
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
        {/* Intro fuera del TransitionGroup, SIN animación */}
        <Route path="/intro" element={<Intro />} />

        {/* Todo lo demás con animación */}
        <Route path="/*" element={<AnimatedRoutes />} />
      </Routes>
    </Router>
  );
}
