import React, { useState, useEffect } from 'react';

import Navbar from '../Parcial/Navbar';
import ContactFooter from '../Parcial/ContactFooter';
import './studio.css'; // Agrega estilos personalizados para esta vista
import equipo from '../../assets/images/equipo.jpg';
import socios from '../../assets/images/socios.jpg';
import interiorismo from '../../assets/images/interiorismo.jpg';
import arquitectura from '../../assets/images/arquitectura.jpg';
import support from '../../assets/images/support.jpg'; // Cambiado de administración a support
import pms from '../../assets/images/pms.jpg'; // Cambiado de marketing a pms
import CarouselLogos from "../Parcial/CarouselLogos";

const Studio = () => {
    //inicio headermover
    const [isSliding, setIsSliding] = useState(false); // Controla el deslizamiento del Navbar
    let activityTimeout = null;
    const [showInput, setShowInput] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
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

    const images = [
        { id: 'equipo', src: equipo, alt: 'Team' },
        { id: 'socios', src: socios, alt: 'Founders' },
        { id: 'pms', src: pms, alt: 'PMS' }, // Actualizado
        { id: 'interiorismo', src: interiorismo, alt: 'Design' },
        { id: 'arquitectura', src: arquitectura, alt: 'Architecture' },
        { id: 'support', src: support, alt: 'Support' }, // Actualizado
    ];

    const [selectedImage, setSelectedImage] = useState('equipo'); // Imagen inicial seleccionada

    return (
        <div className="studio-section">
            {/* Encabezado con Navbar */}
            <header className="studio-header">
                <Navbar
                    menuOpen={menuOpen}
                    setMenuOpen={setMenuOpen} // Se pasa correctamente como prop
                    showInput={showInput}
                    setShowInput={setShowInput}
                />
            </header>

            {/* Contenedor de imágenes del equipo */}
            <div className="studio-images" style={{ marginLeft: '10px', marginRight: '10px' }}>
                {images.map((image) => (
                    <div
                        key={image.id}
                        className={`studio-image ${selectedImage === image.id ? 'selected' : ''}`}
                        onClick={() => setSelectedImage(image.id)}
                        style={{
                            backgroundImage: `url(${image.src})`,
                            width: selectedImage === image.id ? '60vw' : '6vw',
                            height: '39vh',
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

                    <CarouselLogos duplicatedLogos={[...logos, ...logos]} />

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
