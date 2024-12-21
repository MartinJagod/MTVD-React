import React, { useState } from 'react';
import './ProjectsSection.css';
import logoHorizontal from '../../assets/images/Logo-horizontal-negro.png';
import logoSlogan from '../../assets/images/logo-slogan.png';
import home1 from '../../assets/images/home1.jpg';
import home2 from '../../assets/images/home2.jpg';
import interiorismo1 from '../../assets/images/Felicity.jpeg';

import interiorismo2 from '../../assets/images/Hoppiness.jpg';
import interiorismo3 from '../../assets/images/interiorismo3.jpg';
import edward from '../../assets/images/edward.png';
import branding1 from '../../assets/images/COC.png';
import { FaSearch, FaLinkedin, FaPinterest, FaYoutube, FaInstagram } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function ProjectsSection() {
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('All'); // Categoría seleccionada
    const [section, setSection] = useState('Design'); // Cambiar a 'Architecture' o 'Branding' según la sección
    const sections = ['Design', 'Architecture', 'Branding']; // Opciones disponibles

    const subcategories = {
        Design: ['Retail', 'Restaurant', 'Office', 'Hotel', 'Mixeduse', 'Residential'],
        Architecture: ['Commercial', 'Office', 'Hotel', 'MixedUse', 'Residential', 'Planning'],
        Branding: ['Design', 'Architecture'],
    };

    const images = [
        home1,
        home2,
        interiorismo1,
        interiorismo2,
        interiorismo3,
        edward,
        branding1,
    ];

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredImages = images.filter((image, index) =>
        searchTerm === '' ? true : `Image ${index + 1}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="projects-section">
            {/* Header */}
            <header className="projects-header">
                <div>
                    <Link to="/">
                        <img src={logoHorizontal} alt="Logo Horizontal" className="logo-img" />
                    </Link>
                </div>
                <div className='navbar-projects'>

                    <div className="search-bar">
                        <FaSearch
                            style={{
                                position: 'absolute',
                                left: '58px',
                                top: '49%',
                                transform: 'translateY(-50%)',
                                color: '#bbb',
                            }}
                        />
                        <input
                            type="text"
                            className="search-input"
                            placeholder="" // El placeholder se deja vacío
                            value={searchTerm}
                            onChange={handleInputChange}
                        />
                    </div>
                    <span className="menu-icon-project">☰</span>
                </div>
            </header>

            {/* Section Selector */}
            <div className="section-selector">
                <select
                    className="section-input-section"
                    value={section}
                    onChange={(e) => setSection(e.target.value)} // Actualiza la sección seleccionada
                >
                    {sections.map((sec, index) => (
                        <option key={index} value={sec}>
                            {sec}
                        </option>
                    ))}
                </select>
                <Link to="/projectsHome"
                    className="filter-selector"
                >
                    All
                </Link>
            </div>

            {/* Subcategories */}
            <div className="subcategories">
                {subcategories[section].map((subcategory, index) => (
                    <button
                        key={index}
                        className={`subcategory-button ${subcategory === category ? 'active' : ''}`}
                        onClick={() => setCategory(subcategory)}
                    >
                        {subcategory}
                    </button>
                ))}
            </div>

            {/* Image Grid */}
            <div className="image-grid">
                <div className="column">
                    {filteredImages.filter((_, index) => index % 2 === 0).map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`Project ${index + 1}`}
                            className="project-image"
                        />
                    ))}
                </div>
                <div className="column">
                    {filteredImages.filter((_, index) => index % 2 !== 0).map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`Project ${index + 1}`}
                            className="project-image"
                        />
                    ))}
                </div>
            </div>

            {/* Logo Slogan */}
            <div className="contact-section">
                <img src={logoSlogan} alt="Logo Slogan" className="logo-slogan" />
                <div className="contact-details">
                    <p>
                        <strong>SPAIN</strong> <br /> contact@mtvd-design.com
                    </p>
                    <p>
                        <strong>USA</strong> <br /> contact@mtvd-design.com
                    </p>
                    <p>
                        <strong>ARGENTINA</strong> <br /> contact@mtvd-design.com
                    </p>
                </div>
                <div className="social-icons">
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
                <br>
                </br>
                <br>
                </br>
            </div>
        </div>
    );
}

export default ProjectsSection;
