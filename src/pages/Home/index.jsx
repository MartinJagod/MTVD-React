import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from "react-router-dom";

import './Home.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import home1 from '../../assets/images/home1.jpg';
import homeVideo from '../../assets/images/homeVideo.mp4'; // Importa el video

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
import { FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import ContactFooter from '../Parcial/ContactFooter'; // Ajusta la ruta según tu estructura de carpetas
import Navbar from '../Parcial/Navbar'; // Ajusta la ruta según tu estructura de carpetas
import CarouselLogos from "../Parcial/CarouselLogos";

function Home() {


    const branding1 = "/assets/images/PaginaProyecto/principal/Che Mono.jpg";
    const interiorismo1 = "/assets/images/PaginaProyecto/principal/Barilatte.jpg";
    const interiorismo2 = "/assets/images/PaginaProyecto/principal/Soberana.jpg";
    const arquitectura1 = "/assets/images/PaginaProyecto/principal/Soberana.jpg";
    const [projectCount, setProjectCount] = useState(0);
    const [yearsCount, setYearsCount] = useState(0);
    const [countriesCount, setCountriesCount] = useState(0);
    const [citiesCount, setCitiesCount] = useState(0);
    const [showInput, setShowInput] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [rotateYellowBox, setRotateYellowBox] = useState(false);
    const [rotateYellowBoxDesktop, setRotateYellowBoxDesktop] = useState(false);

    const [slideBoxes, setSlideBoxes] = useState(false);
    const [slideStudioBox, setSlideStudioBox] = useState(false);
    const [hasStartedCountingProjects, setHasStartedCountingProjects] = useState(false);
    const [hasStartedCountingSection, setHasStartedCountingSection] = useState(false);
    const yellowBoxRef = useRef(null); // Referencia al yellow-box
    const yellowBoxDesktopRef = useRef(null); // Referencia al yellow-box

    const [isBlurred, setIsBlurred] = useState(true); // Estado para manejar el blur
    let scrollTimeout = null; // Variable para manejar el timeout
    const [isMuted, setIsMuted] = useState(true);
    const navigate = useNavigate();
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
    const goToProject = (id) => {
        navigate(`/project/${id}`); // Cambia a la ruta
    }


    // fin cambios de pagina


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
    const arquitecturaDesktopImageRef = useRef(null);

    //inicio parallax

    useEffect(() => {
        const imageRefs = [
            { ref: brandingImageRef, speed: 0.15 },
            { ref: interiorismoImageRef, speed: 0.15 },
            { ref: arquitecturaImageRef, speed: 0.15 },
            { ref: brandingDesktopImageRef, speed: 0.15 },
            { ref: interiorismoDesktopImageRef, speed: 0.15 },
            { ref: arquitecturaDesktopImageRef, speed: 0.15 },
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
    const slideStudioBoxRef = useRef(null);

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
        animateCounter(setProjectCount, 350, 2000);
        setHasStartedCountingProjects(true);
    }, [animateCounter]);

    const startCountingSection = useCallback(() => {
        animateCounter(setYearsCount, 10, 4000);
        animateCounter(setCountriesCount, 15, 4000);
        animateCounter(setCitiesCount, 25, 4000);
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
            { threshold: 1 } // Ajusta el umbral para determinar cuándo se activa
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
// Inicio animación de cajas naranja 

useEffect(() => {
    const observerYellowBox = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                setRotateYellowBoxDesktop((prev) => !prev); // Alterna el estado cada vez que entra en pantalla
            }
        });
    }, { threshold: 1 }); // Detecta cuando el 80% del elemento es visible

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
        if (videoRef.current) {
            videoRef.current.muted = true; // Mute el video inicialmente
            videoRef.current.play().catch((err) => {
                console.error("Autoplay blocked: ", err);
            });
        }
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
            { threshold: 0.1 } // Ajusta el umbral según sea necesario
        );

        if (line1Ref.current) observer.observe(line1Ref.current);
        if (line2Ref.current) observer.observe(line2Ref.current);

        return () => {
            if (line1Ref.current) observer.unobserve(line1Ref.current);
            if (line2Ref.current) observer.unobserve(line2Ref.current);
        };
    }, []);
    // fin lineas


    return (
        <div className="home">

            {/* Video de fondo */}
            <header className="home-header">
                <video
                    ref={videoRef}
                    className="background-video"
                    src={homeVideo}
                    autoPlay
                    loop={false}
                    playsInline
                    muted={true}
                    onEnded={handleVideoEnd}
                ></video>

                <button className="mute-button" onClick={toggleMute}>
                    {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                </button>
                <Navbar
                    isSliding={isSliding}
                    menuOpen={menuOpen}
                    setMenuOpen={setMenuOpen}
                    showInput={showInput}
                    setShowInput={setShowInput} />

            </header>


            <div className="phrase-section-home desktop-hide" onClick={goToStudio}>
                <span className="phrase-line"> We are a </span> <br />
                <span className="phrase-line"> design studio </span>
            </div>
            <div className="phrase-section-home mobile-hide" onClick={goToStudio}>
                <span className="phrase-line"> We are a design studio </span>
            </div>
            {/* Seccion mobile */}
            <div className="full-square desktop-hide">
                
                <div className="parallax-wrapper">
                    <img
                        src={branding1}
                        alt="Branding 1"
                        className="parallax-image"
                        ref={brandingImageRef}
                        onClick={() => { goToProject(1) }}
                    />
                </div>
                <div className="image-label-home">
                    {getFileName(branding1)}
                </div>
                <div className="image-label-star">
                    <img src={starImage} alt="Star" className="star-image-foto" onClick={goToAwardsAndPress} />
                </div>
            </div>
            <section className="image-and-quadrants desktop-hide">
                <div className="quadrant-container">
                    <div className="quadrant white-box">
                        <span className="project-box">Inspiring</span>
                        <span className="project-box">people</span>
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
                                <span className='back-item'>Design</span>
                                <span className='back-item'>Architecture</span>
                                <span className='back-item'>Branding</span>

                            </div>
                        </div>
                    </div>
                    <div className="quadrant blue-box" ref={counterRef} onClick={goToProjects}>
                        <span className="project-count">+{projectCount}</span>
                        <span className="project-label">projects</span>
                        <div className="moving-line2" ref={line2Ref}></div>
                    </div>
                    <div className="quadrant white-box" onClick={goToProjects}>
                        <span className="project-box">To create</span>
                        <span className="project-box">exciting</span>
                        <span className="project-box">places</span>
                    </div>
                </div>


                <div className="quadrant">



                    {/* Nueva sección horizontal para los contadores */}
                    <div className="horizontal-counter-section-new" ref={sectionCountersRef}>
                        <div className="horizontal-counter-item-new">
                            <span className="horizontal-project-count-new">+{yearsCount}</span>
                            <br />
                            <span className="horizontal-project-label-new" style={{ paddingLeft: "30px" }}>years</span>
                        </div>
                        <div className="horizontal-counter-item-new">
                            <span className="horizontal-project-count-new">+{countriesCount}</span>
                            <br />
                            <span className="horizontal-project-label-new" style={{ paddingLeft: "70px" }}>countries</span>
                        </div>
                        <div className="horizontal-counter-item-new">
                            <span className="horizontal-project-count-new">+{citiesCount}</span>
                            <br />
                            <span className="horizontal-project-label-new" style={{ paddingLeft: "27px" }}>cities</span>
                        </div>

                    </div>

                </div>
                <div className="full-square">
                    <div className="parallax-wrapper">
                        <img
                            src={interiorismo1}
                            alt="Interiorismo 1"
                            className="parallax-image"
                            ref={interiorismoImageRef}
                            onClick={() => { goToProject(2) }}

                        />
                        {/* Muestra el nombre del archivo */}
                    </div>
                    <div className="image-label-home">
                        {getFileName(interiorismo1)}
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
                        <span className="text-Awards">Awards</span>
                    </div>
                </div>


                <div className="full-square">
                    <div className="parallax-wrapper">
                        <img
                            src={arquitectura1}
                            alt="Architecture 1"
                            className="parallax-image"
                            ref={arquitecturaImageRef}
                            onClick={() => { goToProject(3) }}

                        />
                    </div>
                    <div className="image-label-home">
                        {getFileName(arquitectura1)}
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
                        <img src={groupImage} alt="Group Icon" className="icon-image" onClick={goToStudio} />

                    </div>
                    <div onClick={goToStudio}
                        className={` quadrant custom-white-box ${slideStudioBox ? 'custom-slide-team' : ''}`}
                    >
                        {slideStudioBox && <span className="text-Awards">Our Studio</span>}
                    </div>
                </div>

                <div className="horizontal-double-team" >
                    <img src={teamImage} alt="Team" className="horizontal-image-team" onClick={goToStudio} />

                </div>
            </section>

            {/* fin seccion mobile */}

            {/* Seccion Desktop */}
            {/* caja doblea ancho */}
            <div className="full-square-desktop mobile-hide grid-container-uno">
                <div className="container-one">
                    <div className="parallax-wrapper home-parallax-desktop box-uno" >
                        <img
                            src={branding1}
                            alt="Branding 1"
                            className="parallax-image"
                            ref={brandingDesktopImageRef}
                            onClick={() => { goToProject(1) }}
                            style={{ width: "70vw",  position: 'relative',left: '-17%' }}
                        />
                        <div className="image-label-home-desktop">
                            {getFileName(branding1)}
                        </div>
                        <div className="image-label-star-desktop">
                            <img src={starImage} alt="Star" className="star-image-foto-desktop" onClick={goToAwardsAndPress} />
                        </div>
                    </div>
                   
                    <div className=" quadrant white-box-desktop box-two"  style={{position: 'relative',left: '75%'}}>
                        <span className="project-box-desktop">Inspiring</span> <br />
                        <span className="project-box-desktop">people</span>
                        <div className="moving-line" ref={line1Ref}></div>
                    </div>
                </div>
            </div>

                {/*                 Van 3 cajas iguales en la misma fila ,   */}
                <div className="row-2-desktop">
    <div className="quadrant-row-2 white-box-desktop" onClick={goToProjects}>
        <span className="project-box-desktop">To create</span>
        <span className="project-box-desktop">exciting</span>
        <span className="project-box-desktop">places</span>
    </div>
    <div className={`quadrant-row-2 yellow-box ${rotateYellowBoxDesktop ? 'rotate' : ''}`} 
    ref={yellowBoxDesktopRef} 
    onClick={goToProjects}>
        <div className="flip-container">
            <div className="front">
                <img src={logoVertical} alt="Logo Vertical" className="logo-image" />
            </div>
            <div className="back">
                <span className='back-item'>Design</span>
                <span className='back-item'>Architecture</span>
                <span className='back-item'>Branding</span>
            </div>
        </div>
    </div>

    <div className="quadrant-row-2 white-box-desktop" onClick={goToProjects}>
        <span className="project-box-desktop">To create</span>
        <span className="project-box-desktop">exciting</span>
        <span className="project-box-desktop">places</span>
    </div>
</div>

            <section className="image-and-quadrants mobile-hide">


                <div className="quadrant mobile-hide">



                    {/* Nueva sección horizontal para los contadores */}
                    <div className="horizontal-counter-section-new mobile-hide" ref={sectionCountersRef}>
                        <div className="horizontal-counter-item-new">
                            <span className="horizontal-project-count-new">+{yearsCount}</span>
                            <br />
                            <span className="horizontal-project-label-new" style={{ paddingLeft: "30px" }}>years</span>
                        </div>
                        <div className="horizontal-counter-item-new">
                            <span className="horizontal-project-count-new">+{countriesCount}</span>
                            <br />
                            <span className="horizontal-project-label-new" style={{ paddingLeft: "70px" }}>countries</span>
                        </div>
                        <div className="horizontal-counter-item-new">
                            <span className="horizontal-project-count-new">+{citiesCount}</span>
                            <br />
                            <span className="horizontal-project-label-new" style={{ paddingLeft: "27px" }}>cities</span>
                        </div>

                    </div>

                </div>
                <div className="full-square">
                    <div className="parallax-wrapper">
                        <img
                            src={interiorismo1}
                            alt="Interiorismo 1"
                            className="parallax-image"
                            ref={interiorismoDesktopImageRef}
                            onClick={() => { goToProject(2) }}

                        />
                        {/* Muestra el nombre del archivo */}
                    </div>
                    <div className="image-label-home">
                        {getFileName(interiorismo1)}
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
                        <span className="text-Awards">Awards</span>
                    </div>
                </div>


                <div className="full-square">
                    <div className="parallax-wrapper">
                        <img
                            src={arquitectura1}
                            alt="Architecture 1"
                            className="parallax-image"
                            ref={arquitecturaDesktopImageRef}
                            onClick={() => { goToProject(3) }}

                        />
                    </div>
                    <div className="image-label-home">
                        {getFileName(arquitectura1)}
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
                        <img src={groupImage} alt="Group Icon" className="icon-image" onClick={goToStudio} />

                    </div>
                    <div onClick={goToStudio}
                        className={` quadrant custom-white-box ${slideStudioBox ? 'custom-slide-team' : ''}`}
                    >
                        {slideStudioBox && <span className="text-Awards">Our Studio</span>}
                    </div>
                </div>

                <div className="horizontal-double-team" >
                    <img src={teamImage} alt="Team" className="horizontal-image-team" onClick={goToStudio} />

                </div>
            </section>
            {/* fin seccion Desktop */}
            <section className="content-section">
                <div className="button-container">
                    <a className="custom-button-end">
                        <span onClick={goToProjects}> check our  <strong> projects </strong></span>
                    </a>
                </div>


                <div className="button-container-clients">
                    <CarouselLogos logos={logos} />
                </div>
                <ContactFooter />
            </section>
        </div>
    );
}

export default Home;
