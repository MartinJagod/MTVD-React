import React, { useState, useEffect } from 'react';
import './projectsHome.css';
import Navbar from '../Parcial/Navbar'; // Ajusta la ruta según tu estructura
import ContactFooter from '../Parcial/ContactFooter'; // Ajusta la ruta según tu estructura
import Carousel from './Carousel'; // Importa el componente reutilizable

function ProjectsHome() {
    const apiKey = '46939622-ea27aebde81d6ef511de7d2fc';
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [imagenesColumna1, setImagenesColumna1] = useState([]);
    const [imagenesColumna2, setImagenesColumna2] = useState([]);
    const [imagenesColumna3, setImagenesColumna3] = useState([]);

    useEffect(() => {
        // Fetch de datos para las columnas del carrusel
        Promise.all([
            fetch(`https://pixabay.com/api/?key=${apiKey}&q=design&image_type=photo&per_page=15`).then((res) => res.json()),
            fetch(`https://pixabay.com/api/?key=${apiKey}&q=architecture&image_type=photo&per_page=15`).then((res) => res.json()),
            fetch(`https://pixabay.com/api/?key=${apiKey}&q=branding&image_type=photo&per_page=15`).then((res) => res.json()),
        ])
            .then(([designData, architectureData, brandingData]) => {
                setImagenesColumna1(designData.hits);
                setImagenesColumna2(architectureData.hits);
                setImagenesColumna3(brandingData.hits);
                setLoading(false);

                // Realizar el scroll después de cargar las imágenes
                setTimeout(() => {
                    scrollCarousel("carousel-design", 10);
                    scrollCarousel("carousel-architecture", 7);
                    scrollCarousel("carousel-branding", 13);
                 
                }, 1000); // Espera 1 segundo para asegurar que las imágenes están listas
          
            })
            .catch(() => {
                setError(true);
            });
        }, [apiKey]);
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
                <Navbar />
            </header>

            {/* Carruseles */}
            <main className="projects-content" style={{ marginTop: '50px' }}>
                <div id="carousel-design" className="carousel-wrapper-projectsHome">
                    <Carousel  title="Design" images={imagenesColumna1} />
                </div>
                <div id="carousel-architecture" className="carousel-wrapper-projectsHome">
                    <Carousel  title="Architecture" images={imagenesColumna2} />
                </div>
                <div id="carousel-branding" className="carousel-wrapper-projectsHome">
                    <Carousel  title="Branding" images={imagenesColumna3} />
                </div>

            </main>

            {/* Pie de página */}
            <footer className="projects-footer">
                <ContactFooter />
            </footer>
        </div>
    );
}

export default ProjectsHome;
