import React, { useContext, useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
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


/* rango → categoría */
const getCategoryById = id =>
    id <= 5000 ? 'design'
: id <= 8000 ? 'architecture'
: 'branding';

function ProjectDesktop() {
    /* ───── Context & Params ───── */
    const { category, projectName } = useParams();
    const { lang } = useContext(LanguageContext);
    
    /* ───── Dataset & Media ───── */
    const SQFT_TO_SQM = 0.09290304;
    const dataset = lang === "ES" ? projectsDataES : projectsData;
    const images = importImagesProject(category, projectName, true);
    const imageKey = `${projectName}.jpg`;
    const id = getIdByProjectName(projectName);
    let projectData = id ? dataset[id] ?? projectsData[id] : {};
    if (lang === "ES" && projectData?.contador2) {
        projectData = {
            ...projectData,
            contador2: Math.round(projectData.contador2 * SQFT_TO_SQM),
            nombre2: "m²",
        };
    }
     
    /* ───── UI State (Navbar & Modal) ───── */
    const [isSliding, setIsSliding] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [showInput, setShowInput] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const navigate = useNavigate();
    const line1Ref = useRef(null);
    const line2Ref = useRef(null);
    const line3Ref = useRef(null);
    const line4Ref = useRef(null);
    const line5Ref = useRef(null);
    const line6Ref = useRef(null);


    /* ---------- estado ---------- */
    const [counter1, setCounter1] = useState(0);   //  ➜ muestra projectData.contador1
    const [counter2, setCounter2] = useState(0);   //  ➜ muestra projectData.contador2

    const [hasCounted1, setHasCounted1] = useState(false);
    const [hasCounted2, setHasCounted2] = useState(false);

    /* ---------- refs ---------- */
    const counter1Ref = useRef(null);
    const counter2Ref = useRef(null);

    /* ---------- animador genérico ---------- */
    const animateCounter = useCallback((setter, target, duration) => {
        let count = 0;
        const frameTime = 16;              // ~60 fps
        const steps = duration / frameTime;
        const inc = target / steps;

        const id = setInterval(() => {
            count += inc;
            if (count >= target) {
                setter(target);                // número final exacto
                clearInterval(id);
            } else {
                setter(Math.ceil(count));
            }
        }, frameTime);
    }, []);

    /* ---------- observer ---------- */
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const { target, isIntersecting } = entry;

                    // -------- contador 1 --------
                    if (target === counter1Ref.current) {
                        if (isIntersecting && !hasCounted1) {
                            animateCounter(setCounter1, Number(projectData.contador1), 700);
                            setHasCounted1(true);
                        } else if (!isIntersecting) {
                            setCounter1(0);          // reinicia si sales de pantalla
                            setHasCounted1(false);
                        }
                    }

                    // -------- contador 2 --------
                    if (target === counter2Ref.current) {
                        if (isIntersecting && !hasCounted2) {
                            animateCounter(setCounter2, Number(projectData.contador2), 700);
                            setHasCounted2(true);
                        } else if (!isIntersecting) {
                            setCounter2(0);
                            setHasCounted2(false);
                        }
                    }
                });
            },
            { threshold: 0.5 }
        );

        if (counter1Ref.current) observer.observe(counter1Ref.current);
        if (counter2Ref.current) observer.observe(counter2Ref.current);

        return () => observer.disconnect();
    }, [animateCounter, projectData, hasCounted1, hasCounted2]);


    useEffect(() => {
        const restartAnimation = (element, animationClass) => {
            if (!element) return;
            element.style.animation = "none";
            void element.offsetWidth;
            element.style.animation = `${animationClass} 3s linear forwards`;
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    if (entry.target.classList.contains("moving-line1-PD")) {
                        restartAnimation(entry.target, "movePD-Line1");
                    } else if (entry.target.classList.contains("moving-line2-PD")) {
                        restartAnimation(entry.target, "movePD-Line2");
                    } else if (entry.target.classList.contains("moving-line3-PD")) {  // ← AGREGÁ ESTO
                        restartAnimation(entry.target, "movePD-Line3");             // ← AGREGÁ ESTO
                    }
                }
            });
        }, { threshold: 0.5 });

        if (line1Ref.current) observer.observe(line1Ref.current);
        if (line2Ref.current) observer.observe(line2Ref.current);
        if (line3Ref.current) observer.observe(line3Ref.current); // ← AGREGÁ ESTO

        return () => {
            if (line1Ref.current instanceof HTMLElement) observer.unobserve(line1Ref.current);
            if (line2Ref.current instanceof HTMLElement) observer.unobserve(line2Ref.current);
            if (line3Ref.current instanceof HTMLElement) observer.unobserve(line3Ref.current); // ← AGREGÁ ESTO

            observer.disconnect();
        };
    }, []);

    /* helpers */
    const buildIndex = (data) =>
        Object.entries(data).map(([idStr, p]) => {
            const id = Number(idStr);
            const category = getCategoryById(id);

            const fullText = [
                p.nombreproyecto,
                p.frase1, p.frase2, p.frase3,
                p.location,
                p.encabezado,
                p.parrafo1, p.parrafo2,
                p.nombre1, p.nombre2,
                p.contador1?.toString(),
                p.contador2?.toString()
            ]
                .filter(Boolean)
                .join(' | ')
                .normalize('NFD').replace(/\p{Diacritic}/gu, '')
                .toLowerCase();

            return { label: p.nombreproyecto, projectName: p.nombreproyecto, category, fullText };
        });
    /* ── índices globales, se calculan 1 vez ── */
    const searchIndexes = useMemo(() => ({
        EN: buildIndex(projectsData),
        ES: buildIndex(projectsDataES),
    }), []);

    /* índice que realmente vas a usar */
    const searchIndex = searchIndexes[lang === 'ES' ? 'ES' : 'EN'];

    const handleSelectProject = (item) => {
        const slug = encodeURIComponent(item.projectName.replace(/\s+/g, ''));
        navigate(`/project/${item.category}/${slug}`);
        setShowInput(false);
    };

    function useParallaxImages(imageRefs, speed = 0.1, scale = 1) {
        const handleParallax = useCallback(() => {
            imageRefs.current.forEach(({ el, factor }) => {
                if (!el) return;

                // ── Fallback: si no hay factor individual, usa speed ──
                const f = (factor ?? speed);

                const { top, bottom } = el.getBoundingClientRect();
                const winH = window.innerHeight;

                if (top < winH && bottom > 0) {
                    // OK dentro del viewport → parallax
                    const translateY = -((top - winH / 2) * f);
                    el.style.transform = `translateY(${translateY}px) scale(${scale})`;
                } else {
                    // Fuera de vista → queda estática, pero agrandada
                    el.style.transform = `translateY(0px) scale(${scale})`;
                }
            });
        }, [speed, scale]);

        useEffect(() => {
            handleParallax();                                            // ① primer disparo
            window.addEventListener('scroll', handleParallax, { passive: true }); // ② scroll
            return () => window.removeEventListener('scroll', handleParallax);   // ③ cleanup
        }, [handleParallax]);
    }




    /* ───── 2. Componente ───── */
    // Creamos refs individuales
    const project1Ref = useRef(null);
    const project2Ref = useRef(null);
    const project3Ref = useRef(null);
    const project4Ref = useRef(null);
    const project5Ref = useRef(null);
    const project6Ref = useRef(null);



    // Agrupamos en un ref contenedor para no disparar re-render
    const imagesRef = useRef([
        { el: null, factor: 0.1 },
        { el: null, factor: 0.1 },
        { el: null, factor: 0.1 },
        { el: null, factor: 0.1 },
        { el: null, factor: 0.1 },
        { el: null, factor: 0.1 }
    ]);

    // Vinculamos elementos DOM cuando se montan
    useEffect(() => {
        imagesRef.current[0].el = project1Ref.current;
        imagesRef.current[1].el = project2Ref.current;
        imagesRef.current[2].el = project3Ref.current;
        imagesRef.current[3].el = project4Ref.current;
        imagesRef.current[4].el = project5Ref.current;
        imagesRef.current[5].el = project6Ref.current;
    }, []);

    // Hook parallax
    /* useParallaxImages(imagesRef); */


    /* ───── Navbar auto-hide logic ───── */
    useEffect(() => {
        let activityTimeout;
        const handleActivity = () => {
            setIsSliding(false);
            clearTimeout(activityTimeout);
            activityTimeout = setTimeout(() => {
                if (!menuOpen && !showInput) setIsSliding(true);
            }, 1000);
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
            /* onClick={() => openPopup(heroMedia)} */
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
                    <img src={heroMedia} alt={projectData.nombreproyecto || projectName} onClick={() => openPopup(images.proyecto2[imageKey])} />
                )}
                <img src={starImage} alt="Estrella" onClick={() => openPopup(images.proyecto2[imageKey])} className="ProjDes-star absolute w-12 h-12 parallax-img--clickable" />
                <Navbar
                    isSliding={isSliding}
                    menuOpen={menuOpen}
                    setMenuOpen={setMenuOpen}
                    showInput={showInput}
                    searchData={searchIndex}
                    onSelect={handleSelectProject}
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
                        <section className="ProjDes-rowSplit " style={{ height: "33vw" }}>
                            <div className="ProjDes-parallax-wrapper"  >

                                <img
                                    src={images.proyecto2[imageKey]}
                                    alt="Split img"
                                    className=" parallax-img parallax-img--clickable"
                                    onClick={() => openPopup(images.proyecto2[imageKey])}
                                />
                            </div>
                            <div className="ProjDes-rowSplit-box">
                                <h2 className="ProjDes-rowSplit-text">{projectData.frase1}</h2>
                                {/* <span className="ProjDes-rowSplit-dash moving-line6" ref={line6Ref} /> */}
                                <div className="moving-line1-PD" ref={line1Ref}></div> {/* ← NUEVA LÍNEA */}
                            </div>
                        </section>
                    )}
                    {/* Fila 33/64 (cuadro verde + imagen) */}
                    {images.proyecto3?.[imageKey] && (
                        <div className="ProjDes-rowSplitRev parallax-wrapper" style={{ height: "33vw" }}>
                            <div className="ProjDes-rowSplitRev-box" ref={counter1Ref}>
                                <span className="ProjDes-rowSplitRev-value">{counter1}</span>
                                <span className="ProjDes-rowSplitRev-label">
                                    {projectData.nombre1}
                                </span>
                            </div>
                            <div className="ProjDes-parallax-wrapper"  >

                                <img
                                    ref={project3Ref}

                                    src={images.proyecto3[imageKey]}
                                    alt="Imagen 3"
                                    className="ProjDes-rowSplitRev-img parallax-img parallax-img--clickable"
                                    onClick={() => openPopup(images.proyecto3[imageKey])}
                                />
                            </div>
                        </div>
                    )}

                    {/* Triple row 33/34/33 (imagen · texto · stats) */}
                    {images.proyecto4?.[imageKey] && (
                        <div className="ProjDes-rowTriple parallax-wrapper" style={{ height: "33vw" }}>
                            {/* 33vw imagen */}
                            <div className="ProjDes-parallax-half-wrapper"  >

                                <img
                                    ref={project4Ref}

                                    src={images.miniatura2[imageKey]}
                                    alt="Imagen triple"
                                    className="ProjDes-rowTriple-img parallax-img parallax-img--clickable"
                                    onClick={() => openPopup(images.miniatura2[imageKey])}
                                />
                            </div>

                            {/* 34vw caja de texto */}
                            <div className="ProjDes-rowTriple-boxText">
                                <h2 className="ProjDes-rowTriple-text">
                                    {projectData.frase2 || "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euis"}
                                </h2>
                                <div className="ProjDes-rowTriple-dash moving-line2-PD" ref={line2Ref}></div>
                                {/* <span className="ProjDes-rowTriple-dash" /> */}
                            </div>

                            {/* 33vw stats amarilla */}
                            <div className="ProjDes-rowTriple-boxStats" ref={counter2Ref}>
                                <span className="ProjDes-rowTriple-value">+{counter2}</span>
                                <span className="ProjDes-rowTriple-unit">
                                    {projectData.nombre2}
                                </span>
                            </div>
                        </div>
                    )}


                    {/* Fila completa 100% ancho x 33vw alto */}
                    {images.proyecto4?.[imageKey] && (
                        <div className="parallax-wrapper" style={{ height: "33vw", width: "100vw", marginLeft: "calc(-50vw + 50%)" }}>
                            <img
                                ref={project5Ref}
                                src={images.proyecto4[imageKey]}
                                alt="Imagen full"
                                style={{ width: "100%", height: "100%", objectFit: "cover", cursor: "pointer" }}
                                onClick={() => openPopup(images.proyecto4[imageKey])}
                                className="parallax-img parallax-img--clickable"

                            />
                        </div>
                    )}

                    {/* Doble columna izquierda (2×33) + imagen 64×66 */}
                    {images.proyecto2?.[imageKey] && (
                        <div className="ProjDes-rowTall parallax-wrapper" style={{ height: "66vw", marginBottom: "60px" }}>
                            {/* Columna izquierda con dos cajas */}
                            <div className="ProjDes-rowTall-col">
                                <div className="ProjDes-rowTall-boxWhite">

                                    <div >
                                        <div>
                                            <h4 className="ProjDes-h4-location">{lang === 'ES' ? 'Ubicación' : 'Location'}</h4>
                                            <p className="ProjDes-h4-value">{projectData.location}</p>
                                        </div>
                                        <div>
                                            <h4 className="ProjDes-h4-location">{projectData.nombre1}</h4>
                                            <p className="ProjDes-h4-value">{projectData.contador1}</p>
                                        </div>
                                        <div>
                                            <h4 className="ProjDes-h4-location">Area</h4>
                                            <p className="ProjDes-h4-value">
                                                {projectData.contador2} {projectData.nombre2}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="ProjDes-rowTall-boxOrange">
                                    <h2 className="ProjDes-rowTall-textWhite">{projectData.frase3}</h2>
                                </div>
                            </div>
                            <div className="ProjDes-parallax-box-wrapper"  >

                                {/* Imagen 64 × 66 vw */}
                                <img
                                    ref={project6Ref}
                                    src={images.miniatura3[imageKey]}
                                    alt="Imagen alta"
                                    className="ProjDes-rowTall-img parallax-img parallax-img--clickable"
                                    onClick={() => openPopup(images.miniatura3[imageKey])}
                                />
                            </div>
                        </div>
                    )}

                    <div className="ProjDes-textCols">
                        <h2 className="ProjDes-textHeadline">{projectData.encabezado}</h2>
                        <div className="ProjDes-textColGrid">
                            <div className="ProjDes-colLeft">
                                <p>{projectData.parrafo1}</p>
                            </div>
                            <div className="ProjDes-colRight">
                                <p>{projectData.parrafo2}</p>
                            </div>
                        </div>
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
