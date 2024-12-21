import React from 'react';
import './Home.css'; // Archivo CSS para estilizar Home

function Home({ onNavigate }) {
  return (
    <div className="home-content">
      <nav className="navbar">
        <div className="nav-left">
          <img src="/logo-mtvd.png" alt="Logo" className="logo" />
        </div>
        <div className="nav-right">
          <button onClick={() => onNavigate('Proyectos')}>Proyectos</button>
          <button onClick={() => onNavigate('PressAndAwards')}>Press and Awards</button>
          <button onClick={() => onNavigate('Jackpot')}>Studio</button>
          <button onClick={() => onNavigate('Contact')}>Contact</button>
          <button className="search-icon">🔍</button>
        </div>
      </nav>
      <img src="/foto1.jpg" alt="home1" className="full-viewport-image" />
      <div>
        <p className='weare'>
            We are a design studio
        </p>
      </div>
    </div>
  );
}

export default Home;

