import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Home from './pages/Home/index.jsx';
import ProjectsSection from './pages/Projects/projectsSection';
import ProjectsHome from './pages/Projects/projectsHome.jsx';
import Project from './pages/Projects/Project.jsx'; // Importa el componente Project
import AwardsAndPress from './pages/PressAndAwards/AwardsAndPress';
import Studio from './pages/Studio/Studio'; // Importa el componente Studio
import Contact from './pages/Contact/Contact.jsx'; // Importa el componente Contact
import ScrollToTop from './components/ScrollToTop'; // Asegúrate de crear este archivo

import './App.css'; // Asegúrate de que este archivo tenga las clases de animación

function NotFoundRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/"); // Redirige al Home
  }, [navigate]);
  return null; // No renderiza nada
}
function AnimatedRoutes() {
  const location = useLocation(); // Obtiene la ubicación actual de la ruta

  return (
    <TransitionGroup>
      <CSSTransition
        key={location.pathname} // Cambia la animación según la ruta
        classNames="slide-left" // Clase base para las animaciones
        timeout={1000} // Duración de la animación
      >
        <Routes location={location}>
          <Route path="/projects" element={<ProjectsSection />} />
          <Route path="/projectsHome" element={<ProjectsHome />} />
          <Route path="/project/:id" element={<Project />} /> {/* Ruta para un proyecto individual */}
          <Route path="/awardsandpress" element={<AwardsAndPress />} />
          <Route path="/studio" element={<Studio />} /> {/* Ruta para Studio */}
          <Route path="/contact" element={<Contact />} /> {/* Ruta para Contact */}
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFoundRedirect />} />
        </Routes>
      </CSSTransition>
    </TransitionGroup>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop /> {/* Este componente asegura el desplazamiento al inicio */}
      <div className="App">
        <AnimatedRoutes />
      </div>
    </Router>
  );
}

export default App;
