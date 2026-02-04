import React, { useEffect, useState, useRef, useCallback, useMemo, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { LanguageContext } from '../../context/LanguageContext';

import '@fortawesome/fontawesome-free/css/all.min.css';
import home1 from '../../assets/images/home1.jpg';
import homeVideo from '../../assets/images/homeVideo.mp4'; // Importa el video
import IntroScreen from './IntroScreen'; // ajusta la ruta
/* import interiorismo1 from '../../assets/images/Felicity.jpeg'; */
import interiorismo3 from '../../assets/images/interiorismo3.jpg';
import teamImage from '../../assets/images/team.jpeg';
import starImage from '../../assets/images/estrella.png';
import groupImage from '../../assets/images/group.png';
import logoHorizontal from '../../assets/images/logo-horizontal.png';
import logoVertical from '../../assets/images/logo-vertical.png';
import { FaSearch } from 'react-icons/fa';
import logoSlogan from '../../assets/images/logo-slogan.png';
import { FaLinkedin, FaPinterest, FaYoutube, FaInstagram } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { FaExpand, FaVolumeMute, FaVolumeUp } from 'react-icons/fa';

import ContactFooter from '../Parcial/ContactFooter'; // Ajusta la ruta según tu estructura de carpetas
import Navbar from '../Parcial/Navbar'; // Ajusta la ruta según tu estructura de carpetas
import CarouselLogos from "../Parcial/CarouselLogos";
import ContactFooterDesktop from '../Parcial/ContactFooterDesktop'; // Ajusta la ruta según tu estructura de carpetas
import projectsData from '../Projects/projectsData';
import projectsDataES from '../Projects/projectsDataES';
import './Home.css';


/* rango → categoría */
const getCategoryById = id =>
    id <= 5000 ? 'design'
        : id <= 8000 ? 'architecture'
            : 'branding';


function Home() {
    const { lang } = useContext(LanguageContext);  // EN | ES

    const [showIntro, setShowIntro] = useState(!sessionStorage.getItem('seenIntro'));

    const branding2 = "/assets/images/PaginaProyecto/principal/CheMono2.jpg";
    const branding1 = "/assets/images/PaginaProyecto/principal/CheMono.jpg";
    const interiorismo1 = "/assets/images/PaginaProyecto/principal/Valpo1.jpg";
    const interiorismoVideo1 = "/assets/images/PaginaProyecto/principal/video1.mp4";

    const interiorismo2 = "/assets/images/PaginaProyecto/principal/Barilatte.jpg";
    const arquitectura1 = "/assets/images/PaginaProyecto/principal/Soberana.jpg";
    /*  const arquitectura3 = "/assets/images/PaginaProyecto/principal/ElMercadillo.jpg"; */
    const arquitectura3 = "/assets/images/PaginaProyecto/principal/Valpo1.jpg";

    const arquitectura2 = "/assets/images/PaginaProyecto/principal/HotelAzurLobby.jpg";

    const arquitectura4 = "/assets/images/PaginaProyecto/principal/CentralClub.jpg";


    const [projectCount, setProjectCount] = useState(0);
    const [yearsCount, setYearsCount] = useState(0);
    const [countriesCount, setCountriesCount] = useState(0);
    const [citiesCount, setCitiesCount] = useState(0);

    const [projectCountDesktop, setProjectCountDesktop] = useState(0);
    const [yearsCountDesktop, setYearsCountDesktop] = useState(0);
    const [countriesCountDesktop, setCountriesCountDesktop] = useState(0);
    const [citiesCountDesktop, setCitiesCountDesktop] = useState(0);
    const [showInput, setShowInput] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [rotateYellowBox, setRotateYellowBox] = useState(false);
    const [rotateYellowBoxDesktop, setRotateYellowBoxDesktop] = useState(false);

    const [slideBoxes, setSlideBoxes] = useState(false);
    const [slideBoxesDesktop, setSlideBoxesDesktop] = useState(false);

    const [slideStudioBox, setSlideStudioBox] = useState(false);
    const [slideStudioBoxDesktop, setSlideStudioBoxDesktop] = useState(false);

    const [hasStartedCountingProjects, setHasStartedCountingProjects] = useState(false);
    const [hasStartedCountingProjectsDesktop, setHasStartedCountingProjectsDesktop] = useState(false);

    const [hasStartedCountingSection, setHasStartedCountingSection] = useState(false);
    const [hasStartedCountingSectionDesktop, setHasStartedCountingSectionDesktop] = useState(false);

    const yellowBoxRef = useRef(null); // Referencia al yellow-box
    const yellowBoxDesktopRef = useRef(null); // Referencia al yellow-box

    const [isBlurred, setIsBlurred] = useState(true); // Estado para manejar el blur
    let scrollTimeout = null; // Variable para manejar el timeout
    const [isMuted, setIsMuted] = useState(true);
    const navigate = useNavigate();


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

    /* ── índices globales, se calculan 1 vez ── */
    const searchIndexes = useMemo(() => ({
        EN: buildIndex(projectsData),
        ES: buildIndex(projectsDataES),
    }), []);

    /* índice que realmente vas a usar */
    const searchIndex = searchIndexes[lang === 'ES' ? 'ES' : 'EN'];

    const handleSelectProject = (item) => {
        const slug = encodeURIComponent(item.projectName.replace(/\s+/g, ''));
        navigate(`/project/${item.category}/${slug}`);
        setShowInput(false);
    };
    //Inicio Fullscreen
    // Dentro de tu componente Home, justo después de `const videoRef = useRef(null);`

    const enterFullScreen = async () => {
        const v = videoRef.current;
        if (!v) return;
toggleMute();
        // 1. fullscreen (estándar o prefijos)
        if (v.requestFullscreen) {
            await v.requestFullscreen();
        } else if (v.webkitEnterFullScreen) {
            // Safari / iOS
            v.webkitEnterFullScreen();
        } else if (v.mozRequestFullScreen) {
            v.mozRequestFullScreen();
        } else if (v.msRequestFullscreen) {
            v.msRequestFullscreen();
        }

        // 2. bloquear orientación en landscape
        if (window.screen?.orientation?.lock) {
            window.screen.orientation.lock('landscape').catch(() => {
                ;
                // algunos navegadores ignoran si no es iniciado por usuario
            });
        }
    };

    useEffect(() => {
        const onFullscreenChange = () => {
            if (!document.fullscreenElement) {
                window.screen?.orientation?.unlock?.();
            }
        };
        document.addEventListener('fullscreenchange', onFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
    }, []);

    // fin Fullscreen


    //inicio headermover
    const [isSliding, setIsSliding] = useState(false); // Controla el deslizamiento del Navbar

    let activityTimeout = null;

    //Cambios de pagina
    const goToProjects = () => {
        navigate("/projectsHome"); // Cambia a la ruta /projects
    };
    const goToAwardsAndPress = () => {
        navigate("/awardsandpress"); // Cambia a la ruta /awardsandpress
    };
    const goToStudio = () => {
        navigate("/studio"); // Cambia a la ruta
    }
    const goToContact = () => {
        navigate("/contact"); // Cambia a la ruta       
    }
    const goToHome = () => {
        navigate("/"); // Cambia a la ruta
    }
    /* Navega a /project/{category}/{projectName} */
    const goToProject = (category, projectName) => {
        navigate(`/project/${category}/${projectName}`);
    };

    React.useEffect(() => {
        if (!sessionStorage.getItem('seenIntro')) {
            navigate('/intro', { replace: true });
        }
    }, [navigate]);

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
    const desktopline1Ref = useRef(null);
    const desktopline2Ref = useRef(null);
    const desktopline3Ref = useRef(null);


    //saca el nombre del archivo
    function getFileName(filePath) {
        const fullName = filePath.split('/').pop(); // Obtiene el último segmento de la ruta
        const nameWithoutExtension = fullName.split('.')[0]; // Extrae la parte antes del primer punto
        return nameWithoutExtension;
    }
    const brandingImageRef = useRef(null);
    const interiorismoImageRef = useRef(null);
    const arquitecturaImageRef = useRef(null);
    const brandingDesktopImageRef = useRef(null);
    const interiorismoDesktopImageRef = useRef(null);
    const interiorismo2DesktopImageRef = useRef(null);
    const arquitectura1DesktopImageRef = useRef(null);

    const interiorismoVideoDesktopRef = useRef(null);
    const arquitecturaDesktopImageRef = useRef(null);
    const arquitectura4DesktopImageRef = useRef(null);
    const teamImageRef = useRef(null);
    const studioImageRef = useRef(null);
    const studioImageDesktopRef = useRef(null);

    //inicio parallax

    useEffect(() => {
        const imageRefs = [
            { ref: brandingImageRef, speed: 0.1 },
            { ref: interiorismoImageRef, speed: 0.1 },
            { ref: arquitecturaImageRef, speed: 0.1 },
            { ref: brandingDesktopImageRef, speed: 0.1 },
            { ref: interiorismoDesktopImageRef, speed: 0.10 },
            { ref: arquitecturaDesktopImageRef, speed: 0.15 },
            { ref: arquitectura4DesktopImageRef, speed: 0.1 },
            { ref: interiorismo2DesktopImageRef, speed: 0.1 },
            { ref: teamImageRef, speed: 0.15 },
            { ref: studioImageRef, speed: 0.07 },
            { ref: studioImageDesktopRef, speed: 0.07 },




        ];

        const handleParallaxEffect = () => {
            imageRefs.forEach(({ ref, speed }) => {
                const image = ref.current;
                if (image) {
                    const rect = image.getBoundingClientRect();
                    const windowHeight = window.innerHeight;

                    if (rect.top < windowHeight && rect.bottom > 0) {
                        const translateY = -(rect.top - windowHeight / 2) * speed;
                        image.style.transform = `translateY(${translateY}px)`;
                    } else {
                        image.style.transform = `translateY(0px)`;
                    }
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
    const slideBoxesRef = useRef(null);
    const slideBoxesDesktopRef = useRef(null);
    const slideStudioBoxRef = useRef(null);
    const slideStudioBoxDesktopRef = useRef(null);
    const counterDesktopRef = useRef(null);
    const sectionCountersDesktopRef = useRef(null);


    const options = ['Architecture', 'Awards', 'Asphalt', 'Aluminum', 'Aggregate', 'Asbestos', 'Adhesive', 'Anchor', 'Acrylic', 'Acoustic'];

    // Carga todos los archivos de la carpeta 'assets/images/logosClientes'
    /*     const importAll = (requireContext) =>
            requireContext.keys().map(requireContext); */
    const importAll = (requireContext) =>
        requireContext.keys().map(key => {
            const module = requireContext(key);
            return module.default || module;
        });

    // Obtén los logos
    const logos = importAll(
        require.context('../../assets/images/logosClientes', false, /\.(png|jpe?g|svg)$/)
    );

    // Duplicar los logos para permitir flujo continuo
    const duplicatedLogos = [...logos, ...logos];
    //fin carousel

    //Inicio contador animado
    const animateCounter = useCallback((setter, target, duration) => {
        let count = 0;
        const increment = target / (duration / 16);

        const interval = setInterval(() => {
            count += increment;
            if (count >= target) {
                count = target;
                setter(Math.ceil(count));
                clearInterval(interval);
            } else {
                setter(Math.ceil(count));
            }
        }, 16);
    }, []);

    const startCountingProjects = useCallback(() => {
        animateCounter(setProjectCount, 500, 2000);
        setHasStartedCountingProjects(true);
    }, [animateCounter]);

    const startCountingSection = useCallback(() => {
        animateCounter(setYearsCount, 10, 4000);
        animateCounter(setCountriesCount, 15, 4000);
        animateCounter(setCitiesCount, 25, 4000);
        setHasStartedCountingSection(true);
    }, [animateCounter]);


    const startCountingProjectsDesktop = useCallback(() => {
        animateCounter(setProjectCountDesktop, 500, 2000);
        setHasStartedCountingProjectsDesktop(true);
    }, [animateCounter]);

    const startCountingSectionDesktop = useCallback(() => {
        animateCounter(setYearsCountDesktop, 10, 4000);
        animateCounter(setCountriesCountDesktop, 15, 4000);
        animateCounter(setCitiesCountDesktop, 25, 4000);
        setHasStartedCountingSectionDesktop(true);
    }, [animateCounter]);

    useEffect(() => {
        const projectCounterRef = counterRef.current;
        if (!projectCounterRef) return;

        const observerProjects = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    startCountingProjects();
                } else {
                    setProjectCount(0);
                }
            });
        }, { threshold: 0.5 });

        observerProjects.observe(projectCounterRef);

        // 🚀 Revisión inicial (en caso de que ya esté visible)
        const rect = projectCounterRef.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            startCountingProjects();
        }

        return () => {
            observerProjects.unobserve(projectCounterRef);
        };
    }, [startCountingProjects]);


    useEffect(() => {
        const observerProjectsDesktop = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    startCountingProjectsDesktop(); // Inicia el conteo al entrar en pantalla
                } else {
                    setProjectCountDesktop(0); // Reinicia el contador al salir de pantalla
                }
            });
        }, { threshold: 0.5 });

        const projectCounterDesktopRef = counterDesktopRef.current;
        if (projectCounterDesktopRef) {
            observerProjectsDesktop.observe(projectCounterDesktopRef);
        }

        return () => {
            if (projectCounterDesktopRef) {
                observerProjectsDesktop.unobserve(projectCounterDesktopRef);
            }
        };
    }, [startCountingProjectsDesktop]);

    useEffect(() => {
        const observerSection = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // Inicia el conteo en secuencia
                    const delay = 500; // 1 segundo entre contadores

                    setYearsCount(0);
                    setCountriesCount(0);
                    setCitiesCount(0);

                    setTimeout(() => {
                        animateCounter(setYearsCount, 10, 500); // Primer contador
                    }, 0);

                    setTimeout(() => {
                        animateCounter(setCountriesCount, 15, 500); // Segundo contador
                    }, delay);


                    setTimeout(() => {
                        animateCounter(setCitiesCount, 25, 500); // Tercer contador
                    }, delay * 2);
                } else {
                    // Reinicia los contadores al salir de pantalla
                    setYearsCount(0);
                    setCountriesCount(0);
                    setCitiesCount(0);
                }
            });
        }, { threshold: 0.5 });

        const sectionCounterRef = sectionCountersRef.current;
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

    //inicio contador desktop
    useEffect(() => {
        const observerSectionDesktop = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // Inicia el conteo en secuencia
                    const delay = 500; // 1 segundo entre contadores

                    setYearsCountDesktop(0);
                    setCountriesCountDesktop(0);
                    setCitiesCountDesktop(0);

                    setTimeout(() => {
                        animateCounter(setCitiesCountDesktop, 25, 500); // Tercer contador
                    }, 0);

                    setTimeout(() => {
                        animateCounter(setCountriesCountDesktop, 15, 500); // Segundo contador
                    }, delay);
                    setTimeout(() => {
                        animateCounter(setYearsCountDesktop, 11, 500); // Primer contador
                    }, delay * 2);


                } else {
                    // Reinicia los contadores al salir de pantalla
                    setYearsCountDesktop(0);
                    setCountriesCountDesktop(0);
                    setCitiesCountDesktop(0);
                }
            });
        }, { threshold: 0.1 });

        const sectionCounterDesktopRef = sectionCountersDesktopRef.current;
        if (sectionCounterDesktopRef) {
            observerSectionDesktop.observe(sectionCounterDesktopRef);
        }

        return () => {
            if (sectionCounterDesktopRef) {
                observerSectionDesktop.unobserve(sectionCounterDesktopRef);
            }
        };
    }, [animateCounter]); // Asegúrate de incluir animateCounter si está definido fuera del useEffect
    //fin contador desktop

    useEffect(() => {
        const observerSlideBoxesDesktop = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setSlideBoxesDesktop(true); // Activa la animación cuando entra en pantalla
                    } else {
                        setSlideBoxesDesktop(false); // Restablece si sale de pantalla
                    }
                });
            },
            { threshold: 0.1 } // Se activa cuando el 50% del elemento es visible
        );

        const slideBoxesElement = slideBoxesDesktopRef.current;
        if (slideBoxesElement) {
            observerSlideBoxesDesktop.observe(slideBoxesElement);
        }

        return () => {
            if (slideBoxesElement) {
                observerSlideBoxesDesktop.unobserve(slideBoxesElement);
            }
        };
    }, []);

    // Inico deslice de cajas
    useEffect(() => {
        const observerSlideBoxes = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setSlideBoxes(false); // Activa la animación
                    } else {
                        setSlideBoxes(true); // Resetea la animación si lo prefieres
                    }
                });
            },
            { threshold: 0.1 } // Ajusta el umbral para determinar cuándo se activa
        );

        const slideBoxesElement = slideBoxesRef.current;
        if (slideBoxesElement) {
            observerSlideBoxes.observe(slideBoxesElement);
        }

        return () => {
            if (slideBoxesElement) {
                observerSlideBoxes.unobserve(slideBoxesElement);
            }
        };
    }, []);
    //  deslice de cajas naranja desktop

    useEffect(() => {
        const observerStudioBoxDesktop = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setSlideStudioBoxDesktop(true); // Activa el deslizamiento
                } else {
                    setSlideStudioBoxDesktop(false); // Restablece el estado cuando sale de pantalla
                }
            });
        }, { threshold: 0.1 }); // Detecta cuando al menos el 50% es visible

        const studioBoxElement = slideStudioBoxDesktopRef.current;
        if (studioBoxElement) {
            observerStudioBoxDesktop.observe(studioBoxElement);
        }

        return () => {
            if (studioBoxElement) {
                observerStudioBoxDesktop.unobserve(studioBoxElement);
            }
        };
    }, []);
    // Fin deslice de cajas naranja desktop

    useEffect(() => {
        const observerStudioBox = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setSlideStudioBox(true); // Activa el deslizamiento
                } else {
                    setSlideStudioBox(false); // Restablece el estado cuando sale de pantalla
                }
            });
        }, { threshold: 0.8 }); // Detecta cuando al menos el 50% es visible

        const studioBoxElement = slideStudioBoxRef.current;
        if (studioBoxElement) {
            observerStudioBox.observe(studioBoxElement);
        }

        return () => {
            if (studioBoxElement) {
                observerStudioBox.unobserve(studioBoxElement);
            }
        };
    }, []);
    // Fin deslice de cajas

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
                if (!entry.isIntersecting) {
                    // Si está fuera de pantalla, muestra el front
                    setRotateYellowBox(false);
                } else if (entry.intersectionRatio >= 0.1) {
                    // Cuando entra al 10% visible, gira al back
                    setRotateYellowBox(true);
                }
            });
        }, 
        { threshold: [0.1]  }); // Detecta cuando el 80% del elemento es visible

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
    // Inicio animación de cajas naranja 
useEffect(() => {
    const observerYellowBox = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    // Si está fuera de pantalla, muestra el front
                    setRotateYellowBoxDesktop(false);
                } else if (entry.intersectionRatio >= 0.1) {
                    // Cuando entra al 10% visible, gira al back
                    setRotateYellowBoxDesktop(true);
                }
            });
        },
        { threshold: [0.1] } // Detecta el cruce del 10% de visibilidad
    );

    const yellowBoxElement = yellowBoxDesktopRef.current;
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
    // Inicio reinicio video
    const videoRef = useRef(null);


    useEffect(() => {
        const v = videoRef.current;
        if (!v) return;

        // Mantenerlo silenciado desde el inicio
        v.muted = true;
        setIsMuted(true);

        const onLoaded = () => {
            if (v.duration > 4) {
                v.currentTime = 4; // Salta a 4 s
            }
            v.play().catch(err => {
                console.warn("Autoplay bloqueado:", err);
            });
        };

        // Cuando ya estén disponibles los metadatos, ejecuto onLoaded
        v.addEventListener("loadedmetadata", onLoaded);

        return () => {
            v.removeEventListener("loadedmetadata", onLoaded);
        };
    }, []);

    const handleVideoEnd = () => {
        if (videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play();
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            const mutedState = !isMuted;
            videoRef.current.muted = mutedState;
            setIsMuted(mutedState);
        }
    };
    // Fin reinicio video

    /* Hook que fuerza la reanudación al salir de fullscreen */

    useEffect(() => {
        const v = videoRef.current;
        if (!v) return;

        /*— Reanuda con un tick de margen —*/
        const resume = () => {
            requestAnimationFrame(() => {
                // En algunos Android el vídeo reporta paused=false pero no suena; fuerza play()
                const p = v.play();
                if (p && typeof p.catch === 'function') p.catch(() => { }); // silencia bloqueoAutoplay
                window.screen?.orientation?.unlock?.();                    // vuelve a desbloquear
            });
        };

        /*— Lista completa de eventos de cambio de fullscreen —*/
        const EVENTS = [
            ['fullscreenchange', resume],          // estándar
            ['webkitfullscreenchange', resume],    // Safari (Mac)
            ['mozfullscreenchange', resume],       // Firefox
            ['MSFullscreenChange', resume],        // Edge “antiguo”
        ];

        EVENTS.forEach(([ev, fn]) => document.addEventListener(ev, fn));
        v.addEventListener('webkitendfullscreen', resume);            // iOS

        return () => {
            EVENTS.forEach(([ev, fn]) => document.removeEventListener(ev, fn));
            v.removeEventListener('webkitendfullscreen', resume);
        };
    }, [videoRef]);


    // Inicio lineas en movimeinto
    useEffect(() => {
        const restartAnimation = (element, animationClass) => {
            element.style.animation = "none"; // Detiene cualquier animación activa
            void element.offsetWidth; // Reflujo: fuerza al navegador a calcular estilos nuevamente
            element.style.animation = `${animationClass} 1s linear forwards`; // Reinicia la animación
        };

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        if (entry.target.classList.contains("moving-line")) {
                            restartAnimation(entry.target, "moveLine");
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
            if (line1Ref.current) observer.unobserve(line1Ref.current);
            if (line2Ref.current) observer.unobserve(line2Ref.current);
        };
    }, []);
    // fin lineas

    // Inicio lineas en movimeinto desktop
    // refs: desktopline1Ref, desktopline2Ref
    useEffect(() => {
        const lines = [desktopline1Ref.current, desktopline2Ref.current, desktopline3Ref.current];

        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach(({ isIntersecting, target }) => {
                    if (isIntersecting) {
                        /* Si entra y aún no está animando, la disparamos */
                        if (!target.classList.contains('animate')) {
                            target.classList.add('animate');
                        }
                    } else {
                        /* Cuando sale completamente, la “reseteamos” */
                        target.classList.remove('animate');
                    }
                });
            },
            {
                threshold: 0.5,        // 20 % visible
                rootMargin: '0px',     // ajusta si lo necesitas
            }
        );

        lines.forEach((el) => el && io.observe(el));

        return () => lines.forEach((el) => el && io.unobserve(el));
    }, []);

    // fin lineas

    useEffect(() => {
        if (showIntro) return; // ⛔ No hacemos nada si está el intro

        const observerSection = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const delay = 500;
                    setYearsCount(0);
                    setCountriesCount(0);
                    setCitiesCount(0);

                    setTimeout(() => animateCounter(setYearsCount, 10, 500), 0);
                    setTimeout(() => animateCounter(setCountriesCount, 15, 500), delay);
                    setTimeout(() => animateCounter(setCitiesCount, 25, 500), delay * 2);
                } else {
                    setYearsCount(0);
                    setCountriesCount(0);
                    setCitiesCount(0);
                }
            });
        }, { threshold: 0.5 });

        const sectionCounterRef = sectionCountersRef.current;
        if (sectionCounterRef) observerSection.observe(sectionCounterRef);

        return () => {
            if (sectionCounterRef) observerSection.unobserve(sectionCounterRef);
        };
    }, [showIntro, animateCounter]);











    return (

        <div className="home">
            <div className="videoHome-home">
                <header className="home-header-home">
                    <video
                        ref={videoRef}
                        className="background-video-home Hero-video"
                        src={homeVideo}
                        autoPlay
                        muted
                        loop
                        playsInline
                        onEnded={handleVideoEnd}
                        onDoubleClick={ enterFullScreen}
                    />

                    <button className="mute-button" onClick={toggleMute}>
                        {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                    </button>
                    <button className="full-button" onClick={enterFullScreen}>
                        <FaExpand />
                    </button>
                    <Navbar
                        isSliding={isSliding}
                        menuOpen={menuOpen}
                        setMenuOpen={setMenuOpen}
                        showInput={showInput}
                        setShowInput={setShowInput}
                        page="Home"
                        searchData={searchIndex}
                        onSelect={handleSelectProject}
                    />

                </header>

            </div>

            <div className="phrase-section-home desktop-hide" onClick={goToStudio}>
                <span className="phrase-line">  {lang === 'ES' ? 'Hola! Somos' : 'We are a'}</span> <br />
                <span className="phrase-line"> {lang === 'ES' ? ' Estudio Montevideo' : 'design studio'} </span>
            </div>
            <div className="phrase-section-home mobile-hide" onClick={goToStudio}>
                <span className="phrase-line-desktop"> {lang === 'ES' ? 'Hola! Somos Estudio Montevideo' : 'We are a design studio'} </span>
            </div>
            {/* Seccion mobile */}
            <div className="full-square desktop-hide">

                <div className="parallax-wrapper">
                    <img
                        src={branding1}
                        alt="Branding 1"
                        className="parallax-image"
                        ref={brandingImageRef}
                        onClick={() => { goToProject("design", "CheMono") }}
                    />
                </div>
                <div className="image-label-home">
                    Che Mono
                </div>
                <div className="image-label-star">
                    <img src={starImage} alt="Star" className="star-image-foto" onClick={goToAwardsAndPress} />
                </div>
            </div>
            <section className="image-and-quadrants desktop-hide">
                <div className="quadrant-container">
                    <div className="quadrant white-box">
                        <span className="project-box"> {lang === 'ES' ? 'Diseñamos ' : 'Inspiring'}</span>
                        <span className="project-box"> {lang === 'ES' ? 'espacios' : 'people'}</span>
                        <div className="moving-line" ref={line1Ref}></div>
                    </div>
                    <div
                        className={`quadrant yellow-box ${rotateYellowBox ? 'rotate' : ''}`}
                        ref={yellowBoxRef}
                    >
                        <div className="flip-container" onClick={goToProjects}>
                            <div className="front">
                                <img src={logoVertical} alt="Logo Vertical" className="logo-image" />
                            </div>
                            <div className="back" onClick={goToProjects}>
                                <span className='back-item'>{lang === 'ES' ? 'Diseño Comercial' : 'Design'}</span>
                                <span className='back-item'>{lang === 'ES' ? 'Arquitectura' : 'Architecture'}</span>
                                <span className='back-item'>{lang === 'ES' ? 'Marcas' : 'Brands'}</span>

                            </div>
                        </div>
                    </div>
                    <div className="quadrant blue-box" ref={counterRef} onClick={goToProjects}>
                        <span className="project-count">+{projectCount}</span>
                        <span className="project-label">{lang === 'ES' ? 'Proyectos' : 'projects'}</span>
                        <div className="moving-line2" ref={line2Ref}></div>
                    </div>
                    <div className="quadrant white-box" onClick={goToProjects}>
                        <span className="project-box">{lang === 'ES' ? 'que cuentan' : 'To create'}</span>
                        <span className="project-box">{lang === 'ES' ? 'historias' : 'exciting'}</span>
                        <span className="project-box">{lang === 'ES' ? 'y potencian' : 'places'}</span>
                        <span className="project-box">{lang === 'ES' ? 'marcas.' : ''}</span>

                    </div>
                </div>


                <div className="quadrant">
                    {/* Nueva sección horizontal para los contadores */}
                    <div className="horizontal-counter-section-new" ref={sectionCountersRef}>
                        <div className="horizontal-counter-item-new">
                            <span className="horizontal-project-count-new">+{yearsCount}</span>
                            <br />
                            <span className="horizontal-project-label-new" style={lang === 'ES' ? { paddingLeft: '1px' } :{ paddingLeft: "30px" }}>{lang === 'ES' ? 'años' : 'years'}</span>
                        </div>
                        <div className="horizontal-counter-item-new">
                            <span className="horizontal-project-count-new">+{countriesCount}</span>
                            <br />
                            <span className="horizontal-project-label-new" style={lang === 'ES' ? { paddingLeft: '3px' } :{ paddingLeft: "70px" }}>{lang === 'ES' ? 'países' : 'countries'}</span>
                        </div>
                        <div className="horizontal-counter-item-new">
                            <span className="horizontal-project-count-new">+{citiesCount}</span>
                            <br />
                            <span className="horizontal-project-label-new" style={lang === 'ES' ? { paddingLeft: '1px' } :{ paddingLeft: "27px" }}>{lang === 'ES' ? 'ciudades' : 'cities'}</span>
                        </div>

                    </div>

                </div>
                <div className="full-square">
                    <div className="parallax-wrapper" >
                        <img
                            src={interiorismo1}
                            alt="Interiorismo 1"
                            className="parallax-image"
                            ref={interiorismoImageRef}
                            onClick={() => { { goToProject("architecture", "Valpo1") } }}
                            style={{ position: "relative", top: "-13vh", width: "165vw", overflow: "hidden" }}

                        />
                        {/* Muestra el nombre del archivo */}
                    </div>
                    <div className="image-label-home">
                        Valpo 1
                    </div>
                    <div className="image-label-star">
                        <img src={starImage} alt="Star" className="star-image-foto" onClick={goToAwardsAndPress} />
                    </div>
                </div>

                <div className="new-quadrant-container" ref={slideBoxesRef} onClick={goToAwardsAndPress}>
                    <div
                        className={`quadrant green-box ${slideBoxes ? 'slide-green' : ''}`}
                    >
                        <img src={starImage} alt="Star" className="star-image" onClick={goToAwardsAndPress} />
                    </div>
                    <div onClick={goToAwardsAndPress} className="quadrant white-box-estrella">
                        <span className="text-Awards" style={lang === 'ES' ? { paddingLeft: '-15%' } : undefined}>{lang === 'ES' ? <>Prensa &<br />Premios </> : 'Awards'}</span>
                    </div>
                </div>


                <div className="full-square">
                    <div className="parallax-wrapper">
                        <img
                            src={arquitectura2}
                            alt="Architecture 1"
                            className="parallax-image"
                            ref={arquitecturaImageRef}
                            onClick={() => { goToProject("design", "HotelAzurLobby") }}
                            style={{ position: "relative", left: "-25vh", top: "-2vh", width: "195vw", overflow: "hidden" }}
                        />
                    </div>
                    <div className="image-label-home">
                        Hotel Azur Lobby
                    </div>
                    <div className="image-label-star">
                        <img src={starImage} alt="Star" className="star-image-foto" />
                    </div>
                </div>

                <div className="custom-quadrant-container">
                    <div
                        className={`custom-orange-box ${slideStudioBox ? 'custom-slide-orange' : ''}`}
                        ref={slideStudioBoxRef} onClick={goToStudio}
                    >
                    {/*     <img src={groupImage} alt="Group Icon" className="icon-image" onClick={goToStudio} /> */}
                     <span className="text-Awards" style={{color:"#ffffff"}}>{lang === 'ES' ? <> Nuestro<br /> Equipo</> : 'Our Team'}</span>

                    </div>
                    <div onClick={goToStudio}
                        className={` quadrant custom-white-box ${slideStudioBox ? 'custom-slide-team' : ''}`}
                    >
                         {slideStudioBox && <span className="text-Awards" style={{textAlign:"left", lineHeight:"1.5"}}>{lang === 'ES' ? <>Argentina<br/>España<br/>USA</> : <>Argentina<br/>Spain<br/>USA</>}</span>}

                        
                    </div>
                </div>

                <div className="horizontal-double-team" >

                    <img
                        src={teamImage}
                        alt="Team"
                        className="horizontal-image-team"
                        onClick={goToStudio}
                        ref={studioImageDesktopRef}
                        style={{ height: "130%", alignContent: "center", justifyContent: "center" }}

                    />

                </div>
            </section>

            {/* fin seccion mobile */}



            {/* Seccion Desktop */}

            {/* caja doblea ancho */}
            <div className="full-square-desktop mobile-hide grid-container-uno">
                <div className="container-one">
                    <div className="parallax-wrapper home-parallax-desktop box-uno" >
                        <img
                            src={branding2}
                            alt="Branding 1"
                            className="parallax-image"
                            ref={brandingDesktopImageRef}
                            onClick={() => { goToProject("design", "CheMono"); }}
                            style={{ width: "70vw", position: 'relative', left: '-16%' }}
                        />
                        <div className="image-label-home-desktop">
                            Che Mono
                        </div>
                        <div className="image-label-star-desktop">
                            <img src={starImage} alt="Star" className="star-image-foto-desktop" onClick={goToAwardsAndPress} />
                        </div>
                    </div>

                    <div className=" quadrant white-box-desktop box-two" style={{ position: 'relative', left: '76%', alignItems: "baseline" }}>

                        <span className="project-box-desktop" style={lang === 'ES' ? { paddingLeft: '15%' } : undefined}> {lang === 'ES' ? 'Diseñamos' : 'Inspiring'}</span><br />
                        <span className="project-box-desktop" style={lang === 'ES' ? { paddingLeft: '15%' } : undefined}> {lang === 'ES' ? 'espacios' : 'people'}</span>
                        <div className="desktopmoving-line" ref={desktopline1Ref}></div>
                    </div>
                </div>
            </div>

            {/*                 Van 3 cajas iguales en la misma fila ,   */}
            <div className="row-2-desktop mobile-hide">
                <div className="quadrant-row-2 white-box-desktop mobile-hide" onClick={goToProjects} style={{ alignItems: "baseline" }}>
                    <span className="project-box-desktop" style={lang === 'ES' ? { paddingLeft: '15%' } : undefined}>{lang === 'ES' ? 'que cuentan' : 'To create'}</span>
                    <span className="project-box-desktop" style={lang === 'ES' ? { paddingLeft: '15%' } : undefined}>{lang === 'ES' ? 'historias' : 'exciting'}</span>
                    <span className="project-box-desktop" style={lang === 'ES' ? { paddingLeft: '15%' } : undefined} >{lang === 'ES' ? 'y potencian' : 'places'}</span>
                    <span className="project-box-desktop" style={lang === 'ES' ? { paddingLeft: '15%' } : undefined} >{lang === 'ES' ? 'marcas.' : ''}</span>

                    <div className="desktopmoving-line2" ref={desktopline2Ref}></div>

                </div>
                <div className={`quadrant-row-2 yellow-box ${rotateYellowBoxDesktop ? 'rotate' : ''}`}
                    ref={yellowBoxDesktopRef}
                    onClick={goToProjects}>
                    <div className="flip-container">
                        <div className="front">
                            <img src={logoVertical} alt="Logo Vertical" className="logo-image-desktop" />
                        </div>
                        <div className="back mobile-hide">
                            <span className='back-item' style={{ marginLeft: "3%" }}>{lang === 'ES' ? 'Diseño Comercial' : 'Design'}</span>
                            <span className='back-item' style={{ marginLeft: "3%" }}>{lang === 'ES' ? 'Arquitectura' : 'Architecture'}</span>
                            <span className='back-item' style={{ marginLeft: "3%" }}>{lang === 'ES' ? 'Marcas' : 'Brands'}</span>
                        </div>
                    </div>
                </div>

                <div className="quadrant-row-2 white-box-desktop mobile-hide"
                >
                    <img
                        src={arquitectura3}
                        alt="Architecture 1"
                        onClick={() => { goToProject("architecture", "Valpo1") }}
                        style={{ width: "34vw", height: "39.55vw" }}
                    />

                </div>
            </div>
            {/* tercera linea*/}
            <div className="full-square-desktop mobile-hide grid-container-uno mobile-hide">
                <div className="container-one mobile-hide">
                    <div className="parallax-wrapper home-parallax-desktop box-uno mobile-hide" >
                        <img
                            src={arquitectura2}
                            alt="Interiorismo 1"
                            className="parallax-image"
                            ref={interiorismoDesktopImageRef}
                            onClick={() => { goToProject("design", "HotelAzurLobby") }}
                            style={{ width: "73vw", position: 'relative', left: '-16%', overflow: "hidden" }}
                        />
                        <div className="image-label-home-desktop">
                            Hotel Azur Lobby
                        </div>
                        <div className="image-label-star-desktop mobile-hide">
                            <img src={starImage} alt="Star" className="star-image-foto-desktop" onClick={goToAwardsAndPress} />
                        </div>
                    </div>
                    <div className=" quadrant blue-box-desktop box-two mobile-hide" ref={counterDesktopRef} style={{ position: 'relative', left: '102%', width: "33vw" }}>
                        <span className="project-count-desktop">+{projectCountDesktop}</span>
                        <span className="project-label-desktop">{lang === 'ES' ? 'proyectos' : 'projects'}</span>
                    </div>
                </div>
            </div>
            {/* cuarta linea*/}
            <div className="row-3-desktop mobile-hide">
                <div style={{ width: "33vw", height: "66vw", overflow: "hidden" }} className="quadrant-row-2 white-box-desktop mobile-hide" onClick={goToProjects}>
                    <video
                        src={interiorismoVideo1}
                        className="parallax-video"                    /* dale el mismo estilo base que .parallax-image */
                        ref={interiorismoVideoDesktopRef}             /* si tu lógica de parallax lo necesita */
                        onClick={() => goToProject("design", "CheMono")}
                        autoPlay
                        loop
                        muted
                        playsInline                                  /* indispensable para autoplay en móvil */
                        style={{
                            width: "40vw",
                            position: "relative",
                            /* left: "4%",
                            top: "1%", */
                            objectFit: "cover",                         /* rellena como la imagen */
                            overflow: "hidden"
                        }}
                    />

                </div>
                <div className="quadrant mobile-hide" style={{ alignItems: "baseline", width: "32vw", height: "66vw" }} >

                    {/* Nueva sección horizontal para los contadores */}
                    <div className="horizontal-counter-section-new-desktop mobile-hide" ref={sectionCountersDesktopRef}>
                        <div className="horizontal-counter-item-new-desktop">
                            <span className="horizontal-project-count-new-desktop" style={{ marginBottom: "-27px", display: "grid", justifyContent: "end" }}>+{citiesCountDesktop}</span>
                            <span className="horizontal-project-label-new-desktop" style={lang === 'ES' ? { paddingLeft: "7px", marginTop: "-20px" } : { paddingLeft: "27px", marginTop: "-20px" }}>{lang === 'ES' ? 'ciudades' : 'cities'}</span>
                        </div>
                        <div className="horizontal-counter-item-new-desktop">
                            <span className="horizontal-project-count-new-desktop">+{countriesCountDesktop}</span>
                            <br />
                            <span className="horizontal-project-label-new-desktop" style={lang === 'ES' ? { paddingLeft: '27px' } : { paddingLeft: "146px" }}>{lang === 'ES' ? 'países' : 'countries'}</span>
                        </div>
                        <div className="horizontal-counter-item-new-desktop">
                            <span className="horizontal-project-count-new-desktop">+{yearsCountDesktop}</span>
                            <br />
                            <span className="horizontal-project-label-new-desktop" style={lang === 'ES' ? { paddingLeft: '22px' } : { paddingLeft: "49px" }}>{lang === 'ES' ? 'años' : 'years'}</span>
                        </div>

                    </div>

                </div>
                <div>

                    <div className=" white-box-desktop mobile-hide"
                    >
                        <img
                            src={arquitectura4}
                            alt="Architecture 1"
                            onClick={() => { goToProject("design", "CentralClub") }}
                            style={{ width: "33vw", height: "30vw" }}
                        />
                    </div>
                    <div className="quadrant-row-2 white-box-desktop" onClick={goToProjects} style={{ alignItems: "baseline", width: "34.8vw", height: "27vw" }}>

                    </div>
                </div>
            </div>
            <section className="image-and-quadrants mobile-hide">

                <div className="full-square-desktop mobile-hide grid-container-uno awards-row" >
                    <div className="container-one mask-overflow" >
                        <div className="parallax-wrapper home-parallax-desktop box-uno" >
                            <img
                                src={interiorismo2}
                                alt="Architecture 1"
                                className="parallax-image-architecture foto-doble-3"
                                ref={arquitectura4DesktopImageRef}
                                onClick={() => { goToProject("design", "BarilatteUrca") }}

                            />

                            <div className="image-label-home-desktop mobile-hide" >
                                {getFileName(interiorismo2)}
                            </div>
                            <div className="image-label-star-architecture mobile-hide">
                                <img src={starImage} alt="Star" className="star-image-foto-architecture" />
                            </div>


                        </div>
                    </div>


                    <div
                        className="quadrant-star-desktop box-two-star-desktop wrapper-star-custom"
                        ref={slideBoxesDesktopRef}
                    >
                        {/* Caja verde que se mueve */}
                        <div className={`quadrant-row-2-star-desktop green-box-star-desktop ${slideBoxesDesktop ? 'slide-green-star-desktop' : ''}`}>
                            <img src={starImage} alt="Star" className="star-image-star-desktop" onClick={goToAwardsAndPress} />
                        </div>

                        {/* Awards detrás de la caja verde */}
                        <div className="quadrant-star-desktop white-box-estrella-star-desktop">
                            <span className="text-Awards-desktop">{lang === 'ES' ? <>Prensa & <br />Premios </> : 'Awards'}</span>
                        </div>
                    </div>

                </div>

                <div className='row-box-studio mobile-hide'>

                    <div className="custom-quadrant-container-desktop" ref={slideStudioBoxDesktopRef}>
                        <div
                            className={`custom-orange-box-desktop ${slideStudioBoxDesktop ? 'custom-slide-orange-desktop' : ''}`}
                            onClick={goToStudio}
                        >
                             <span className="text-Awards-desktop" style={{textAlign:"left", color:"#ffffff"}}>{lang === 'ES' ? <>Nuestro<br />Equipo</> : 'Our Team'}</span>
                            {/* <img src={groupImage} alt="Group Icon" className="star-image-star-desktop" onClick={goToStudio} />
 */}
                        </div>
                        <div onClick={goToStudio}
                            className="quadrant-row-2 custom-white-box-desktop"
                        >
                            {slideStudioBoxDesktop && <span className="project-box" style={{textAlign:"left", lineHeight:"1.5"}}>{lang === 'ES' ? <>Argentina<br/>España<br/>USA</> : <>Argentina<br/>Spain<br/>USA</>}</span>}
                        </div>
                    </div>


                    <div className="full-square-architecture mobile-hide">


                        <div className="parallax-wrapper-architecture mobile-hide">

                            <img
                                src={arquitectura1}
                                alt="Architecture 1"
                                onClick={() => { goToProject("design", "Soberana") }}
                                style={{ width: "151%", alignContent: "center", justifyContent: "center", marginLeft: "-22%" }}
                                ref={teamImageRef}
                                className='parallax-image-architecture foto-doble-3'

                            />
                        </div>

                        <div className="image-label-home-desktop" style={{ marginTop: "-100px" }}>
                            Soberana
                        </div>
                    </div>
                </div>
                <div className=" horizontal-double-team mobile-hide" >

                    <img
                        src={teamImage}
                        alt="Team"
                        className=" horizontal-image-team"
                        onClick={goToStudio}
                        style={{ width: "150%", alignContent: "center", justifyContent: "center", marginBottom: "8%" }}

                        ref={studioImageRef}

                    />

                </div>

            </section>
            {/* fin seccion Desktop */}
            <section className="content-section mobile-hide" style={{ width: "100%" }}>
                <div className="button-container">
                    <a className="custom-button-end-desktop">
                        <span onClick={goToProjects}>  <strong className="custom-button-project-desktop">{lang === 'ES' ? 'Proyectos' : 'check our projects'} </strong></span>
                    </a>
                </div>


                <div className="button-container-clients desktop-hide">
                    <CarouselLogos logos={logos} />
                </div>
                <ContactFooterDesktop />
                <div className="desktopmoving-line3" ref={desktopline3Ref}></div>
                <br />
                <br />

            </section>

            <section className="content-section desktop-hide">
                <div className="button-container">
                    <a className="custom-button-end">
                        <span onClick={goToProjects}> <strong> {lang === 'ES' ? 'Proyectos' : 'check our projects'} </strong></span>
                    </a>
                </div>


                <div className="button-container-clients ">
                    <CarouselLogos logos={logos} />
                </div>
                <ContactFooter />
            </section>
        </div>
    );
}

export default Home;
