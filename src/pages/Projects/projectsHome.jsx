import React, { useState, useEffect } from 'react';
import './projectsHome.css';
import logoHorizontal from '../../assets/images/Logo-horizontal-negro.png';
import logoSlogan from '../../assets/images/logo-slogan.png';
import { FaSearch, FaLinkedin, FaPinterest, FaYoutube, FaInstagram } from 'react-icons/fa';
import { Link } from 'react-router-dom';


function ProjectsHome() {
    const [imagenesColumna1, setImagenesColumna1] = useState([]);
    const [imagenesColumna2, setImagenesColumna2] = useState([]);
    const [imagenesColumna3, setImagenesColumna3] = useState([]);

    const apiKey = '46939622-ea27aebde81d6ef511de7d2fc';
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('All'); // Categoría seleccionada
    const [section, setSection] = useState('Design'); // Cambiar a 'Architecture' o 'Branding' según la sección
    const sections = ['Design', 'Architecture', 'Branding']; // Opciones disponibles

    const subcategories = {
        Design: ['Retail', 'Restaurant', 'Office', 'Hotel', 'Mixeduse', 'Residential'],
        Architecture: ['Commercial', 'Office', 'Hotel', 'MixedUse', 'Residential', 'Planning'],
        Branding: ['Design', 'Architecture'],
    };
    
    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

   
    useEffect(() => {
        fetch(`https://pixabay.com/api/?key=${apiKey}&q=design&image_type=photo&per_page=15`)
            .then((response) => response.json())
            .then((data) => setImagenesColumna1(data.hits));

        fetch(`https://pixabay.com/api/?key=${apiKey}&q=architecture&image_type=photo&per_page=15`)
            .then((response) => response.json())
            .then((data) => setImagenesColumna2(data.hits));

        fetch(`https://pixabay.com/api/?key=${apiKey}&q=branding&image_type=photo&per_page=15`)
            .then((response) => response.json())
            .then((data) => setImagenesColumna3(data.hits));
    }, [apiKey]);

    return (
        <div className="projects-section">
            {/* Header */}
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


            {/* Carrusel de Design */}
            <div className="carousel-wrapper-projectsHome">
            <Link to="/projects"><div className="section-input">Design </div></Link>

                <div className="carousel-container-projectsHome">
                    {imagenesColumna1.map((imagen, index) => (
                        <div key={index} className="carousel-item-projectsHome">
                            <img
                                src={imagen.webformatURL}
                                alt={imagen.tags}
                                className="carousel-image-projectsHome"
                            />
                            <p>{imagen.tags}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Carrusel de Architecture */}
            <div className="carousel-wrapper-projectsHome">
            <Link to="/projects"><div className="section-input">Architecture </div></Link>
                <div className="carousel-container-projectsHome">
                    {imagenesColumna2.map((imagen, index) => (
                        <div key={index} className="carousel-item-projectsHome">
                            <img
                                src={imagen.webformatURL}
                                alt={imagen.tags}
                                className="carousel-image-projectsHome"
                            />
                            <p>{imagen.tags}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Carrusel de Branding */}
            <div className="carousel-wrapper-projectsHome">
            <Link to="/projects"><div className="section-input">Branding </div></Link>
                <div className="carousel-container-projectsHome">
                    {imagenesColumna3.map((imagen, index) => (
                        <div key={index} className="carousel-item-projectsHome">
                            <img
                                src={imagen.webformatURL}
                                alt={imagen.tags}
                                className="carousel-image-projectsHome"
                            />
                            <p>{imagen.tags}</p>
                        </div>
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

export default ProjectsHome;
