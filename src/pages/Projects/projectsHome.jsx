import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import './projectsHome.css';
import Navbar from '../Parcial/Navbar';
import ContactFooter from '../Parcial/ContactFooter';
import Carousel from './Carousel';

function ProjectsHome() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [imagenesColumna1, setImagenesColumna1] = useState([]);
    const [imagenesColumna2, setImagenesColumna2] = useState([]);
    const [imagenesColumna3, setImagenesColumna3] = useState([]);

    // Inicio animación de menú
    const [showInput, setShowInput] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (menuOpen) {
            const links = document.querySelectorAll('.menu-link');
            const dash = document.querySelector('.menu-dash');

            const timeout = setTimeout(() => {
                links.forEach((link, index) => {
                    setTimeout(() => {
                        link.classList.add('animate-color');
                        dash.className = `menu-dash ${link.classList[1]}`;

                        setTimeout(() => {
                            link.classList.remove('animate-color');
                            if (index === links.length - 1) {
                                dash.className = 'menu-dash';
                            }
                        }, 200);
                    }, index * 200);
                });
            }, 500);

            return () => clearTimeout(timeout);
        }
    }, [menuOpen]);

    // Inicio auto ocultado del Navbar
    const [isSliding, setIsSliding] = useState(false);
    let activityTimeout = null;

    useEffect(() => {
        const handleUserActivity = () => {
            setIsSliding(false);

            if (activityTimeout) {
                clearTimeout(activityTimeout);
            }

            activityTimeout = setTimeout(() => {
                if (!menuOpen && !showInput) {
                    setIsSliding(false);
                }
            }, 20000);
        };

        window.addEventListener('mousemove', handleUserActivity);
        window.addEventListener('scroll', handleUserActivity);
        window.addEventListener('click', handleUserActivity);

        return () => {
            window.removeEventListener('mousemove', handleUserActivity);
            window.removeEventListener('scroll', handleUserActivity);
            window.removeEventListener('click', handleUserActivity);
            if (activityTimeout) {
                clearTimeout(activityTimeout);
            }
        };
    }, [menuOpen, showInput]);

    // 📌 Fetch a la API local en lugar de Pixabay
    useEffect(() => {
        setLoading(true);

        fetch("http://193.203.182.77:5000/api/projects-home")
            .then(response => response.json())
            .then(({ design, architecture, branding }) => {
                console.log("✅ Imágenes cargadas desde API local:", { design, architecture, branding });

                setImagenesColumna1(design.hits);
                setImagenesColumna2(architecture.hits);
                setImagenesColumna3(branding.hits);
                setLoading(false);

                // Realizar el scroll después de cargar las imágenes
                setTimeout(() => {
                    scrollCarousel("carousel-design", 10);
                    scrollCarousel("carousel-architecture", 7);
                    scrollCarousel("carousel-branding", 13);
                }, 1000);
            })
            .catch(error => {
                console.error("❌ Error cargando imágenes:", error);
                setError(true);
                setLoading(false);
            });
    }, []);

    const scrollCarousel = (carouselId, targetIndex) => {
        const carouselWrapper = document.getElementById(carouselId);
        if (carouselWrapper) {
            const carouselContainer = carouselWrapper.querySelector('.carousel-container-projectsHome');
            const items = carouselContainer.querySelectorAll('.carousel-item-projectsHome');
            if (items && items[targetIndex - 1]) {
                const targetElement = items[targetIndex - 1];
                const scrollPosition = targetElement.offsetLeft;
                carouselContainer.scrollTo({
                    left: scrollPosition,
                    behavior: 'smooth',
                });
            }
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading data</div>;

    return (
        <div className="projects-section">
            {/* Encabezado con Navbar */}
            <header className="projects-header">
                <Navbar
                    isSliding={isSliding}
                    menuOpen={menuOpen}
                    setMenuOpen={setMenuOpen}
                    showInput={showInput}
                    setShowInput={setShowInput}
                />
            </header>

            {/* Carruseles */}
            <main className="projects-content">
                <div id="carousel-design" className="carousel-wrapper-projectsHome">
                    <Carousel title="Design" images={imagenesColumna1} />
                </div>
                <div id="carousel-architecture" className="carousel-wrapper-projectsHome">
                    <Carousel title="Architecture" images={imagenesColumna2} />
                </div>
                <div id="carousel-branding" className="carousel-wrapper-projectsHome">
                    <Carousel title="Branding" images={imagenesColumna3} />
                </div>
            </main>

            {/* Pie de página */}
            <footer className="projects-footer">
                <br />
                <br />
                <br />
                <ContactFooter />
            </footer>
        </div>
    );
}

export default ProjectsHome;
