import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import './ProjectsSection.css';
import Navbar from '../Parcial/Navbar';
import ContactFooter from '../Parcial/ContactFooter';
import home1 from '../../assets/images/home1.jpg';
import home2 from '../../assets/images/home2.jpg';
import interiorismo1 from '../../assets/images/Felicity.jpeg';
import interiorismo2 from '../../assets/images/Hoppiness.jpg';
import interiorismo3 from '../../assets/images/interiorismo3.jpg';
import edward from '../../assets/images/edward.png';
import branding1 from '../../assets/images/COC.png';
import { CiTextAlignCenter } from 'react-icons/ci';

function ProjectsSection() {
    const [searchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('All');
    const sections = ['Design', 'Architecture', 'Branding'];
    const [section, setSection] = useState('Design'); 
    const navigate = useNavigate();
    
    // Animación de menú
    const [showInput, setShowInput] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

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

    function getFileName(filePath) {
        const fullName = filePath.split('/').pop();
        return fullName.split('.')[0];
    }

    const subcategories = {
        Design: ['Retail', 'Restaurant', 'Office', 'Hotel', 'Mixeduse', 'Mall'],
        Architecture: ['Commercial', 'Office', 'Hotel', 'MixedUse', 'Residential', 'Planning'],
        Branding: ['Design', 'Architecture'],
    };

    // Controla el Navbar deslizante
    const [isSliding, setIsSliding] = useState(false);
    let activityTimeout = null;

    useEffect(() => {
        const handleUserActivity = () => {
            setIsSliding(false);
            if (activityTimeout) clearTimeout(activityTimeout);
            activityTimeout = setTimeout(() => {
                if (!menuOpen && !showInput) setIsSliding(false);
            }, 20000);
        };

        window.addEventListener('mousemove', handleUserActivity);
        window.addEventListener('scroll', handleUserActivity);
        window.addEventListener('click', handleUserActivity);

        return () => {
            window.removeEventListener('mousemove', handleUserActivity);
            window.removeEventListener('scroll', handleUserActivity);
            window.removeEventListener('click', handleUserActivity);
            if (activityTimeout) clearTimeout(activityTimeout);
        };
    }, [menuOpen, showInput]);

    const images = {
        Design: [home1, home2, interiorismo1],
        Architecture: [interiorismo2, interiorismo3, edward],
        Branding: [branding1],
    };

    // Sincronizar sección con los parámetros de URL
    useEffect(() => {
        const sectionFromUrl = searchParams.get('section');
        if (sectionFromUrl && sections.includes(sectionFromUrl)) {
            setSection(sectionFromUrl);
        }
    }, [searchParams]);

    // Actualizar `filteredImages` cuando cambia `section`
    const [filteredImages, setFilteredImages] = useState(images[section] || []);

    useEffect(() => {
        console.log("Sección actualizada:", section);
        setFilteredImages(images[section] || []);
    }, [section]);

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="projects-section">
            {/* Header */}
            <header className="projects-header">
                <div className="logo">
                    <Navbar
                        isSliding={isSliding}
                        menuOpen={menuOpen}
                        setMenuOpen={setMenuOpen}
                        showInput={showInput}
                        setShowInput={setShowInput}
                    />
                </div>
            </header>

            {/* Section Selector */}
            <div className="section-selector" style={{ marginTop: '50px' }}>
                <select style={{textAlign: "center"}}
                    className="section-input-section"
                    value={section}
                    onChange={(e) => {
                        console.log("Nuevo valor seleccionado:", e.target.value);
                        setSection(e.target.value);
                    }}
                >
                    {sections.map((sec, index) => (
                        <option key={index} value={sec}>
                            {sec}
                        </option>
                    ))}
                </select>

                <Link to="/projectsHome" className="filter-selector">
                    All
                </Link>
            </div>

            {/* Subcategories */}
            <div className="subcategories">
                {subcategories[section]?.map((subcategory, index) => (
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
                        <div className="image-wrapper" key={index}>
                            <img src={image} alt={`Project ${index + 1}`} className="project-image" />
                            <div className="image-label-section">{getFileName(image)}</div>
                        </div>
                    ))}
                </div>
                <div className="column">
                    {filteredImages.filter((_, index) => index % 2 !== 0).map((image, index) => (
                        <div className="image-wrapper" key={index}>
                            <img src={image} alt={`Project ${index + 1}`} className="project-image" />
                            <div className="image-label-section">{getFileName(image)}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Logo Slogan */}
            <div style={{ marginTop: '50px' }}>
                <br />
                <br />
                <ContactFooter />
            </div>
        </div>
    );
}

export default ProjectsSection;
