import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import './ProjectsSection.css';
import Navbar from '../Parcial/Navbar';
import ContactFooter from '../Parcial/ContactFooter';

function ProjectsSection() {
    const [searchParams] = useSearchParams();
    const [category, setCategory] = useState('All');
    const sections = ['Design', 'Architecture', 'Branding'];
    const [section, setSection] = useState('Design'); 
    const navigate = useNavigate();
    const [filteredImages, setFilteredImages] = useState([]);

    // Estados para control del menú
    const [showInput, setShowInput] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [isSliding, setIsSliding] = useState(false);

    const goToProjects = () => {
        navigate("/projectsHome"); // Cambia a la ruta /projects
    };
    const goToProject = (id) => {
        navigate(`/project/${id}`); // Cambia a la ruta
    }
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

    const subcategories = {
        Design: ['Retail', 'Restaurant', 'Office', 'Hotel', 'Mixeduse', 'Mall'],
        Architecture: ['Commercial', 'Office', 'Hotel', 'MixedUse', 'Residential', 'Planning'],
        Branding: ['Design', 'Architecture'],
    };

    // Obtener sección de la URL
    useEffect(() => {
        const sectionFromUrl = searchParams.get('section');
        if (sectionFromUrl && sections.includes(sectionFromUrl)) {
            setSection(sectionFromUrl);
        }
    }, [searchParams]);

    // 🔹 Fetch de imágenes desde la API según la sección
    useEffect(() => {
        console.log("📡 Solicitando imágenes de la API para:", section);

        fetch("http://193.203.182.77:5000/api/projects-home")
            .then(response => response.json())
            .then(data => {
                console.log("✅ Datos recibidos:", data);

                // Verificamos que la categoría exista en la respuesta
                if (data[section.toLowerCase()]) {
                    setFilteredImages(data[section.toLowerCase()].hits);
                } else {
                    setFilteredImages([]);
                }
            })
            .catch(error => {
                console.error("❌ Error al obtener imágenes:", error);
                setFilteredImages([]);
            });
    }, [section]);

    const getFileName = (imageUrl) => {
        if (!imageUrl) return "";
        
        // Extraer el nombre del archivo
        let fileName = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
        
        // Decodificar caracteres como %20 → " "
        fileName = decodeURIComponent(fileName);
    
        // Eliminar la extensión del archivo
        let fileNameWithoutExtension = fileName.replace(/\.[^/.]+$/, "");
    
        // Eliminar números al final del nombre
        return fileNameWithoutExtension.replace(/\d+$/, "");
    };
    
    return (
        <div className="projects-section">
            {/* Header */}
            <header className="projects-header">
                <Navbar
                    isSliding={isSliding}
                    menuOpen={menuOpen}
                    setMenuOpen={setMenuOpen}
                    showInput={showInput}
                    setShowInput={setShowInput}
                />
            </header>

            {/* Section Selector */}
            <div className="section-selector">
                <select
                    className="section-input-section"
                    value={section}
                    onChange={(e) => {
                        setSection(e.target.value);
                    }}
                >
                    {sections.map((sec, index) => (
                        <option className='section-input-section-option'  key={index} value={sec}>
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
                   onClick={() => setCategory(category === subcategory ? '' : subcategory)}
               >
                   {subcategory}
               </button>
                ))}
            </div>

            {/* Image Grid */}
            <div className="image-grid">
                <div className="column-project">
                    {filteredImages.filter((_, index) => index % 2 === 0).map((image, index) => (
                        <div className="image-wrapper" key={index}>
                            <img src={image} alt={`Project ${index + 1}`} className="project-image" onClick={()=>{goToProject(1)}}/>
                            <div className="image-label-section">{getFileName(image)}</div>
                        </div>
                    ))}
                </div>
                <div className="column-project">
                    {filteredImages.filter((_, index) => index % 2 !== 0).map((image, index) => (
                        <div className="image-wrapper" key={index}>
                            <img src={image} alt={`Project ${index + 1}`} className="project-image" onClick={()=>{goToProject(2)}}/>
                            <div className="image-label-section">{getFileName(image)}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div style={{ marginTop: '50px' }}>
                <br />
                <br />
                <ContactFooter />
            </div>
        </div>
    );
}

export default ProjectsSection;
