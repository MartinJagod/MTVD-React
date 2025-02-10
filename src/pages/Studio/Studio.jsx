import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from "react-router-dom";

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

const Studio = () => {
  
    // Inicio animación de menú 
        const [showInput, setShowInput] = useState(false);
        const [menuOpen, setMenuOpen] = useState(false);
        const [searchTerm, setSearchTerm] = useState('');
        const navigate = useNavigate();
        const [isSliding, setIsSliding] = useState(false); // Controla el deslizamiento del Navbar
        const options = ['Architecture', 'Awards', 'Asphalt', 'Aluminum', 'Aggregate', 'Asbestos', 'Adhesive', 'Anchor', 'Acrylic', 'Acoustic'];

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
    const images = [
        { id: 'equipo', src: equipo, alt: 'Team' },
        { id: 'socios', src: socios, alt: 'Founders' },
        { id: 'pms', src: pms, alt: 'PMS' },
        { id: 'interiorismo', src: interiorismo, alt: 'Design' },
        { id: 'arquitectura', src: arquitectura, alt: 'Architecture' },
        { id: 'support', src: support, alt: 'Support' },
    ];

    const [selectedImage, setSelectedImage] = useState(null);
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
                <Navbar   isSliding={isSliding}
                    menuOpen={menuOpen}
                    setMenuOpen={setMenuOpen}
                    showInput={showInput}
                    setShowInput={setShowInput} />
            </header>

            {/* Contenedor de imágenes con paneo automático */}
            <div className="studio-images" style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                marginLeft: '10px',
                marginRight: '10px'
            }}>
                {images.map((image) => (
                    <div
                        key={image.id}
                        className={`studio-image ${selectedImage === image.id ? 'selected' : ''}`}
                        onClick={() => handleImageClick(image.id)}
                        style={{
                            backgroundImage: `url(${image.src})`,
                            width: '90vw',
                            height: selectedImage === image.id ? '39vh' : '4vh',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            transition: 'height 1s ease-in-out',
                            cursor: 'pointer',
                        }}
                    >
                        <span className="image-label">{image.alt}</span>
                    </div>
                ))}
            </div>
            {/* Texto después de las imágenes */}
            <div className="studio-text">
                <span className="studio-title">We are a<br /> design studio</span>
                <p className="studio-paragraph">
                    We are a passionate team dedicated to interior design
                    with a distinct commercial focus. We provide
                    personalized solutions with strong personalities that
                    cater to the unique needs and preferences of each
                    project. With over 10 years of experience, we've designed
                    350+ projects in 25+ cities around the world. Our pursuit of
                    creating authentic and original spaces has earned us
                    notable recognition and awards in architecture, interior
                    design, and branding. We are here to inspire people to
                    create exciting places.
                </p>
                <div class="column">
                    <blockquote class="styled-quote">
                        Inspiring people to create exciting places
                    </blockquote>
                </div>
                <p className="studio-paragraph">
                    We believe in forging emotional connections with both our
                    clients and among the spaces we design and their future
                    users. We align our approach with the business objectives
                    of each brand, fostering strategic collaboration,
                    partnerships, and crowdsourcing to deliver comprehensive
                    solutions based on collective wisdom.
                </p>
            </div>

            {/* Datos del equipo */}
            <div className="studio-team">
                <h2>Team</h2>

                {/* Founders Section */}
                <div className="team-section">
                    <h4>Founders</h4>
                    <ul>
                        <li>Gabriela Jagodnik / Arch. Co-founder</li>
                        <li>Marco Ferrari / Arch. Co-founder</li>
                        <li>Ramiro Veiga / Arch. Co-founder</li>
                    </ul>
                </div>

                {/* PMs Section */}
                <div className="team-section">
                    <h4>PMs</h4>
                    <ul>
                        <li>Gabriela Jagodnik / Arch. Co-founder</li>
                        <li>Marco Ferrari / Arch. Co-founder</li>
                        <li>Arch. Julieta Astorica</li>
                        <li>Arch. Violeta Bonicatto</li>
                        <li>Arch. Gustavo Macagno</li>
                    </ul>
                </div>

                {/* Teams in Columns */}
                <div className="team-columns">
                    {/* Design Team */}
                    <div className="team-column">
                        <h4>Design <br /> Team</h4>
                        <ul>
                            <li>Arch. Melisa Daives</li>
                            <li>Arch. Pilar Perez</li>
                            <li>Arch. Daniela Francisco</li>
                            <li>Arch. Lucía Ceballos</li>
                            <li>Arch. María Agustina Lopez</li>
                            <li>Arch. Camila Ripoll</li>
                            <li>Arch. Simón Fassi</li>
                            <li>Arch. Sofía Sanuni</li>
                            <li>Arch. Francisco Brandan</li>
                            <li>Arch. Florencia Mc Kidd</li>
                        </ul>
                    </div>

                    {/* Architecture Team */}
                    <div className="team-column">
                        <h4>Architecture <br /> Team</h4>
                        <ul>
                            <li>Arch. Agostina Giacosa</li>
                            <li>Arch. Franco Ferrari</li>
                            <li>Arch. Triana Scarpinello</li>
                            <li>Arch. Federico Ponce</li>
                            <li>Arch. Abril Accotto</li>
                            <li>Arch. Víctor Ocaranza</li>
                            <li>Arch. Melina Vargas Roic</li>
                            <li>Arch. Julieta Luccaroni</li>
                            <li>Arch. Rosario Depalo</li>
                            <li>Arch. David Andres</li>
                            <li>Arch. Agustín Pajon Castillo</li>
                        </ul>
                    </div>
                </div>
                {/* PMs Section */}
                <div className="team-section">
                    <h4>Support</h4>
                    <ul>
                        <li>Cristina Alemandi</li>
                        <li>Soledad Pereyra</li>
                        <li>Virginia Risso Patron</li>
                        <li>Mateo Sanchez</li>
                        <li>Sofía Agnolon</li>

                    </ul>
                </div>

                {/* PMs Section */}
                <div className="team-section">
                    <h4>Clients</h4>
                    <br />
                    <br />

               

                </div>
            </div>
            {/* Pie de página */}
            <footer className="studio-footer">
                <ContactFooter />
            </footer>
        </div>
    );
};

export default Studio;
