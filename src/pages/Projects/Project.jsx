import React, { useEffect, useState, useRef, useCallback, useContext, useMemo } from 'react';
import { LanguageContext } from '../../context/LanguageContext';
import { useParams } from "react-router-dom";
import projectsData from './projectsData';
import projectsDataES from './projectsDataES';
import { useNavigate } from "react-router-dom";

import ProjectPopup from "./ProjectPopup";
import { getIdByProjectName } from './projectUtils';
import './Project.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { importImages } from "./importImages"; // 🔹 Importamos la función
import { importImagesProject } from "./importImagesProject";
import starImage from '../../assets/images/estrella.png';
import ContactFooter from '../Parcial/ContactFooter'; // Ajusta la ruta según tu estructura de carpetas
import Navbar from '../Parcial/Navbar'; // Ajusta la ruta según tu estructura de carpetas
import ContactFooterDesktop from '../Parcial/ContactFooterDesktop'; // Ajusta la ruta según tu estructura de carpetas

/* rango → categoría */
const getCategoryById = id =>
    id <= 5000 ? 'design'
        : id <= 8000 ? 'architecture'
            : 'branding';

function Project() {
    const interiorismo1 = '/assets/images/PaginaProyecto/proyecto3/CheMono.jpg';
    /* const { id } = useParams(); */ // 🔹 Obtiene el ID desde la URL
    const { category, projectName } = useParams();
    const { lang } = useContext(LanguageContext);  // EN | ES
    const navigate = useNavigate();

    // 🔹 Dataset por idioma
    const dataset = lang === 'ES' ? projectsDataES : projectsData;

    const imagesPrincipal = importImagesProject();
    /* helpers */
    const buildIndex = (data) =>
        Object.entries(data).map(([idStr, p]) => {
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
                .normalize('NFD').replace(/\p{Diacritic}/gu, '')
                .toLowerCase();

            return { label: p.nombreproyecto, projectName: p.nombreproyecto, category, fullText };
        });
    // helper (fuera del JSX)
    const getCountry = loc =>
        loc
            ?.split(',')            // ["Banfield", " Buenos Aires", " Argentina"]
            .pop()                  // " Argentina"
            .trim()                 // "Argentina"
            .split(/\s+/)           // ["Argentina"]
            .pop();                 // "Argentina"

    /* const projectNames = {
        1:"CheMono.jpg",
        2:"Barilatte.jpg",
        3:"Soberana.jpg"
        
        }; */

    /* const imageName = projectNames[id] || "CheMono.jpg"; */ // 🔹 Imagen por defecto

    /* const PhraseLineSelected = imageName.replace(/\.jpg$/, ""); */
    const imageName = `${projectName}.jpg`;       // AlgoGrosso.jpg
    const PhraseLineSelected = projectName;                // AlgoGrosso
    const isDesktop = window.innerWidth >= 1024;
    const images = importImagesProject(category, projectName, isDesktop);
    const id = getIdByProjectName(PhraseLineSelected);
    const projectData =
        id
            ? (dataset[id] ?? projectsData[id])   // ← intenta ES, si no existe cae a EN
            : {};



    console.log("📂 Imágenes importadas:", images);


    console.log("🖼️ Imagen seleccionada:", PhraseLineSelected);

    if (!images.principal || !images.principal[imageName]) {
        console.error(`❌ No se encontró la imagen: ${imageName} en "principal"`);
    }
    /* const imageName = "Che Mono.jpg"; */
    /*   const principal = require(`../../assets/images/PaginaProyecto/principal/${imageName}`);
      const project2 = require(`../../assets/images/PaginaProyecto/proyecto2/${imageName}`);
      const project3 = require(`../../assets/images/PaginaProyecto/proyecto3/${imageName}`);
      const project4 = require(`../../assets/images/PaginaProyecto/proyecto4/${imageName}`);
      const miniatura1 = require(`../../assets/images/PaginaProyecto/miniatura1/${imageName}`);
      const miniatura2 = require(`../../assets/images/PaginaProyecto/miniatura2/${imageName}`);
   */
    const [projectCount, setProjectCount] = useState(0);
    const [yearsCount, setYearsCount] = useState(2000);
    const [countriesCount, setCountriesCount] = useState(0);
    const [citiesCount, setCitiesCount] = useState(0);
    const [showInput, setShowInput] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [rotateYellowBox, setRotateYellowBox] = useState(false);
    const [slideBoxes, setSlideBoxes] = useState(false);
    const [slideStudioBox, setSlideStudioBox] = useState(false);
    const [hasStartedCountingProjects, setHasStartedCountingProjects] = useState(false);
    const [hasStartedCountingSection, setHasStartedCountingSection] = useState(false);
    const yellowBoxRef = useRef(null); // Referencia al yellow-box
    const [isBlurred, setIsBlurred] = useState(true); // Estado para manejar el blur
    let scrollTimeout = null; // Variable para manejar el timeout
    const [isMuted, setIsMuted] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    /* ── índices globales, se calculan 1 vez ── */
    const searchIndexes = useMemo(() => ({
        EN: buildIndex(projectsData),
        ES: buildIndex(projectsDataES),
    }), []);

    /* índice que realmente vas a usar */
    const searchIndex = searchIndexes[lang === 'ES' ? 'ES' : 'EN'];

    const handleSelectProject = (item) => {
        const slug = encodeURIComponent(item.projectName);
        navigate(`/project/${item.category}/${slug}`);
        setShowInput(false);
    };
    //inicio headermover
    const [isSliding, setIsSliding] = useState(false); // Controla el deslizamiento del Navbar

    let activityTimeout = null;

    // inicio carousel
    /*  const images = importImages("CheMono"); */ // 🔹 Se puede cambiar a otra carpeta en el futuro

    const openPopup = (image) => {
        if (modalOpen) {
            // El modal ya está abierto → sólo actualizo la imagen
            setSelectedImage(image);
        } else {
            // El modal está cerrado → abro y seteo imagen
            setSelectedImage(image);
            setModalOpen(true);
        }
    };
    // fin carousel

    useEffect(() => {
        if (!line5Ref.current) {
            console.warn("❌ La referencia a moving-line5 es NULL al montar el componente");
            return;
        }
        console.log("✅ La referencia a moving-line5 está asignada correctamente", line5Ref.current);

        const restartAnimation = (element, animationClass) => {
            if (!element) return;

            element.style.animation = "none"; // Detener la animación
            void element.offsetWidth; // 🔄 Forzar reflujo del navegador
            element.style.animation = `moveLine5 2s linear forwards`; // Reiniciar animación
        };

        const observer2 = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    console.log("Observando:", entry.target, "Visible:", entry.isIntersecting);

                    if (entry.isIntersecting && entry.target.classList.contains("moving-line5")) {
                        restartAnimation(entry.target, "moveLine5");
                    }
                });
            },
            { threshold: 0.8 } // Detecta salida total con más precisión
        );

        observer2.observe(line5Ref.current);

        return () => {
            // 🔹 Validar que line5Ref.current sigue siendo un HTMLElement antes de unobserve()
            if (line5Ref.current instanceof HTMLElement) {
                observer2.unobserve(line5Ref.current);
            } else {
                console.warn("⚠️ No se pudo unobserve porque line5Ref.current ya no es un Elemento");
            }
            observer2.disconnect(); // 🔹 Desconectar completamente el observer para liberar memoria
        };
    }, []);

    useEffect(() => {
        const handleUserActivity = () => {
            setIsSliding(false); // Detiene el deslizamiento si hay actividad

            if (activityTimeout) {
                clearTimeout(activityTimeout);
            }

            // Configura el timeout para iniciar el deslizamiento después de 2 segundos
            activityTimeout = setTimeout(() => {
                // Solo desliza el Navbar si el menú y el buscador están cerrados
                if (!menuOpen && !showInput) {
                    setIsSliding(true);
                }
            }, 2000);
        };

        // Escuchar eventos de actividad del usuario
        window.addEventListener('mousemove', handleUserActivity);
        window.addEventListener('scroll', handleUserActivity);
        window.addEventListener('click', handleUserActivity);

        return () => {
            // Limpia los eventos y el timeout al desmontar
            window.removeEventListener('mousemove', handleUserActivity);
            window.removeEventListener('scroll', handleUserActivity);
            window.removeEventListener('click', handleUserActivity);
            if (activityTimeout) {
                clearTimeout(activityTimeout);
            }
        };
    }, [menuOpen, showInput]);
    // fin headermover

    const handleMenuClick = () => {
        setMenuOpen(!menuOpen);
    };
    const toggleMenu = () => {
        setMenuOpen(!menuOpen); // Alterna entre true y false
    };
    const line1Ref = useRef(null);
    const line2Ref = useRef(null);
    const line3Ref = useRef(null);
    const line4Ref = useRef(null);
    const line5Ref = useRef(null);
    const line6Ref = useRef(null);




    //saca el nombre del archivo
    function getFileName(filePath) {
        const fullName = filePath.split('/').pop(); // Obtiene el último segmento de la ruta
        const nameWithoutExtension = fullName.split('.')[0]; // Extrae la parte antes del primer punto
        return nameWithoutExtension;
    }
    const brandingImageRef = useRef(null);
    const interiorismoImageRef = useRef(null);
    const arquitecturaImageRef = useRef(null);

    //inicio parallax

    useEffect(() => {
        const imageRefs = [
            { ref: brandingImageRef, speed: 0.1 },
            { ref: interiorismoImageRef, speed: 0.1 },
            { ref: arquitecturaImageRef, speed: 0.1 },
        ];

        const handleParallaxEffect = () => {
            imageRefs.forEach(({ ref, speed }) => {
                if (!ref.current) {
                    console.warn(`⚠️ El ref aún no está disponible:`, ref);
                    return; // ⛔ Evita ejecutar código sobre un `null`
                }

                const image = ref.current;
                const rect = image.getBoundingClientRect();
                const windowHeight = window.innerHeight;

                if (rect.top < windowHeight && rect.bottom > 0) {
                    const translateY = -(rect.top - windowHeight / 2) * speed;
                    image.style.transform = `translateY(${translateY}px)`;
                } else {
                    image.style.transform = `translateY(0px)`;
                }
            });
        };

        window.addEventListener('scroll', handleParallaxEffect);

        return () => {
            window.removeEventListener('scroll', handleParallaxEffect);
        };
    }, []);

    // fin parallax

    const handleScroll = () => {
        setIsBlurred(true); // Activa el blur al hacer scroll

        // Reinicia el temporizador
        if (scrollTimeout) clearTimeout(scrollTimeout);

        // Establece un nuevo temporizador para quitar el blur
        scrollTimeout = setTimeout(() => {
            setIsBlurred(false);
        }, 2000);
    };

    // Efecto para registrar el evento de scroll
    useEffect(() => {
        window.addEventListener("scroll", handleScroll);

        // Limpia el evento al desmontar el componente
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const handleStudioBoxClick = () => {
        setSlideStudioBox((prev) => !prev);
    };

    const handleYellowBoxClick = () => {
        setRotateYellowBox((prev) => !prev);
    };

    const counterRef = useRef(null);
    const sectionCountersRef = useRef(null);
    const sectionCounters2Ref = useRef(null);
    const slideBoxesRef = useRef(null);
    const slideStudioBoxRef = useRef(null);

    const options = ['Architecture', 'Awards', 'Asphalt', 'Aluminum', 'Aggregate', 'Asbestos', 'Adhesive', 'Anchor', 'Acrylic', 'Acoustic'];

    // Carga todos los archivos de la carpeta 'assets/images/logosClientes'
    const importAll = (requireContext) =>
        requireContext.keys().map(requireContext);

    // Obtén los logos
    const logos = importAll(
        require.context('../../assets/images/logosClientes', false, /\.(png|jpe?g|svg)$/)
    );

    // Duplicar los logos para permitir flujo continuo
    const duplicatedLogos = [...logos, ...logos];
    //fin carousel

    //Inicio contador animado
    const animateCounter = useCallback((setter, target, duration) => {
        let count = 0; // ⬅️ Empieza en 0
        const frameTime = 16; // ~60 FPS
        const steps = duration / frameTime;
        const increment = target / steps;

        const interval = setInterval(() => {
            count += increment;
            if (count >= target) {
                count = target;
                setter(Math.ceil(count));
                clearInterval(interval);
            } else {
                setter(Math.ceil(count));
            }
        }, frameTime);
    }, []);


    const startCountingProjects = useCallback(() => {
        animateCounter(setProjectCount, Number(projectData.contador1), 700);
        setHasStartedCountingProjects(true);
    }, [animateCounter]);

    const startCountingSection = useCallback(() => {
        animateCounter(setYearsCount, 4800, 1200);
        animateCounter(setCountriesCount, 15, 1500);
        animateCounter(setCitiesCount, 25, 1500);
        setHasStartedCountingSection(true);
    }, [animateCounter]);


    useEffect(() => {
        const observerProjects = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    startCountingProjects(); // Inicia el conteo al entrar en pantalla
                } else {
                    setProjectCount(0); // Reinicia el contador al salir de pantalla
                }
            });
        }, { threshold: 0.5 });

        const projectCounterRef = counterRef.current;
        if (projectCounterRef) {
            observerProjects.observe(projectCounterRef);
        }

        return () => {
            if (projectCounterRef) {
                observerProjects.unobserve(projectCounterRef);
            }
        };
    }, [startCountingProjects]);

    useEffect(() => {
        const observerSection = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // Inicia el conteo en secuencia
                    const delay = 50; // 1 segundo entre contadores

                    setYearsCount(2000);

                    animateCounter(setYearsCount, Number(projectData.contador2), 4000); // Primer contador


                } else {
                    // Reinicia los contadores al salir de pantalla
                    setYearsCount(2000);

                }
            });
        }, { threshold: 0.5 });

        const sectionCounterRef = sectionCounters2Ref.current;
        if (sectionCounterRef) {
            observerSection.observe(sectionCounterRef);
        }

        return () => {
            if (sectionCounterRef) {
                observerSection.unobserve(sectionCounterRef);
            }
        };
    }, [animateCounter]); // Asegúrate de incluir animateCounter si está definido fuera del useEffect

    //fin contador animado


    // Inicio animación de menú 
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

    // Inicio animación de búsqueda
    const handleSearchClick = () => {
        setShowInput(!showInput);
        setSearchTerm('');
    };

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredOptions = options.filter(option =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
    );
    // Fin animación de búsqueda
    // Inicio animación de cajas naranja 

    useEffect(() => {
        const observerYellowBox = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setRotateYellowBox((prev) => !prev); // Alterna el estado cada vez que entra en pantalla
                }
            });
        }, { threshold: 1 }); // Detecta cuando el 80% del elemento es visible

        const yellowBoxElement = yellowBoxRef.current;
        if (yellowBoxElement) {
            observerYellowBox.observe(yellowBoxElement);
        }

        return () => {
            if (yellowBoxElement) {
                observerYellowBox.unobserve(yellowBoxElement);
            }
        };
    }, []);
    // Fin animación de cajas naranja




    useEffect(() => {
        const restartAnimation = (element, animationClass) => {
            if (!element) return;
            element.style.animation = "none"; // Detiene cualquier animación activa
            void element.offsetWidth; // Reflujo: fuerza al navegador a calcular estilos nuevamente
            element.style.animation = `${animationClass} 3s linear forwards`; // Reinicia la animación
        };

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        if (entry.target.classList.contains("moving-line1-project")) {
                            restartAnimation(entry.target, "moveLine1-project");

                        } else if (entry.target.classList.contains("moving-line2")) {
                            restartAnimation(entry.target, "moveLine2");
                        }
                    }
                });
            },
            { threshold: 0.5 } // Ajusta el umbral según sea necesario
        );

        if (line1Ref.current) observer.observe(line1Ref.current);
        if (line2Ref.current) observer.observe(line2Ref.current);

        return () => {
            // 🔹 Verificar que aún existen los elementos antes de llamar unobserve()
            if (line1Ref.current instanceof HTMLElement) observer.unobserve(line1Ref.current);
            if (line2Ref.current instanceof HTMLElement) observer.unobserve(line2Ref.current);

            observer.disconnect(); // 🔹 Desconectar el observer completamente para liberar memoria
        };
    }, []);

    useEffect(() => {
        if (!line3Ref.current) {
            console.warn("❌ La referencia a moving-line3 es NULL al montar el componente");
            return;
        }

        console.log("✅ La referencia a moving-line3 está asignada correctamente", line3Ref.current);

        const restartAnimation = (element, animationClass) => {
            if (!element) return;

            element.style.animation = "none"; // Detener la animación
            void element.offsetWidth; // 🔄 Forzar reflujo
            element.style.animation = `${animationClass} 2s linear forwards`; // Reiniciar animación
        };

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    console.log("Observando:", entry.target, "Visible:", entry.isIntersecting);
                    if (entry.isIntersecting && entry.target.classList.contains("moving-line3")) {
                        restartAnimation(entry.target, "moveLine3");
                    }
                });
            },
            { threshold: 0.5 }
        );

        observer.observe(line3Ref.current);

        return () => {
            // 🔹 Verificar que el elemento aún existe ANTES de llamar a unobserve()
            if (line3Ref.current && line3Ref.current instanceof HTMLElement) {
                observer.unobserve(line3Ref.current);
            }
            observer.disconnect(); // 🔹 Desconectar completamente el observer para liberar memoria
        };
    }, []);

    const [open, setOpen] = useState(false);

    useEffect(() => {
        const overlay = document.getElementById('overlay-blur');
        if (overlay) {
            overlay.classList.toggle('active', modalOpen);
        }
    }, [modalOpen]);
    useEffect(() => {
        const body = document.body;

        if (modalOpen) {
            // Método A: directo en línea
            // body.style.overflow = 'hidden';

            // Método B: con clase (recomendado si usas Tailwind/otros)
            body.classList.add('no-scroll');
        } else {
            // body.style.overflow = '';          // ← revierte al valor original
            body.classList.remove('no-scroll');   // ← quita la clase
        }

        // Limpieza de seguridad por si el componente se desmonta
        return () => {
            // body.style.overflow = '';
            body.classList.remove('no-scroll');
        };
    }, [modalOpen]);
    // Al cerrar el modal liberamos el scroll
    const closePopup = () => {
        setModalOpen(false);
        setSelectedImage(null);          // (opcional) evita “imagen parpadeo”
    };

    const isVideo = (filename) => {
        return /\.(mp4|webm|ogg)$/i.test(filename);
    };

    const principalMedia = images.principal[imageName];
    const markHorizontal = (img, useParent = false) => {
        if (!img) return;
        const horizontal = img.naturalWidth > img.naturalHeight;
        const target = useParent ? img.parentElement : img;   // div .primer-foto ≠ img
        target.classList.toggle('horizontal', horizontal);
    };
    return (
        <div className="projects-general">
            <div id="overlay-blur" className={modalOpen ? 'active' : ''}></div>


            {/* Imagen  de fondo */}
            <header className="projet-header">
                {/*    <div className="full-square">
                    <div className="parallax-wrapper">
                        <img
                            src={images.principal[imageName]}
                            alt="Principal"
                            className="parallax-image-project"
                            ref={brandingImageRef}
                            onClick={() => openPopup(images.principal[imageName])}

                        />
                    </div>

                    <div className="image-label-star">
                        <img src={starImage} alt="Star" className="star-image-foto" />
                    </div>
                </div> */}
                <div className="full-square-primero-foto">
                    <div className='primer-foto'>
                        {isVideo(principalMedia) ? (
                            <video
                                src={principalMedia}
                                className="parallax-image-project "
                                autoPlay
                                muted
                                loop
                                playsInline
                                onClick={() => openPopup(principalMedia)}
                            />
                        ) : (
                            <img
                                src={principalMedia}
                                alt="Principal"
                                className='primer-foto parallax-image-project-primera  '
                                /* ref={brandingImageRef}  */
                                onLoad={e => markHorizontal(e.target)}
                                onClick={() => openPopup(principalMedia)}
                            />
                        )}
                    </div>

                    <div className="image-label-star">
                        <img src={starImage} alt="Star" className="star-image-foto" />
                    </div>
                </div>
                <Navbar
                    isSliding={isSliding}
                    menuOpen={menuOpen}
                    setMenuOpen={setMenuOpen}
                    showInput={showInput}
                    searchData={searchIndex}
                    onSelect={handleSelectProject}
                    setShowInput={setShowInput} />

            </header>

            {/* Inicio frase  */}
            <div className="phrase-section">
                <span className="phrase-line">{projectData.nombreproyecto}</span>
            </div>

            {/* fin frase  */}



            <section className="image-and-quadrants">
                <div className="quadrant-container">
                    <div className='container-image-small-projet' >
                        <img
                            src={images.miniatura1[imageName]}
                            alt="Miniatura 1"
                            /*  ref={interiorismoImageRef} */
                            className='image-small-projet'
                            onClick={() => openPopup(images.miniatura1[imageName])}
                        />
                    </div>

                    <div className="quadrant-project white-box-project">
                        <span className="project-box-project">{projectData.frase1}</span>
                        <div className="moving-line1-project" ref={line1Ref} ></div>
                    </div>
                    <div className="quadrant-project white-box-project"  >
                        <span className="project-box-project" >{projectData.frase2}</span>
                    </div>
                    <div className="quadrant-project green-box-project" ref={counterRef}>
                        <span className="project-count-project">{projectCount}</span>
                        <span className="project-label-project">{projectData.nombre1}</span>
                        <div className="moving-line2-project" ref={line2Ref}></div>
                    </div>
                </div>

                <div className="full-square">
                    <div className="parallax-wrapper">
                        <img
                            src={images.proyecto2[imageName]}
                            alt="proyecto f2"
                            className="parallax-image-project"
                            /* ref={arquitecturaImageRef} */
                            onLoad={e => markHorizontal(e.target)}
                            onClick={() => openPopup(images.proyecto2[imageName])}
                        />
                    </div>

                    <div className="image-label-star">
                        <img src={starImage} alt="Star" className="star-image-foto" />
                    </div>
                </div>
                <div className="horizontal-double-team">
                    <div className="quadrant-project yellow-box-project" ref={sectionCounters2Ref} style={{ width: '50vw' }}>
                        <span className="project-count-project">{yearsCount}</span>
                        <span className="project-label-project2">{projectData.nombre2}</span>
                    </div>
                    <div className="quadrant-project white-box-project" style={{ width: '50vw', backgroundOpacity: "0.1" }}>
                        <span className="project-label-small">Location</span>
                        <span className="project-label-normal" style={{ marginBottom: "10px" }}>{projectData.location}</span>

                        <span className="project-label-small">Year</span>
                        <span className="project-label-normal" style={{ marginBottom: "10px" }}>{projectData.contador1}</span>

                        <span className="project-label-small">Area</span>
                        <span className="project-label-normal">{projectData.contador2 + " " + projectData.nombre2}</span>
                        <div className="moving-line3" ref={line3Ref} data-animation="moveLine3"></div>
                    </div>
                </div>


                <div className="full-square">
                    <div className="parallax-wrapper">
                        <img
                            src={images.proyecto3[imageName]}
                            alt="Proyecto f3"
                            className="parallax-image-project"
                            /* ref={brandingImageRef} */
                            onLoad={e => markHorizontal(e.target)}
                            onClick={() => openPopup(images.proyecto3[imageName])}
                        />
                    </div>

                    <div className="image-label-star">
                        <img src={starImage} alt="Star" className="star-image-foto" />
                    </div>
                </div>
                <div className="quadrant-container">
                    {/*  <div className="vertical-half-square">
                        <div className="half-parallax-wrapper">
                            <img
                                src={imagesPrincipal.proyecto4[imageName]}
                                alt="Interiorismo 1"
                                className="half-parallax-image"
                                ref={interiorismoImageRef}
                                onClick={() => openPopup(imagesPrincipal.proyecto4[imageName])}
                            />
                        </div>

                        <div className="image-label-star">
                            <img src={starImage} alt="Star" className="star-image-foto" />
                        </div>
                    </div> */}
                    <div className="quadrant-project blue-box-project" ref={sectionCountersRef} style={{ width: '50vw' }}>
                        <span className="project-box-frase">{getCountry(projectData.location)}</span>
                    </div>
                    <div className='container-image-small-projet' >
                        <img
                            src={images.miniatura2[imageName]}
                            alt="Miniatura 2"
                            className='image-small-projet'
                            onClick={() => openPopup(images.miniatura2[imageName])}
                        />
                    </div>
                    <div className='container-image-small-projet' >
                        <img
                            src={images.proyecto4[imageName]}
                            alt="Proyecto f4"
                            className='image-small-projet'
                            onClick={() => openPopup(images.miniatura2[imageName])}
                        />
                    </div>
                    <div className="quadrant"  >
                        <span className="project-box-frase"> {projectData.frase3}</span>

                        <div className="moving-line5" ref={line5Ref} data-animation="moveLine5"> </div>

                    </div>
                </div>
                {/* Texto después de las imágenes */}
                <div className="project-text" >
                    <p className="project-title">{projectData.encabezado}</p>

                    <br />
                    <br />
                    <br />

                    <p className=" project-paragraph">
                        {projectData.parrafo1}
                    </p>

                    <p className=" project-paragraph">
                        {projectData.parrafo2}
                    </p>
                </div>
                <ProjectPopup
                    isOpen={modalOpen}
                    onClose={closePopup}
                    initialImage={selectedImage}
                    projectName={PhraseLineSelected}
                    category={category}
                />
            </section>
            <div className="button-container-clients mobile-hide">
                <ContactFooterDesktop />
            </div>
            <section className="content-section desktop-hide">
                <ContactFooter />
            </section>


        </div>
    );
}



export default Project;
