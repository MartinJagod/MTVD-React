import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Home from './pages/Home/index.jsx';
import ProjectsSection from './pages/Projects/projectsSection';
import ProjectsHome from './pages/Projects/projectsHome.jsx';
import './App.css'; // Asegúrate de que este archivo tenga las clases de animación

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
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<ProjectsSection />} />
          <Route path="/projectsHome" element={<ProjectsHome />} />
        </Routes>
      </CSSTransition>
    </TransitionGroup>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <AnimatedRoutes />
      </div>
    </Router>
  );
}

export default App;
