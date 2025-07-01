import React, { useEffect, useState, useRef, useContext } from 'react';

import { useNavigate } from "react-router-dom";
import './projectsHome.css';
import Navbar from '../Parcial/Navbar';
import ContactFooter from '../Parcial/ContactFooter';
import Carousel from './Carouseli';
import projectsData from './projectsData';
import ContactFooterDesktop from '../Parcial/ContactFooterDesktop'; // Ajusta la ruta según tu estructura de carpetas
import { Link } from "react-router-dom";

import { LanguageContext } from "../../context/LanguageContext";

/* ---------- helpers fuera del componente ---------- */
const easeInOutCubic = t =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const smoothScroll = (el, to, done) => {
  const start     = el.scrollLeft;
  const distance  = to - start;
  const duration  = Math.min(800, Math.max(Math.abs(distance) / 1.2, 350));
  const t0 = performance.now();

  const step = now => {
    const t = Math.min((now - t0) / duration, 1);
    el.scrollLeft = start + distance * easeInOutCubic(t);
    t < 1 ? requestAnimationFrame(step) : done();
  };
  requestAnimationFrame(step);
};

const scrollCarousel = (wrapId, idx) => {
  const wrap = document.getElementById(wrapId);
  if (!wrap) return;
  const cont = wrap.querySelector('.carousel-container-projectsHome');
  const item = cont?.querySelectorAll('.carousel-item-projectsHome')[idx - 1];
  if (!item) return;

  const target = item.offsetLeft - cont.offsetLeft;
  smoothScroll(cont, target, () => {});
};
/* --------------------------------------------------- */


/* Cálculo de categoría según el rango de id */
const getCategoryById = (id) => {
    if (id <= 5000) return 'design';
    if (id <= 8000) return 'architecture';
    return 'branding';          // 8001-10000
};

function buildSearchIndexProjects() {
  return Object.entries(projectsData).map(([idStr, p]) => {
    const id = Number(idStr);
    const category = getCategoryById(id);

    const fullText = [
      p.nombreproyecto,
      p.frase1, p.frase2, p.frase3,
      p.location,
      p.encabezado,
      p.parrafo1, p.parrafo2,
      p.nombre1, p.nombre2,
      p.contador1?.toString(),
      p.contador2?.toString()
    ]
      .filter(Boolean)
      .join(' | ')
      .normalize('NFD').replace(/\p{Diacritic}/gu, '') // quita tildes
      .toLowerCase();

    return { label: p.nombreproyecto, projectName: p.nombreproyecto, category, fullText };
  });
}

function ProjectsHome() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [imagenesColumna1, setImagenesColumna1] = useState([]);
    const [imagenesColumna2, setImagenesColumna2] = useState([]);
    const [imagenesColumna3, setImagenesColumna3] = useState([]);
    const { lang, toggleLang } = useContext(LanguageContext);

    // Inicio animación de menú
    const [showInput, setShowInput] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleSelectProject = (item) => {
        const slug = encodeURIComponent(item.projectName.replace(/\s+/g, ''));
        goToProject(item.category, slug);
    };
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
    const timeoutRef = useRef(null);

    useEffect(() => {
        const handleUserActivity = () => {
            setIsSliding(false);

            if (timeoutRef.current) clearTimeout(timeoutRef.current);

            timeoutRef.current = setTimeout(() => {
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
            if (timeoutRef) {
                clearTimeout(timeoutRef.current);
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
                const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

                setImagenesColumna1(shuffle(design.hits));
                setImagenesColumna2(shuffle(architecture.hits));
                setImagenesColumna3(shuffle(branding.hits));
                setLoading(false);

                // Realizar el scroll después de cargar las imágenes
                setTimeout(async () => {
                    scrollCarousel("carousel-design", 5);
                    scrollCarousel("carousel-architecture", 5);
                    scrollCarousel("carousel-branding", 5);
                }, 300);
            })
            .catch(error => {
                console.error("❌ Error cargando imágenes:", error);
                setError(true);
                setLoading(false);
            });
    }, []);


   /*  const scrollCarousel = (carouselId, targetIndex, duration = 200) => {
        const carouselWrapper = document.getElementById(carouselId);
        if (!carouselWrapper) return Promise.resolve();
        const container = carouselWrapper.querySelector('.carousel-container-projectsHome');
        const items = container.querySelectorAll('.carousel-item-projectsHome');
        if (!items[targetIndex - 1]) return Promise.resolve();

        const targetPos = items[targetIndex - 1].offsetLeft;
        return new Promise(resolve => {
            smoothScroll(container, targetPos, resolve);
        });
    }; */
// 1) cubic-bezier más suave (ease-in-out)
const easeInOutCubic = t =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

// 2) duración dinámica en función de la distancia


    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading data</div>;

    /* Navega a /project/{category}/{projectName} */
    const goToProject = (category, projectName) => {
        navigate(`/project/${category}/${projectName}`);
    };
/* dentro de ProjectsHome.jsx */
const TITLE_MAP = {
  Design:       { EN: 'Design',       ES: 'Diseño' },
  Architecture: { EN: 'Architecture', ES: 'Arquitectura' },
  Branding:     { EN: 'Branding',     ES: 'Branding' },
};

    return (
<div className="projects-section">
        {/* Encabezado con Navbar */}
            <header className="projects-header" >
                <Navbar
                    /* isSliding={isSliding} */
                    menuOpen={menuOpen}
                    setMenuOpen={setMenuOpen}
                    showInput={showInput}
                    setShowInput={setShowInput}
                    page="ProjectsHome"
                    searchData={buildSearchIndexProjects()}
                    onSelect={handleSelectProject}
                 style={{  backgroundColor:"#ffffff"} }>
                 </Navbar>
            </header>
    <div className="section-selector-projects mobile-hide">
    {/* 2️⃣ Selector fijo SOLO desktop */}
        
      <nav className="menu-items-split-desktop-home">
        <div className="menu-projects-home">
          <Link to={`/projects?section=Design`}  className="menu-link-desktop-home">
            {TITLE_MAP.Design[lang]}
          
            </Link>
      
                    <Link to={`/projects?section=Architecture`}  className="menu-link-desktop-home">

            {TITLE_MAP.Architecture[lang]}
           </Link>
                    <Link to={`/projects?section=Branding`}  className="menu-link-desktop-home">

            {TITLE_MAP.Branding[lang]}
           </Link>
        </div>
      </nav>
    </div>
            {/* Carruseles */}
            <main className="projects-content">
                <div id="carousel-design" className="carousel-wrapper-projectsHome">
                    <Carousel
                        title={lang === 'ES' ? 'Diseño' : 'Design'}
                        images={imagenesColumna1}
                        goToProject={goToProject}
                        category="Design"
                    />
                </div>

                <div id="carousel-architecture" className="carousel-wrapper-projectsHome">
                    <Carousel
                        title= {lang === 'ES' ? 'Arquitectura' : 'Architecture'}
                        images={imagenesColumna2}
                        goToProject={goToProject}
                        category="Architecture"
                    />
                </div>

                <div id="carousel-branding" className="carousel-wrapper-projectsHome">
                    <Carousel
                        title="Branding"
                        images={imagenesColumna3}
                        goToProject={goToProject}
                        category="Branding"
                    />
                </div>
            </main>

            {/* Pie de página */}
            <footer className="projects-footer">
                <br />
                <br />
                <br />
                <footer className="studio-footer mobile-hide">
                <ContactFooterDesktop />
            </footer>
            {/* Pie de página */}
            <footer className="studio-footer desktop-hide">
                <ContactFooter />
            </footer>
            </footer>
        </div>
    );
}

export default ProjectsHome;
