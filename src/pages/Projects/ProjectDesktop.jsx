import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { LanguageContext } from "../../context/LanguageContext";
import projectsData from "./projectsData";
import projectsDataES from "./projectsDataES";
import { getIdByProjectName } from "./projectUtils";
import { importImagesProject } from "./importImagesProject";
import ProjectPopup from "./ProjectPopup";
import Navbar from "../Parcial/Navbar";
import ContactFooterDesktop from "../Parcial/ContactFooterDesktop";
import starImage from "../../assets/images/estrella.png";
import "./ProjectDesktop.css";

/**
 * ProjectDesktop.jsx (DESKTOP ONLY)
 * ClassNames prefijados con «ProjDes-» para evitar colisiones.
 */

function ProjectDesktop() {
    /* ───── Context & Params ───── */
    const { category, projectName } = useParams();
    const { lang } = useContext(LanguageContext);

    /* ───── Dataset & Media ───── */
    const dataset = lang === "ES" ? projectsDataES : projectsData;
    const images = importImagesProject(category, projectName, true);
    const imageKey = `${projectName}.jpg`;
    const id = getIdByProjectName(projectName);
    const projectData = id ? dataset[id] ?? projectsData[id] : {};

    /* ───── UI State (Navbar & Modal) ───── */
    const [isSliding, setIsSliding] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [showInput, setShowInput] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState(null);

    /* ───── Navbar auto-hide logic ───── */
    useEffect(() => {
        let activityTimeout;
        const handleActivity = () => {
            setIsSliding(false);
            clearTimeout(activityTimeout);
            activityTimeout = setTimeout(() => {
                if (!menuOpen && !showInput) setIsSliding(true);
            }, 2000);
        };

        window.addEventListener("mousemove", handleActivity);
        window.addEventListener("scroll", handleActivity);
        window.addEventListener("click", handleActivity);
        return () => {
            window.removeEventListener("mousemove", handleActivity);
            window.removeEventListener("scroll", handleActivity);
            window.removeEventListener("click", handleActivity);
            clearTimeout(activityTimeout);
        };
    }, [menuOpen, showInput]);

    /* ───── Modal helpers ───── */
    const openPopup = (src) => {
        setSelectedMedia(src);
        setModalOpen(true);
    };
    const closePopup = () => {
        setModalOpen(false);
        setSelectedMedia(null);
    };

    useEffect(() => {
        document.body.classList.toggle("no-scroll", modalOpen);
        return () => document.body.classList.remove("no-scroll");
    }, [modalOpen]);

    const isVideo = (f) => /\.(mp4|webm|ogg)$/i.test(f);
    const heroMedia = images.principal?.[imageKey];

    /* ───── Render ───── */
    return (
        <div className="ProjDes-project">
            {/* Overlay Blur */}
            <div
                className={`ProjDes-overlay-blur ${modalOpen ? "active" : ""}`}
                onClick={closePopup}
            />

            {/* HERO + Navbar */}
            <header
                className="ProjDes-hero cursor-pointer relative"
                onClick={() => openPopup(heroMedia)}
            >
                {heroMedia && isVideo(heroMedia) ? (
                    <video
                        src={heroMedia}
                        autoPlay
                        loop
                        muted
                        playsInline
                        controls      // ⇠ temporal para depurar
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    >
                        Lo sentimos, tu navegador no soporta video HTML5.
                    </video>
                ) : (
                    <img src={heroMedia} alt={projectData.nombreproyecto || projectName} />
                )}
                <img src={starImage} alt="Estrella" className="ProjDes-star absolute w-12 h-12" />
                <Navbar
                    isSliding={isSliding}
                    menuOpen={menuOpen}
                    setMenuOpen={setMenuOpen}
                    showInput={showInput}
                    setShowInput={setShowInput}
                />
            </header>

            {/* GRID PRINCIPAL */}
            <section className="ProjDes-container">
                {/* MAIN */}
                <article className="ProjDes-main">
                    <h1 className="ProjDes-title">{projectData.nombreproyecto}</h1>

                    {/* Fila 64/33 (imagen + texto) FUERA del grid principal */}
                    {images.proyecto2?.[imageKey] && (
                        <section className="ProjDes-rowSplit" style={{ height: "33vw" }}>
                            <img
                                src={images.proyecto2[imageKey]}
                                alt="Split img"
                                className="ProjDes-rowSplit-img"
                                onClick={() => openPopup(images.proyecto2[imageKey])}
                            />
                            <div className="ProjDes-rowSplit-box">
                                <h2 className="ProjDes-rowSplit-text">{projectData.frase1}</h2>
                                <span className="ProjDes-rowSplit-dash" />
                            </div>
                        </section>
                    )}
                    {/* Fila 33/64 (cuadro verde + imagen) */}
                    {images.proyecto3?.[imageKey] && (
                        <div className="ProjDes-rowSplitRev" style={{ height: "33vw" }}>
                            <div className="ProjDes-rowSplitRev-box">
                                <span className="ProjDes-rowSplitRev-value">{projectData.contador1}</span>
                                <span className="ProjDes-rowSplitRev-label">Year</span>
                            </div>
                            <img
                                src={images.proyecto3[imageKey]}
                                alt="Imagen 3"
                                className="ProjDes-rowSplitRev-img"
                                onClick={() => openPopup(images.proyecto3[imageKey])}
                            />
                        </div>
                    )}

                    {/* Triple row 33/34/33 (imagen · texto · stats) */}
                    {images.proyecto4?.[imageKey] && (
                        <div className="ProjDes-rowTriple" style={{ height: "33vw" }}>
                            {/* 33vw imagen */}
                            <img
                                src={images.proyecto4[imageKey]}
                                alt="Imagen triple"
                                className="ProjDes-rowTriple-img"
                                onClick={() => openPopup(images.proyecto4[imageKey])}
                            />

                            {/* 34vw caja de texto */}
                            <div className="ProjDes-rowTriple-boxText">
                                <h2 className="ProjDes-rowTriple-text">
                                    {projectData.frase2 || "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euis"}
                                </h2>
                                <span className="ProjDes-rowTriple-dash" />
                            </div>

                            {/* 33vw stats amarilla */}
                            <div className="ProjDes-rowTriple-boxStats">
                                <span className="ProjDes-rowTriple-value">+{projectData.contador2}</span>
                                <span className="ProjDes-rowTriple-unit">ft²</span>
                            </div>
                        </div>
                    )}


                    {/* Fila completa 100% ancho x 33vw alto */}
                    {images.proyecto4?.[imageKey] && (
                        <div style={{ height: "33vw", width: "100vw", marginLeft: "calc(-50vw + 50%)" }}>
                            <img
                                src={images.proyecto4[imageKey]}
                                alt="Imagen full"
                                style={{ width: "100%", height: "100%", objectFit: "cover", cursor: "pointer" }}
                                onClick={() => openPopup(images.proyecto5[imageKey])}
                            />
                        </div>
                    )}

                    {/* Doble columna izquierda (2×33) + imagen 64×66 */}
                    {images.proyecto2?.[imageKey] && (
                        <div className="ProjDes-rowTall" style={{ height: "66vw", marginBottom: "60px" }}>
                            {/* Columna izquierda con dos cajas */}
                            <div className="ProjDes-rowTall-col">
                                <div className="ProjDes-rowTall-boxWhite">

                                    <div >
                                        <div>
                                            <h4>Location</h4>
                                            <p>{projectData.location}</p>
                                        </div>
                                        <div>
                                            <h4>Year</h4>
                                            <p>{projectData.contador1}</p>
                                        </div>
                                        <div>
                                            <h4>Area</h4>
                                            <p>
                                                {projectData.contador2} {projectData.nombre2}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="ProjDes-rowTall-boxOrange">
                                    <h2 className="ProjDes-rowTall-textWhite">{projectData.frase3}</h2>
                                </div>
                            </div>

                            {/* Imagen 64 × 66 vw */}
                            <img
                                src={images.proyecto2[imageKey]}
                                alt="Imagen alta"
                                className="ProjDes-rowTall-img"
                                onClick={() => openPopup(images.proyecto2[imageKey])}
                            />
                        </div>
                    )}



                    <div className="ProjDes-text">
                        <p>{projectData.parrafo1}</p>
                        <p>{projectData.parrafo2}</p>
                    </div>


                </article>

                {/* SIDEBAR */}
                <aside className="ProjDes-sidebar">
                    <div className="ProjDes-stats">
                        <span className="ProjDes-stats-value">{projectData.contador2}</span>
                        <span className="ProjDes-stats-label">{projectData.nombre2}</span>
                    </div>

                </aside>
            </section>

            {/* FOOTER DESKTOP */}
            <div className="ProjDes-footer">
                <ContactFooterDesktop />
            </div>

            {/* MODAL */}
            <ProjectPopup
                isOpen={modalOpen}
                onClose={closePopup}
                initialImage={selectedMedia}
                projectName={projectName}
                category={category}
            />
        </div>
    );
}

export default ProjectDesktop;
