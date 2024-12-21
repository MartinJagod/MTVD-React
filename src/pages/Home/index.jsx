import React, { useEffect, useState, useRef, useCallback } from 'react';
import './Home.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import home1 from '../../assets/images/home1.jpg';
import homeVideo from '../../assets/images/homeVideo.mp4'; // Importa el video
import branding1 from '../../assets/images/COC.png';
import interiorismo1 from '../../assets/images/Felicity.jpeg';
import interiorismo2 from '../../assets/images/Hoppiness.jpg';
import interiorismo3 from '../../assets/images/interiorismo3.jpg';
import teamImage from '../../assets/images/team.jpeg';
import arquitectura1 from '../../assets/images/Hoppiness.jpg';
import starImage from '../../assets/images/estrella.png';
import groupImage from '../../assets/images/group.png';
import logoHorizontal from '../../assets/images/logo-horizontal.png';
import logoVertical from '../../assets/images/logo-vertical.png';
import { FaSearch } from 'react-icons/fa';
import logoSlogan from '../../assets/images/logo-slogan.png';
import { FaLinkedin, FaPinterest, FaYoutube, FaInstagram } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { FaVolumeMute, FaVolumeUp } from 'react-icons/fa';



function Home() {
    const [projectCount, setProjectCount] = useState(0);
    const [yearsCount, setYearsCount] = useState(0);
    const [countriesCount, setCountriesCount] = useState(0);
    const [citiesCount, setCitiesCount] = useState(0);
    const [showInput, setShowInput] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [rotateYellowBox, setRotateYellowBox] = useState(false);
    const [slideBoxes, setSlideBoxes] = useState(false);
    const [slideStudioBox, setSlideStudioBox] = useState(false);
    const [hasStartedCountingProjects, setHasStartedCountingProjects] = useState(false);
    const [hasStartedCountingSection, setHasStartedCountingSection] = useState(false);
    const yellowBoxRef = useRef(null); // Referencia al yellow-box
    const [menuOpen, setMenuOpen] = useState(false);
    const [isBlurred, setIsBlurred] = useState(true); // Estado para manejar el blur
    let scrollTimeout = null; // Variable para manejar el timeout
    const [isMuted, setIsMuted] = useState(true);

    // inicio parallax
    const brandingImageRef = useRef(null);
    const interiorismoImageRef = useRef(null);
    const arquitecturaImageRef = useRef(null); // Nueva referencia
    //saca el nombre del archivo
    function getFileName(filePath) {
        const fullName = filePath.split('/').pop(); // Obtiene el último segmento de la ruta
        const nameWithoutExtension = fullName.split('.')[0]; // Extrae la parte antes del primer punto
        return nameWithoutExtension;
    }

    const handleMenuClick = () => {
        setMenuOpen(!menuOpen);
    };
    const toggleMenu = () => {
        setMenuOpen(!menuOpen); // Alterna entre true y false
    };

    useEffect(() => {
        const handleParallaxEffect = () => {
            const scrollPosition = window.scrollY;

            // Efecto para la primera imagen (Branding)
            if (brandingImageRef.current?.isVisible) {
                const brandingOffset = brandingImageRef.current.getBoundingClientRect().top + scrollPosition;
                const brandingScroll = Math.max(0, scrollPosition - brandingOffset);
                const scale = 1 - Math.min(brandingScroll * 0.0001, 0.1);
                const translateY = brandingScroll * 0.1;
                brandingImageRef.current.style.transform = `translateY(${translateY}px) scale(${scale})`;
            }

            // Efecto para la segunda imagen (Interiorismo)
            if (interiorismoImageRef.current?.isVisible) {
                const interiorismoOffset = interiorismoImageRef.current.getBoundingClientRect().top + scrollPosition;
                const interiorismoScroll = Math.max(0, scrollPosition - interiorismoOffset);
                const scale = 1 - Math.min(interiorismoScroll * 0.0001, 0.1);
                const translateY = interiorismoScroll * 0.1;
                interiorismoImageRef.current.style.transform = `translateY(${translateY}px) scale(${scale})`;
            }

            // Efecto para la tercera imagen (Arquitectura)
            if (arquitecturaImageRef.current?.isVisible) {
                const arquitecturaOffset = arquitecturaImageRef.current.getBoundingClientRect().top + scrollPosition;
                const arquitecturaScroll = Math.max(0, scrollPosition - arquitecturaOffset);
                const scale = 1 - Math.min(arquitecturaScroll * 0.0001, 0.1);
                const translateY = arquitecturaScroll * 0.1;
                arquitecturaImageRef.current.style.transform = `translateY(${translateY}px) scale(${scale})`;
            }
        };

        const observerCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.target === brandingImageRef.current) {
                    brandingImageRef.current.isVisible = entry.isIntersecting;
                }
                if (entry.target === interiorismoImageRef.current) {
                    interiorismoImageRef.current.isVisible = entry.isIntersecting;
                }
                if (entry.target === arquitecturaImageRef.current) {
                    arquitecturaImageRef.current.isVisible = entry.isIntersecting;
                }
            });
        };

        const observerOptions = {
            root: null, // Usa el viewport del navegador
            threshold: 0, // Activa cuando cualquier parte del elemento entra en pantalla
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        if (brandingImageRef.current) observer.observe(brandingImageRef.current);
        if (interiorismoImageRef.current) observer.observe(interiorismoImageRef.current);
        if (arquitecturaImageRef.current) observer.observe(arquitecturaImageRef.current);

        window.addEventListener('scroll', handleParallaxEffect);

        return () => {
            if (brandingImageRef.current) observer.unobserve(brandingImageRef.current);
            if (interiorismoImageRef.current) observer.unobserve(interiorismoImageRef.current);
            if (arquitecturaImageRef.current) observer.unobserve(arquitecturaImageRef.current);
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
    const importAll = (requireContext) =>
        requireContext.keys().map(requireContext);

    // Obtén los logos
    const logos = importAll(
        require.context('../../assets/images/logosClientes', false, /\.(png|jpe?g|svg)$/)
    );

    // Duplicar los logos para permitir flujo continuo
    const duplicatedLogos = [...logos, ...logos];
    //fin carousel


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
            }, 1500); // Espera 3 segundos para que el menú se abra completamente

            // Limpia el timeout al desmontar el componente o si `menuOpen` cambia
            return () => clearTimeout(timeout);
        }
    }, [menuOpen]);



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

                <div className={`header-navbar ${isBlurred ? "" : "no-blur"}`}>
                    <div className="header-content">
                        <div className="logo">
                            <img src={logoHorizontal} alt="Logo Horizontal" className="logo-img" />
                        </div>
                        <div className="icons">
                            <FaSearch className="search-icon-home" onClick={handleSearchClick} />
                            <span className="icon" onClick={toggleMenu}>☰</span>
                        </div>
                    </div>
                    <div className={`hamburger-menu ${menuOpen ? 'menu-open' : 'menu-close'}`}>
                        <div className="menu-header">
                            <span className="menu-close-icon" onClick={() => setMenuOpen(false)}>✖</span>
                        </div>
                        <nav className="menu-items">
                            <Link to="/projectsHome" className="menu-link projects">Projects</Link>
                            <a href="#press-awards" className="menu-link press-awards">Press & Awards</a>
                            <a href="#studio" className="menu-link studio">Studio</a>
                            <Link to="/projects" className="menu-link contact">Contact</Link>
                            <span className="menu-dash"></span>
                        </nav>
                        <div className="menu-footer"></div>
                    </div>


                </div>


                <div className={`search-container ${showInput ? 'search-open' : ''}`}>
                    <div className="search-bar">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={handleInputChange}
                        />
                        <span className="close-icon" onClick={handleSearchClick}>✖</span>
                    </div>
                    {searchTerm && (
                        <div className="search-menu">
                            {filteredOptions.length > 0 ? (
                                <ul>
                                    {filteredOptions.map((option, index) => (
                                        <li key={index}>{option}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="no-results">No results found</p>
                            )}
                        </div>
                    )}
                </div>

            </header>


            <div className="phrase-section">
                <span className="phrase-line">We are a</span>
                <span className="phrase-line">design studio</span>
            </div>
            <div className="full-square">
                <div className="parallax-wrapper">
                    <img
                        src={branding1}
                        alt="Branding 1"
                        className="parallax-image"
                        ref={brandingImageRef}
                    />
                    <div className="image-label">
                        {getFileName(branding1)}
                    </div>
                </div>
            </div>


            <section className="image-and-quadrants">
                <div className="quadrant-container">
                    <div className="quadrant white-box">
                        <span className="project-box">Inspiring</span>
                        <span className="project-box">people</span>
                        <div className="moving-line"></div>
                    </div>
                    <div
                        className={`quadrant yellow-box ${rotateYellowBox ? 'rotate' : ''}`}
                        ref={yellowBoxRef}
                    >
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
                    <div className="quadrant blue-box" ref={counterRef}>
                        <span className="project-count">+{projectCount}</span>
                        <span className="project-label">projects</span>
                        <div className="moving-line2"></div>
                    </div>
                    <div className="quadrant white-box">
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
                        />
                        {/* Muestra el nombre del archivo */}
                        <div className="image-label">
                            {getFileName(interiorismo1)}
                        </div>
                    </div>
                </div>



                {/*            <div className="quadrant vertical-double">

<div className="quadrant module-box">
<img src={branding1} alt="Branding 1" className="module-image" />
</div>
<div className="quadrant-blue module-box">
<img src={interiorismo2} alt="Interiorismo 2" className="module-image" />
</div>
</div>
<div className="quadrant vertical-double">
<img src={interiorismo1} alt="Interiorismo 1" className="module-image" />
</div> */}
                <div className="new-quadrant-container" ref={slideBoxesRef}>
                    <div
                        className={`quadrant green-box ${slideBoxes ? 'slide-green' : ''}`}
                    >
                        <img src={starImage} alt="Star" className="star-image" />
                    </div>
                    <div className="quadrant white-box-estrella">
                        <span className="text-Awards">Awards</span>
                    </div>
                </div>


                <div className="full-square">
                    <img ref={arquitecturaImageRef} src={arquitectura1} alt="Architecture 1" className="square-image" />
                    <div className="image-label">
                        {getFileName(arquitectura1)}
                    </div>
                </div>

                <div className="custom-quadrant-container">
                    <div
                        className={`custom-orange-box ${slideStudioBox ? 'custom-slide-orange' : ''}`}
                        ref={slideStudioBoxRef}
                    >
                        <img src={groupImage} alt="Group Icon" className="icon-image" />

                    </div>
                    <div
                        className={` quadrant custom-white-box ${slideStudioBox ? 'custom-slide-team' : ''}`}
                    >
                        {slideStudioBox && <span className="text-Awards">Our Studio</span>}
                    </div>
                </div>

                {/*             <div className="quadrant-container">
    <div className="quadrant vertical-double">
                        <img src={arquitectura1} alt="Arquitectura 1" className="module-image" />
                    </div>
                    <div
                        className={`vertical-double-container ${slideStudioBox ? 'slide-active' : ''}`}
                        ref={slideStudioBoxRef}
                    >
                        <div className="vertical-box white-box-studio">
                            {slideStudioBox && <span>Our Studio</span>}
                        </div>
                        <div className="vertical-box orange-box-studio">
                            <img src={groupImage} alt="Group Icon" className="icon-image" />
                        </div>
                    </div> 

                    <div className="quadrant vertical-double">
                        <img src={interiorismo3} alt="Interiorismo 3" className="module-image" />
                    </div>
                </div> */}
                <div className="horizontal-double-team" >
                    <img src={teamImage} alt="Team" className="horizontal-image-team" />

                </div>
            </section>

            <section className="content-section">
                <div className="button-container">
                    <a href="/" className="custom-button">
                        <span> check our  <strong> projects </strong></span>
                    </a>
                </div>
                <div className="button-container-clients">
                    <div className="carousel-container">
                        <div className="carousel-track">
                            {duplicatedLogos.map((logo, index) => (
                                <div key={index} className="carousel-item">
                                    <img
                                        src={logo}
                                        alt={`Logo ${index}`}
                                        className="logo-image"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="contact-section-footer">
                    <hr className="divider-line-home" />
                    <img src={logoSlogan} alt="Logo Slogan" className="logo-slogan" />
                    <div className="contact-details">
                        <p><strong>SPAIN</strong> <br /> contact@mtvd-design.com</p>
                        <p><strong>USA</strong> <br /> contact@mtvd-design.com</p>
                        <p><strong>ARGENTINA</strong> <br /> contact@mtvd-design.com</p>
                    </div>
                    <div className="social-icons-black">
                        <a href="https://www.linkedin.com/company/mtvd/" target="_blank" rel="noopener noreferrer">
                            <FaLinkedin className="social-icon" />
                        </a>
                        <a href="https://ar.pinterest.com/mtvddesignstudio/" target="_blank" rel="noopener noreferrer">
                            <FaPinterest className="social-icon" />
                        </a>
                        <a href="https://www.youtube.com/@MTVDDesignStudio" target="_blank" rel="noopener noreferrer">
                            <FaYoutube className="social-icon" />
                        </a>
                        <a href="https://www.instagram.com/estudio_montevideo" target="_blank" rel="noopener noreferrer">
                            <FaInstagram className="social-icon" />
                        </a>
                    </div>
                    <br />
                    <br />

                </div>
            </section>
        </div>
    );
}

export default Home;
