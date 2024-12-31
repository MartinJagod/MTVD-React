import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
import { Link } from 'react-router-dom';

function ProjectsSection() {
    const [searchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('All'); // Categoría seleccionada
    const [section, setSection] = useState('Design'); // Cambiar a 'Architecture' o 'Branding' según la sección
    const sections = ['Design', 'Architecture', 'Branding']; // Opciones disponibles
 //saca el nombre del archivo
 function getFileName(filePath) {
    const fullName = filePath.split('/').pop(); // Obtiene el último segmento de la ruta
    const nameWithoutExtension = fullName.split('.')[0]; // Extrae la parte antes del primer punto
    return nameWithoutExtension;
}
    const subcategories = {
        Design: ['Retail', 'Restaurant', 'Office', 'Hotel', 'Mixeduse', 'Residential'],
        Architecture: ['Commercial', 'Office', 'Hotel', 'MixedUse', 'Residential', 'Planning'],
        Branding: ['Design', 'Architecture'],
    };

    const images = {
        Design: [home1, home2, interiorismo1],
        Architecture: [interiorismo2, interiorismo3, edward],
        Branding: [branding1],
    };

    useEffect(() => {
        const sectionFromUrl = searchParams.get('section');
        if (sectionFromUrl && sections.includes(sectionFromUrl)) {
            setSection(sectionFromUrl);
        }
    }, [searchParams, sections]);

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredImages = images[section].filter((image, index) =>
        searchTerm === '' ? true : `Image ${index + 1}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="projects-section">
            {/* Header */}
            <header className="projects-header">
                <div className="logo">
                    <Navbar />
                </div>
            </header>

            {/* Section Selector */}
            <div className="section-selector" style={{ marginTop: '50px' }}>
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
                <Link to="/projectsHome" className="filter-selector">
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
                        <div className="image-wrapper">

                        <img
                            key={index}
                            src={image}
                            alt={`Project ${index + 1}`}
                            className="project-image"
                            />
                         <div className="image-label">
                            {getFileName(image)}
                        </div>
                            </div>
                    ))}
                </div>
                <div className="column">
                    {filteredImages.filter((_, index) => index % 2 !== 0).map((image, index) => (
                         <div className="image-wrapper">

                         <img
                             key={index}
                             src={image}
                             alt={`Project ${index + 1}`}
                             className="project-image"
                             />
                          <div className="image-label">
                             {getFileName(image)}
                         </div>
                             </div>
                    ))}
                </div>
            </div>

            {/* Logo Slogan */}
            <div style={{ marginTop: '50px' }}>
                <ContactFooter />
            </div>
        </div>
    );
}

export default ProjectsSection;
