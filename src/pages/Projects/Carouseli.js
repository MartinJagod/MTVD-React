import React, { useRef, useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import "./projectsHome.css";
import { LanguageContext } from "../../context/LanguageContext";

const TITLE_MAP = {
  design:       { EN: "Design",       ES: "Interiorismo" },
  architecture: { EN: "Architecture", ES: "Arquitectura" },
  branding:     { EN: "Brands",     ES: "Marcas" },
};
const formatName = (str) => str.replace(/([A-Z])/g, ' $1').trim();

const Carousel = ({ title, images, goToProject, category }) => {
  const { lang } = useContext(LanguageContext);

  const catKey       = category;          // slug fijo en inglés
  const displayTitle = title ?? TITLE_MAP[catKey]?.[lang] ;

  const carouselRef  = useRef(null);
  const isDragging   = useRef(false);
  const startCoord   = useRef(0);
  const scrollStart  = useRef(0);
  const velocity     = useRef(0);
  const animationRef = useRef(null);

  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  /* ---------- responsive toggle ---------- */
  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* ---------- drag handlers ---------- */
  const handleMouseDown = e => {
    isDragging.current = true;
    const el = carouselRef.current;
    startCoord.current = isDesktop
      ? e.pageY - el.offsetTop
      : e.pageX - el.offsetLeft;
    scrollStart.current = isDesktop ? el.scrollTop : el.scrollLeft;
    velocity.current = 0;
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  };

  const handleMouseMove = e => {
    if (!isDragging.current) return;
    e.preventDefault();
    const el = carouselRef.current;
    const currentCoord = isDesktop
      ? e.pageY - el.offsetTop
      : e.pageX - el.offsetLeft;
    const walk = (currentCoord - startCoord.current) * 1.5;

    if (isDesktop) el.scrollTop  = scrollStart.current - walk;
    else           el.scrollLeft = scrollStart.current - walk;

    velocity.current = walk * 0.9;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    applyInertia();
  };

  const applyInertia = () => {
    const el = carouselRef.current;
    if (Math.abs(velocity.current) < 0.5) return;

    if (isDesktop) el.scrollTop  -= velocity.current;
    else           el.scrollLeft -= velocity.current;

    velocity.current *= 0.95;
    animationRef.current = requestAnimationFrame(applyInertia);
  };
  let sectionTitle = "";
  if (isDesktop) {sectionTitle  =  ""}
    else         { sectionTitle  =  displayTitle;

  };

  /* ---------- render ---------- */
  return (
    <div className="carousel-wrapper-projectsHome">
      {/* slug en inglés para el filtro */}
      <Link to={`/projects?section=${catKey}`} className="section-link-projectsHome">
        <div className="section-input">{sectionTitle}</div>
      </Link>
      

      <div
        ref={carouselRef}
        className="carousel-container-projectsHome"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          overflowX: isDesktop ? "hidden" : "auto",
          overflowY: isDesktop ? "auto"   : "hidden",
        }}
      >
        {images.map((url, idx) => {
          const proj = url.match(/([^/]+)\.(jpe?g|png|webp)$/i)?.[1];
            const label = proj ? formatName(proj) : '';
          return (
            <div
              key={idx}
              className="carousel-item-projectsHome"
              onClick={() => proj && goToProject(catKey, proj)}
            >
              <img src={url} alt={`Imagen ${idx + 1}`} className="carousel-image-projectsHome" />
              <p>{label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Carousel;
