import React, { useEffect, useState, useRef, useCallback, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { LanguageContext } from '../../context/LanguageContext';
import Navbar from '../Parcial/Navbar';
import ContactFooter from '../Parcial/ContactFooter';
import './studio.css';
import equipo from '../../assets/images/equipo.jpg';
import socios from '../../assets/images/socios.jpg';
import interiorismo from '../../assets/images/interiorismo.jpg';
import arquitectura from '../../assets/images/arquitectura.jpg';
import support from '../../assets/images/support.jpg';
import pms from '../../assets/images/pms.jpg';
import CarouselLogos from "../Parcial/CarouselLogos";
import ContactFooterDesktop from '../Parcial/ContactFooterDesktop'; // Ajusta la ruta según tu estructura de carpetas

const Studio = () => {

    // Inicio animación de menú 
    const { lang, toggleLang } = useContext(LanguageContext);
    const [showInput, setShowInput] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const [isSliding, setIsSliding] = useState(false); // Controla el deslizamiento del Navbar
    const options = [];

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
  const I18N_ALT = {
  ES: {
    equipo:        'Equipo',
    socios:        'Socios',
    pms:           'PMs',
    interiorismo:  'Interiorismo',
    arquitectura:  'Arquitectura',
    support:       'Soporte',
  },
  EN: {
    equipo:        'Team',
    socios:        'Founders',
    pms:           'PMs',
    interiorismo:  'Design',
    arquitectura:  'Architecture',
    support:       'Support',
  },
};

const images = [
  { id: 'equipo',        src: equipo,        alt: I18N_ALT[lang].equipo },
  { id: 'socios',        src: socios,        alt: I18N_ALT[lang].socios },
  { id: 'pms',           src: pms,           alt: I18N_ALT[lang].pms },
  { id: 'interiorismo',  src: interiorismo,  alt: I18N_ALT[lang].interiorismo },
  { id: 'arquitectura',  src: arquitectura,  alt: I18N_ALT[lang].arquitectura },
  { id: 'support',       src: support,       alt: I18N_ALT[lang].support },
];


    const [selectedImage, setSelectedImage] = useState('equipo');
    const [lastInteraction, setLastInteraction] = useState(Date.now());

    useEffect(() => {
        const interval = setInterval(() => {
            if (Date.now() - lastInteraction > 6000) {
                setSelectedImage(prev => {
                    const currentIndex = images.findIndex(img => img.id === prev);
                    const nextIndex = (currentIndex + 1) % images.length;
                    return images[nextIndex].id;
                });
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [lastInteraction, images]);

    const handleImageClick = (id) => {
        setSelectedImage(id);
        setLastInteraction(Date.now());
    };

    return (
        <div className="studio-section">
            <header className="studio-header">
                <Navbar isSliding={isSliding}
                    menuOpen={menuOpen}
                    setMenuOpen={setMenuOpen}
                    showInput={showInput}
                    setShowInput={setShowInput} />
            </header>


            {/* Galería con paneo */}
            <div className="studio-images studio-mobile-column">
                {images.map(img => (
                    <div
                        key={img.id}
                        className={`studio-image ${selectedImage === img.id ? 'selected' : ''}`}
                        style={{ backgroundImage: `url(${img.src})` }}
                        onClick={() => handleImageClick(img.id)}
                    >
                        <span className="image-label">{img.alt}</span>
                    </div>
                ))}
            </div>
            {/* Texto después de las imágenes */}
            <div className="studio-text">
                <span className="studio-title desktop-hide" > {lang === 'ES' ? <> Somos un Estudio<br /> de Diseño </> : <> We are a<br /> design studio </>}</span>
                <span className="studio-title mobile-hide">{lang === 'ES' ? 'Somos un Estudio de Diseño' : 'We are a design studio'}</span>
                <p className="studio-paragraph">
                    {lang === 'ES' ? 
                    "Somos un equipo apasionado dedicado al diseño de interiores con un enfoque comercial distintivo. Brindamos soluciones personalizadas con personalidades fuertes que se adaptan a las necesidades y preferencias únicas de cada proyecto. Con más de 10 años de experiencia, hemos diseñado más de 350 proyectos en más de 25 ciudades alrededor del mundo. Nuestra búsqueda de crear espacios auténticos y originales nos ha valido un reconocimiento notable y premios en arquitectura, diseño de interiores y branding. Estamos aquí para inspirar a las personas a crear lugares emocionantes." 
                    : "We are a passionate team dedicated to interior design with a distinct commercial focus. We provide personalized solutions with strong personalities that cater to the unique needs and preferences of each project. With over 10 years of experience, we've designed 350+ projects in 25+ cities around the world. Our pursuit of creating authentic and original spaces has earned us notable recognition and awards in architecture, interior design, and branding. We are here to inspire people to create exciting places."}
                    
                </p>
                <div class="column"  >
                    <blockquote class="styled-quote" style={lang === 'ES' ? { textAlign: "center", width: "77%" } : undefined}>
                        {lang === 'ES' ? <>Inspirando <br/> personas <br/>a crear<br/> espacios<br/> emocionantes.</> : "Inspiring people to create exciting places"}
                        
                    </blockquote>
                </div>
                <p className="studio-paragraph">
                    {lang === 'ES' ?
                "Creemos en forjar conexiones emocionales tanto con nuestros clientes como entre los espacios que diseñamos y sus futuros usuarios. Alineamos nuestro enfoque con los objetivos comerciales de cada marca, fomentando la colaboración estratégica, las alianzas y el crowdsourcing para brindar soluciones integrales basadas en la sabiduría colectiva."
                :"We believe in forging emotional connections with both our clients and among the spaces we design and their future users. We align our approach with the business objectives of each brand, fostering strategic collaboration, partnerships, and crowdsourcing to deliver comprehensive solutions based on collective wisdom."
                    }
                </p>
            </div>

            {/* Datos del equipo */}
            <div className="studio-team">
                <h2>{lang === 'ES' ? "Equipo":"Team"}</h2>

                {/* Founders Section */}
                <div className="team-section">
                    <h4>{lang === 'ES' ?"Fundadores":"Founders"}</h4>
                    <ul>
                        <li>Marco Ferrari / Arch. Co-founder</li>
                        <li>Gabriela Jagodnik / Arch. Co-founder</li>
                        <li>Ramiro Veiga / Arch. Co-founder</li>
                    </ul>
                </div>

                {/* PMs Section */}
                <div className="team-section">
                    <h4>PMs</h4>
                    <ul>
                        <li>Arch. Julieta Astorica</li>
                        <li>Arch. Violeta Bonicatto</li>
                        <li>Arch. Marco Ferrari /  Co-founder</li>
                        <li>Arch. Gustavo Macagno</li>
                        <li>Arch. Ramiro Veiga /  Co-founder</li>
                    </ul>
                </div>

                {/* Teams in Columns */}
                <div className="team-columns">
                    {/* Design Team */}
                    <div className="team-column">
                        <h4>{lang === 'ES' ?<>Equipo de<br/>Diseño</>: <> Design <br /> Team</>}</h4>
                        <ul>
                            <li>Arch. Francisco Brandan</li>
                            <li>Arch. Valentina Cabrera</li>
                            <li>Arch. Lucía Ceballos</li>
                            <li>Arch. Christopher Crespi</li>
                            <li>Arch. Simón Fassi</li>
                            <li>Arch. Daniela Francisco</li>
                            <li>Arch. María Agustina Lopez</li>
                            <li>Arch. Pilar Perez</li>
                            <li>Arch. Camila Ripoll</li>
                            <li>Arch. Ignacio Sottini</li>

                        </ul>
                    </div>

                    {/* Architecture Team */}
                    <div className="team-column">
                        <h4>{lang === 'ES' ?<>Equipo de<br/>Arquitectura</>:<>Architecture <br /> Team</>}</h4>
                        <ul>
                            <li>Arch. Abril Accotto</li>
                            <li>Arch. Franco Alvite</li>
                            <li>Arch. David Andres</li>
                            <li>Arch. Lucas Benitez</li>
                            <li>Arch. Bautista Dalmasso</li>
                            <li>Arch. Rosario Depalo</li>
                            <li>Arch. Franco Ferrari</li>
                            <li>Arch. Agostina Giacosa</li>
                            <li>Arch. Julieta Luccaroni</li>
                            <li>Arch. Víctor Ocaranza</li>
                            <li>Arch. Federico Ponce</li>
                            <li>Arch. Amparo Rodriguez</li>
                            <li>Arch. Triana Scarpinello</li>

                        </ul>
                    </div>
                </div>
                {/* PMs Section */}
                <div className="team-section">
                    <h4>{lang === 'ES' ?"Soporte":"Support"}</h4>
                    <ul>
                        <li>Sofía Agnolon</li>
                        <li>Cristina Alemandi</li>
                        <li>Mariana Fedriani</li>
                        <li>Soledad Pereyra</li>
                        <li>Mateo Sanchez</li>


                    </ul>
                </div>

                {/* PMs Section */}
                <div className="team-section">
                    {/* <h4>Clients</h4> */}
                    <br />
                    <br />



                </div>
            </div>
            <footer className="studio-footer mobile-hide">
                <ContactFooterDesktop />
            </footer>
            {/* Pie de página */}
            <footer className="studio-footer desktop-hide">
                <ContactFooter />
            </footer>
        </div>
    );
};

export default Studio;
