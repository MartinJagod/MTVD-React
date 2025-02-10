import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import Navbar from '../Parcial/Navbar';
import ContactFooter from '../Parcial/ContactFooter';
import './AwardsAndPress.css';
import home1 from '../../assets/images/home1.jpg';
import home2 from '../../assets/images/home2.jpg';
import fondo from '../../assets/images/fondopressAwards.jpg';
import interiorismo1 from '../../assets/images/Felicity.jpeg';

const AwardsAndPress = () => {

// Contador de año (YearCounter) se mantiene igual
const YearCounter = ({ targetYear }) => {
  const [currentYear, setCurrentYear] = useState(2000);
  const elementRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          resetCounter();
        } else {
          clearCounter();
        }
      },
      { threshold: 0.5 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
      clearCounter();
    };
  }, []);

  const resetCounter = () => {
    clearCounter();
    setCurrentYear(1998);
    intervalRef.current = setInterval(() => {
      setCurrentYear((prevYear) => {
        if (prevYear < targetYear) {
          return prevYear + 1;
        } else {
          clearCounter();
          return targetYear;
        }
      });
    }, 20);
  };

  const clearCounter = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return (
    <div ref={elementRef} className="timeline-hito-year">
      {currentYear}
    </div>
  );
};

  // Manejadores para el Navbar
 // Inicio animación de menú 
 const navigate = useNavigate();
        const [showInput, setShowInput] = useState(false);
        const [menuOpen, setMenuOpen] = useState(false);
        const [searchTerm, setSearchTerm] = useState('');
        const [isSliding, setIsSliding] = useState(false); // Controla el deslizamiento del Navbar
        const options = ['Architecture', 'Awards', 'Asphalt', 'Aluminum', 'Aggregate', 'Asbestos', 'Adhesive', 'Anchor', 'Acrylic', 'Acoustic'];

        useEffect(() => {
            if (menuOpen) {
                const links = document.querySelectorAll('.menu-link');
                const dash = document.querySelector('.menu-dash');
    
                // Espera 3 segundos antes de iniciar las animaciones
                const timeout = setTimeout(() => {
                    links.forEach((link, index) => {
                        setTimeout(() => {
                            link.classList.add('animate-color');
                            dash.className = `menu-dash ${link.classList[1]}`; // Sincroniza el color del guion
    
                            setTimeout(() => {
                                link.classList.remove('animate-color');
                                if (index === links.length - 1) {
                                    dash.className = 'menu-dash'; // Resetea el guion al final
                                }
                            }, 200); // Duración para volver al estado inicial
                        }, index * 200); // Espaciado entre animaciones
                    });
                }, 500); // Espera 0.5 segundos para que el menú se abra completamente y haga color al guion
    
                // Limpia el timeout al desmontar el componente o si `menuOpen` cambia
                return () => clearTimeout(timeout);
            }
        }, [menuOpen]);
        // Fin animación de menú

  const containerRef = useRef(null);
  const renderedYears = useRef(new Set());

  const milestones = [
    {
      year: '2014',
      title: 'Toke-In',
      image: home1,
      notes: [
        'Nota Revista Deck',
        'Nota Clarín',
        'Nota Arch Daily Chile',
        'Nota Homify',
        'Nota Houzz',
      ],
    },
    {
      year: '2014',
      title: 'Toke-In',
      image: home1,
      notes: [
        'Nota Revista Deck',
        'Nota Clarín',
        'Nota Arch Daily Chile',
        'Nota Homify',
        'Nota Houzz',
      ],
    },
    {
      year: '2015',
      title: 'Medialunas Calentitas',
      image: home2,
      notes: [
        'Nota Revista Deck',
        'Nota Clarín',
        'Nota Arch Daily Chile',
        'Nota Homify',
        'Nota Houzz',
      ],
    },
    {
      year: '2016',
      title: 'Felicity',
      image: interiorismo1,
      notes: [
        'Nota Revista Deck',
        'Nota Clarín',
        'Nota Arch Daily Chile',
        'Nota Homify',
        'Nota Houzz',
      ],
    },
    {
      year: '2016',
      title: 'Otro proyecto',
      image: interiorismo1,
      notes: [
        'Nota Revista Deck',
        'Nota Clarín',
        'Nota Arch Daily Chile',
        'Nota Homify',
        'Nota Houzz',
      ],
    },
    {
      year: '2017',
      title: 'Toke-In',
      image: home1,
      notes: [
        'Nota Revista Deck',
        'Nota Clarín',
        'Nota Arch Daily Chile',
        'Nota Homify',
        'Nota Houzz',
      ],
    },
    {
      year: '2018',
      title: 'Medialunas Calentitas',
      image: home2,
      notes: [
        'Nota Revista Deck',
        'Nota Clarín',
        'Nota Arch Daily Chile',
      ],
    },
    {
      year: '2019',
      title: 'Felicity',
      image: interiorismo1,
      notes: [
        'Nota Revista Deck',
        'Nota Clarín',
        'Nota Arch Daily Chile',
        'Nota Homify',
        'Nota Houzz',
      ],
    },
  ];

  const yearHighlights = {
    2014: 'Nos juntamos a hacer un estudio de diseño.',
    2015: 'Muchos proyectos y marcas nuevas. Empezamos a diseñar más allá de Córdoba.',
    2016: 'Nos expandimos al mercado internacional.',
    2017: 'Lanzamos nuestro primer proyecto destacado en Nueva York.',
    2018: 'Fuimos reconocidos por nuestra innovación en diseño.',
    2019: 'Abrimos una nueva sede en Buenos Aires.',
  };

  const renderSections = (isAbove, milestone) => {
    if (isAbove) {
      return (
        <>
          <div className="timeline-first-section">
            <p className="timeline-title-item">{milestone.title}</p>
          </div>
          <div className="timeline-second-section">
            <img
              src={milestone.image}
              alt={milestone.title}
              className="timeline-image"
            />
          </div>
          <div className="timeline-third-section">
            <ul className="timeline-notes">
              {milestone.notes.map((note, noteIdx) => (
                <li key={noteIdx} className="timeline-note">
                  {note}
                </li>
              ))}
            </ul>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="timeline-third-section">
            <ul className="timeline-notes">
              {milestone.notes.map((note, noteIdx) => (
                <li key={noteIdx} className="timeline-note">
                  {note}
                </li>
              ))}
            </ul>
          </div>
          <div className="timeline-second-section">
            <img
              src={milestone.image}
              alt={milestone.title}
              className="timeline-image"
            />
          </div>
          <div className="timeline-first-section">
            <p className="timeline-title-item">{milestone.title}</p>
          </div>
        </>
      );
    }
  };

  return (
    <div className="awards-and-press" ref={containerRef}>
      <header className="projects-header">
        <Navbar
           isSliding={isSliding}
           menuOpen={menuOpen}
           setMenuOpen={setMenuOpen}
           showInput={showInput}
           setShowInput={setShowInput}
        />
      </header>
      <div className="timeline-container">
        <div
          className="timeline-horizontal"
          style={{ overflowX: 'scroll', position: 'relative' }}
        >
          <div
            className="awards-and-press-background"
            style={{
              width: '1000%',
              backgroundImage: `url(${fondo})`,
            }}
          ></div>
          <div className="timeline-start-circle"></div>
          {/* La línea se dibuja automáticamente con CSS */}
          <div className="timeline-line"></div>
          {milestones.map((milestone, idx) => {
            const yearHighlight = yearHighlights[milestone.year];
            const showYearHighlight = !renderedYears.current.has(milestone.year);
            if (showYearHighlight) {
              renderedYears.current.add(milestone.year);
            }
            return (
              <React.Fragment key={`milestone-${idx}`}>
                {showYearHighlight && (
                  <div
                    className={`timeline-hito fade-in ${idx % 2 === 0 ? 'above' : 'below'}`}
                    style={{
                      height: '300px',
                      textAlign: 'center',
                      transform: `translateY(${idx % 2 === 0 ? 80 : -45}px)`,
                      animationDelay: `${idx * 0.8}s`,
                    }}
                  >
                    {idx % 2 === 0 && (
                      <YearCounter targetYear={parseInt(milestone.year, 10)} />
                    )}
                    <div className="timeline-hito-phrase">{yearHighlight}</div>
                    {idx % 2 !== 0 && (
                      <YearCounter targetYear={parseInt(milestone.year, 10)} />
                    )}
                  </div>
                )}
                <div
                  className={`timeline-item fade-in ${idx % 2 === 0 ? 'above' : 'below'}`}
                  style={{
                    transform: `translateY(${idx % 2 !== 0 ? 48 : -47}px)`,
                    animationDelay: `${idx * 0.8 + 0.3}s`,
                  }}
                >
                  {renderSections(idx % 2 === 0, milestone)}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AwardsAndPress;
