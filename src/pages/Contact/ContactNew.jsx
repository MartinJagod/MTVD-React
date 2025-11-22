import React, { useEffect, useState, useRef, useCallback, useContext, useMemo } from 'react';
import { LanguageContext } from '../../context/LanguageContext';
import { useParams } from "react-router-dom";
import projectsData from './projectsData';
import projectsDataES from './projectsDataES';
import { useNavigate } from "react-router-dom";

import ProjectPopup from "./ProjectPopup";
import { getIdByProjectName } from './projectUtils';
import './Project.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { importImages } from "./importImages"; // 🔹 Importamos la función
import { importImagesProject } from "./importImagesProject";
import starImage from '../../assets/images/estrella.png';
import ContactFooter from '../Parcial/ContactFooter'; // Ajusta la ruta según tu estructura de carpetas
import Navbar from '../Parcial/Navbar'; // Ajusta la ruta según tu estructura de carpetas
import ContactFooterDesktop from '../Parcial/ContactFooterDesktop'; // Ajusta la ruta según tu estructura de carpetas

/* rango → categoría */
const getCategoryById = id =>
    id <= 5000 ? 'design'
        : id <= 8000 ? 'architecture'
            : 'branding';

function ContactNew() {
   
    return (
        <div className="projects-general">
            <div id="overlay-blur" className={modalOpen ? 'active' : ''}></div>


            {/* Imagen  de fondo */}
            <header className="projet-header">
             
                <div className="full-square-primero-foto">
                    <div className='primer-foto'>
                        {isVideo(principalMedia) ? (
                            <video
                                src={principalMedia}
                                className="parallax-image-project "
                                autoPlay
                                muted
                                loop
                                playsInline
                                onClick={() => openPopup(principalMedia)}
                            />
                        ) : (
                            <img
                                src={principalMedia}
                                alt="Principal"
                                className='primer-foto parallax-image-project-primera  '
                                /* ref={brandingImageRef}  */
                                onLoad={e => markHorizontal(e.target)}
                                onClick={() => openPopup(principalMedia)}
                            />
                        )}
                    </div>

                    <div className="image-label-star">
                        <img src={starImage} alt="Star" className="star-image-foto" />
                    </div>
                </div>
                <Navbar
                    isSliding={isSliding}
                    menuOpen={menuOpen}
                    setMenuOpen={setMenuOpen}
                    showInput={showInput}
                    searchData={searchIndex}
                    onSelect={handleSelectProject}
                    setShowInput={setShowInput} />

            </header>

            {/* Inicio frase  */}
            <div className="phrase-section">
                <span className="phrase-line">{projectData.nombreproyecto}</span>
            </div>

            {/* fin frase  */}



            <section className="image-and-quadrants">
                <div className="quadrant-container">
                    <div className='container-image-small-projet' >
                        <img
                            src={images.miniatura1[imageName]}
                            alt="Miniatura 1"
                            /*  ref={interiorismoImageRef} */
                            className='image-small-projet'
                            onClick={() => openPopup(images.miniatura1[imageName])}
                        />
                    </div>

                    <div className="quadrant-project white-box-project">
                        <span className="project-box-project">{projectData.frase1}</span>
                        <div className="moving-line1-project" ref={line1Ref} ></div>
                    </div>
                    <div className="quadrant-project white-box-project"  >
                        <span className="project-box-project" >{projectData.frase2}</span>
                    </div>
                    <div className="quadrant-project green-box-project" ref={counterRef}>
                        <span className="project-count-project">{projectCount}</span>
                        <span className="project-label-project">{projectData.nombre1}</span>
                        <div className="moving-line2-project" ref={line2Ref}></div>
                    </div>
                </div>

                <div className="full-square">
                    <div className="parallax-wrapper">
                        <img
                            src={images.proyecto2[imageName]}
                            alt="proyecto f2"
                            className="parallax-image-project"
                            /* ref={arquitecturaImageRef} */
                            onLoad={e => markHorizontal(e.target)}
                            onClick={() => openPopup(images.proyecto2[imageName])}
                        />
                    </div>

                    <div className="image-label-star">
                        <img src={starImage} alt="Star" className="star-image-foto" />
                    </div>
                </div>
                <div className="horizontal-double-team">
                    <div className="quadrant-project yellow-box-project" ref={sectionCounters2Ref} style={{ width: '50vw' }}>
                        <span className="project-count-project">{yearsCount}</span>
                        <span className="project-label-project2">{projectData.nombre2}</span>
                    </div>
                    <div className="quadrant-project white-box-project" style={{ width: '50vw', backgroundOpacity: "0.1" }}>
                        <span className="project-label-small">Location</span>
                        <span className="project-label-normal" style={{ marginBottom: "10px" }}>{projectData.location}</span>

                        <span className="project-label-small">Year</span>
                        <span className="project-label-normal" style={{ marginBottom: "10px" }}>{projectData.contador1}</span>

                        <span className="project-label-small">Area</span>
                        <span className="project-label-normal">{projectData.contador2 + " " + projectData.nombre2}</span>
                        <div className="moving-line3" ref={line3Ref} data-animation="moveLine3"></div>
                    </div>
                </div>


                <div className="full-square">
                    <div className="parallax-wrapper">
                        <img
                            src={images.proyecto3[imageName]}
                            alt="Proyecto f3"
                            className="parallax-image-project"
                            /* ref={brandingImageRef} */
                            onLoad={e => markHorizontal(e.target)}
                            onClick={() => openPopup(images.proyecto3[imageName])}
                        />
                    </div>

                    <div className="image-label-star">
                        <img src={starImage} alt="Star" className="star-image-foto" />
                    </div>
                </div>
                <div className="quadrant-container">
                    {/*  <div className="vertical-half-square">
                        <div className="half-parallax-wrapper">
                            <img
                                src={imagesPrincipal.proyecto4[imageName]}
                                alt="Interiorismo 1"
                                className="half-parallax-image"
                                ref={interiorismoImageRef}
                                onClick={() => openPopup(imagesPrincipal.proyecto4[imageName])}
                            />
                        </div>

                        <div className="image-label-star">
                            <img src={starImage} alt="Star" className="star-image-foto" />
                        </div>
                    </div> */}
                    <div className="quadrant-project blue-box-project" ref={sectionCountersRef} style={{ width: '50vw' }}>
                        <span className="project-box-frase">{getCountry(projectData.location)}</span>
                    </div>
                    <div className='container-image-small-projet' >
                        <img
                            src={images.miniatura2[imageName]}
                            alt="Miniatura 2"
                            className='image-small-projet'
                            onClick={() => openPopup(images.miniatura2[imageName])}
                        />
                    </div>
                    <div className='container-image-small-projet' >
                        <img
                            src={images.proyecto4[imageName]}
                            alt="Proyecto f4"
                            className='image-small-projet'
                            onClick={() => openPopup(images.miniatura2[imageName])}
                        />
                    </div>
                    <div className="quadrant"  >
                        <span className="project-box-frase"> {projectData.frase3}</span>

                        <div className="moving-line5" ref={line5Ref} data-animation="moveLine5"> </div>

                    </div>
                </div>
                {/* Texto después de las imágenes */}
                <div className="project-text" >
                    <p className="project-title">{projectData.encabezado}</p>

                    <br />
                    <br />
                    <br />

                    <p className=" project-paragraph">
                        {projectData.parrafo1}
                    </p>

                    <p className=" project-paragraph">
                        {projectData.parrafo2}
                    </p>
                </div>
                <ProjectPopup
                    isOpen={modalOpen}
                    onClose={closePopup}
                    initialImage={selectedImage}
                    projectName={PhraseLineSelected}
                    category={category}
                />
            </section>
            <div className="button-container-clients mobile-hide">
                <ContactFooterDesktop />
            </div>
            <section className="content-section desktop-hide">
                <ContactFooter />
            </section>


        </div>
    );
}



export default ContactNew;
