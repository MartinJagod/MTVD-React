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
               setTimeout(async () => {
    // Pan suave al item 5, luego regreso al inicio
    await scrollCarousel("carousel-design", 25, 2000);
    /* await scrollCarousel("carousel-design", 2, 1500); */
    // Repite en los otros…
    await scrollCarousel("carousel-architecture", 9, 1800);
    /* await scrollCarousel("carousel-architecture", 2, 1500); */
    await scrollCarousel("carousel-branding",    8, 2000);
    /* await scrollCarousel("carousel-branding",    1, 1500); */
  }, 500);
            })
            .catch(error => {
                console.error("❌ Error cargando imágenes:", error);
                setError(true);
                setLoading(false);
            });
    }, []);
const scrollCarousel = (carouselId, targetIndex, duration = 1800) => {
  const carouselWrapper = document.getElementById(carouselId);
  if (!carouselWrapper) return Promise.resolve();
  const container = carouselWrapper.querySelector('.carousel-container-projectsHome');
  const items = container.querySelectorAll('.carousel-item-projectsHome');
  if (!items[targetIndex - 1]) return Promise.resolve();

  const targetPos = items[targetIndex - 1].offsetLeft;
  return new Promise(resolve => {
    smoothScroll(container, targetPos, duration, resolve);
  });
};

// ajusta smoothScroll para aceptar callback
const smoothScroll = (el, to, duration, done) => {
  const start = el.scrollLeft;
  const change = to - start;
  const t0 = performance.now();
  function step(now) {
    const t = Math.min((now - t0) / duration, 1);
    el.scrollLeft = start + change * (1 - Math.pow(1 - t, 3));
    if (t < 1) requestAnimationFrame(step);
    else done();
  }
  requestAnimationFrame(step);
};
    // 🔹 Función de desplazamiento suave
   
    
    // 🔹 Función de interpolación Ease-Out Cubic (Simula aceleración inicial y desaceleración final)
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
    
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading data</div>;

/* Navega a /project/{category}/{projectName} */
const goToProject = (category, projectName) => {
  navigate(`/project/${category}/${projectName}`);
};


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
        <Carousel
          title="Design"
          images={imagenesColumna1}
          goToProject={goToProject}
        />
      </div>

      <div id="carousel-architecture" className="carousel-wrapper-projectsHome">
        <Carousel
          title="Architecture"
          images={imagenesColumna2}
          goToProject={goToProject}
        />
      </div>

      <div id="carousel-branding" className="carousel-wrapper-projectsHome">
        <Carousel
          title="Branding"
          images={imagenesColumna3}
          goToProject={goToProject}
        />
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
