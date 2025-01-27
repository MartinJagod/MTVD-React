import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../Parcial/Navbar';
import ContactFooter from '../Parcial/ContactFooter';
import './AwardsAndPress.css';
import home1 from '../../assets/images/home1.jpg';
import home2 from '../../assets/images/home2.jpg';
import fondo from '../../assets/images/fondopressAwards.jpg';
import interiorismo1 from '../../assets/images/Felicity.jpeg';
// Probamos un contador de fechas
const YearCounter = ({ targetYear }) => {
    const [currentYear, setCurrentYear] = useState(2000); // Cambiar el año inicial si es necesario
    const elementRef = useRef(null);
    const intervalRef = useRef(null); // Referencia para limpiar el intervalo
    const [isVisible, setIsVisible] = useState(false);
  
    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            resetCounter(); // Reinicia el contador cuando el elemento entre en pantalla
          } else {
            clearCounter(); // Limpia el intervalo si el elemento sale de pantalla
          }
        },
        { threshold: 0.5 } // Detecta si al menos el 50% del elemento es visible
      );
  
      if (elementRef.current) {
        observer.observe(elementRef.current);
      }
  
      return () => {
        if (elementRef.current) {
          observer.unobserve(elementRef.current);
        }
        clearCounter(); // Limpia el intervalo al desmontar el componente
      };
    }, []);
  
    // Función para reiniciar el contador
    const resetCounter = () => {
      clearCounter(); // Limpia cualquier intervalo existente
      setCurrentYear(1998); // Reinicia el estado del contador
  
      intervalRef.current = setInterval(() => {
        setCurrentYear((prevYear) => {
          if (prevYear < targetYear) {
            return prevYear + 1; // Incrementa el contador hasta el año objetivo
          } else {
            clearCounter(); // Detiene el contador al alcanzar el objetivo
            return targetYear;
          }
        });
      }, 20); // Ajusta la velocidad del contador (20ms entre incrementos)
    };
  
    // Limpia el intervalo
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
  
  // Hasta acá el contador
  

    const AwardsAndPress = () => {
        useEffect(() => {
            const handleScroll = () => {
                const container = document.querySelector('.timeline-horizontal'); // Contenedor desplazable
                const background = document.querySelector('.awards-and-press-background'); // Fondo
        
                if (container && background) {
                    const scrollPosition = container.scrollLeft; // Posición del scroll horizontal
                    const maxScroll = container.scrollWidth - container.clientWidth; // Ancho desplazable total
        
                    // Calcula la proporción del scroll y aplica un movimiento más lento al fondo
                    const scrollRatio = scrollPosition / maxScroll;
                    const backgroundOffset = scrollRatio * 75; // Reducir la velocidad con un multiplicador pequeño
                    background.style.backgroundPosition = `${backgroundOffset}% 0`; // Efecto parallax horizontal
                }
            };
        
            const container = document.querySelector('.timeline-horizontal');
            container.addEventListener('scroll', handleScroll);
        
            return () => {
                container.removeEventListener('scroll', handleScroll);
            };
        }, []);
        
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
    
        const [menuOpen, setMenuOpen] = useState(false);
        const [showInput, setShowInput] = useState(false);
        const [sectionHeights, setSectionHeights] = useState({
            firstSection: 0,
            secondSection: 0,
            thirdSection: 0,
        });
    
        const containerRef = useRef(null);
        const renderedYears = useRef(new Set()); // Mantiene los años ya renderizados
    
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
        return (
            <div className="awards-and-press" ref={containerRef}>
                <header className="projects-header">
                    <Navbar
                        menuOpen={menuOpen}
                        setMenuOpen={setMenuOpen}
                        showInput={showInput}
                        setShowInput={setShowInput}
                    />
                </header>
                <div className="timeline-container">
                    <div className="timeline-horizontal" style={{ overflowX: 'scroll', position: 'relative' }}>
                        <div
                            className="awards-and-press-background"
                            style={{
                                width: '1000%',
                                backgroundImage: `url(${fondo})`,
                            }}
                        ></div>
                        <div className="timeline-start-circle"></div>
                        <div className="timeline-line"></div>
                        {milestones.map((milestone, idx) => {
                            const yearHighlight = yearHighlights[milestone.year];
                            const showYearHighlight = !renderedYears.current.has(milestone.year);
    
                            // Marca el año como renderizado si es la primera vez que aparece
                            if (showYearHighlight) {
                                renderedYears.current.add(milestone.year);
                            }
    
                            return (
                                <React.Fragment key={`milestone-${idx}`}>
                                    {showYearHighlight && (
                                        <div
                                            className={`timeline-hito ${idx % 2 === 0 ? 'above' : 'below'}`}
                                            style={{

                                                height: '250px',
                                                textAlign: idx % 2 === 0 ? 'center' : 'center',
                                                transform: `translateY(${idx % 2 === 0 ? 68 : -60}px)`,
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
                                        className={`timeline-item ${idx % 2 === 0 ? 'above' : 'below'}`}
                                        style={{
                                            transform: `translateY(${idx % 2 !== 0 ? 48 : -47}px)`,
                                        }}
                                    >
                                        {renderSections(idx % 2 === 0, milestone)}
                                    </div>
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>
                <div>
                
                </div>
            </div>
        );
    };
    
    export default AwardsAndPress;
    