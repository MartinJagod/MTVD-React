import React, { useState, useEffect, useRef, useContext } from "react";
import { LanguageContext } from "../../context/LanguageContext";
import Navbar from "../Parcial/Navbar";
import ContactFooter from "../Parcial/ContactFooter";
import ContactFooterDesktop from "../Parcial/ContactFooterDesktop";
import WorksMap from "./WorksMap";   // ajustá la ruta si es necesario
// ────────────────────────────────────────────────────────────
//  ASSETS
// ────────────────────────────────────────────────────────────
import studioVideo from "../../assets/images/Horizontal.mp4";
import studioNV from "../../assets/images/team.jpg";
import teamDesign from "../../assets/images/team2.jpeg";
import teamArch from "../../assets/images/team.jpeg";
import "./StudioNew.css";
import { projectsForMap, studioPoints } from "./projectsForMap";

// Logos clientes (carousel)
// eslint-disable-next-line global-require
// ────────────────────────────────────────────────────────────
//  COMPONENT
// ────────────────────────────────────────────────────────────
const StudioNew = () => {
/*   const projectsData = [
    { id: 1, city: "Madrid",   country: "España",  lat: 40.4168, lng: -3.7038, year: 2025 },
    { id: 2, city: "Córdoba",  country: "Argentina", lat: -31.4201, lng: -64.1888, year: 2024 },
    { id: 3, city: "Miami",    country: "USA",     lat: 25.7617, lng: -80.1918, year: 2023 },
    // …agregá el resto
  ]; */
  /* idioma */
  const { lang } = useContext(LanguageContext);
const mapData = [...studioPoints, ...projectsForMap]; // estudios (azul) + proyectos
  /* navbar state */
  const [showInput, setShowInput] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const refStudioNV = useRef(null);
  const refTeamDesign = useRef(null);
  const refTeamArch = useRef(null);

  /* hero video */
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  const enterFullScreen = async () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.requestFullscreen) await v.requestFullscreen();
    else if (v.webkitEnterFullScreen) v.webkitEnterFullScreen();
  };
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    const onLoaded = () => {
      if (v.duration > 4) v.currentTime = 4;
      v.play().catch(() => { });
    };
    v.addEventListener("loadedmetadata", onLoaded);
    return () => v.removeEventListener("loadedmetadata", onLoaded);
  }, []);

  /* parallax */
  useEffect(() => {
    const parallaxList = [
      { ref: refStudioNV, speed: 0.08 },
      { ref: refTeamDesign, speed: 0.10 },
      { ref: refTeamArch, speed: 0.10 },
    ];
    function onScroll() {
      parallaxList.forEach(({ ref, speed }) => {
        const img = ref.current;
        if (!img) return;
        const wrapper = img.parentNode;
        const rect = wrapper.getBoundingClientRect();
        const winH = window.innerHeight;
        if (rect.top < winH && rect.bottom > 0) {
          const translateY = (rect.top - winH / 2) * speed;
          img.style.transform = `translateY(${translateY}px)`;
        } else {
          img.style.transform = "translateY(0px)";
        }
      });
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* flecha */
  const arrowRef = useRef(null);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ isIntersecting, target }) => {
          target.classList.toggle("animate", isIntersecting);
        });
      },
      { threshold: 0.5 }
    );
    if (arrowRef.current) io.observe(arrowRef.current);
    return () => io.disconnect();
  }, []);

  /* textos I18N */
  const t = {
    slogan:
      lang === "ES"
        ? "Diseñamos espacios que cuentan historias e inspiran a la gente."
        : "We design spaces that tell stories and inspire people.",
    studioTitle: lang === "ES" ? "Somos Estudio Montevideo" : "We are Estudio Montevideo",
    teamDesign: lang === "ES" ? "Equipo de Diseño" : "Design Team",
    teamArch: lang === "ES" ? "Equipo de Arquitectura" : "Architecture Team",
    mapLegend1: lang === "ES" ? "Obras & proyectos" : "Works & projects",
    mapLegend2: lang === "ES" ? "Estudios & partners" : "Studios & partners",
    columns: {
      col1: lang === "ES" ? "Socios · PMs · Soporte" : "Founders · PMs · Support",
      col2: lang === "ES" ? "Diseño" : "Design",
      col3: lang === "ES" ? "Arquitectura" : "Architecture",
    },
  };
  const yellowRef = useRef(null);
  const [slideYellow, setSlideYellow] = useState(false);
  useEffect(() => {
    const io = new window.IntersectionObserver(
      (entries) => setSlideYellow(entries[0].isIntersecting),
      { threshold: 0.5 }
    );
    if (yellowRef.current) io.observe(yellowRef.current);
    return () => io.disconnect();
  }, []);
  const greenRef = useRef(null);
  const [slideGreen, setSlideGreen] = useState(false);

  useEffect(() => {
    const io = new window.IntersectionObserver(
      (entries) => setSlideGreen(entries[0].isIntersecting),
      { threshold: 0.5 }
    );
    if (greenRef.current) io.observe(greenRef.current);
    return () => io.disconnect();
  }, []);
  /* render */
  return (
    <div className="studio-new">
      {/* ── HERO ─────────────────────────────────────── */}
      <header className="studio-header-new">
        <video
          ref={videoRef}
          src={studioVideo}
          className="studio-hero-video"
          autoPlay
          muted
          loop
          playsInline
          onDoubleClick={enterFullScreen}
        />
        <button className="mute-button" onClick={toggleMute}>
          {isMuted ? "🔇" : "🔊"}
        </button>
        <button className="full-button" onClick={enterFullScreen}>⛶</button>
        <Navbar
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          showInput={showInput}
          setShowInput={setShowInput}
          page="StudioNew"
        />
        <div className="studio-slogan">
        </div>
      </header>

      {/* ── INTRO ────────────────────────────────────── */}
      <section className="studio-intro">
        <h2>{t.slogan}</h2>
        <p>
          {lang === 'ES' ?
            "Somos un equipo inquieto y curioso que diseñamos espacios únicos y memorables. Entendemos el diseño como un servicio comprendiendo las necesidades de nuestros clientes y usuarios, para crear proyectos disruptivos y cargados de significado e identidad, trascendiendo lo funcional."
            : "We are a passionate team dedicated to interior design with a distinct commercial focus. We provide personalized solutions with strong personalities that cater to the unique needs and preferences of each project. With over 10 years of experience, we've designed 350+ projects in 25+ cities around the world. Our pursuit of creating authentic and original spaces has earned us notable recognition and awards in architecture, interior design, and branding. We are here to inspire people to create exciting places."}

        </p>
      </section>
      <section className="studio-parallax-block">
        <div className="parallax-wrapper">
          <img
            ref={refStudioNV} // o el ref que corresponda
            src={studioNV}
            className="parallax-image"
            alt="Equipo"
          />
        </div>
      </section>


      <section className="studio-intro">

        <div className="text-block">
          <p>
            {lang === 'ES' ?
              "Nuestro enfoque cercano y amigable se basa en el compromiso y experiencia, nos permiten materializar sueños y propósitos, potenciar al cliente y transformar ideas en historias que inspiran y conectan."
              : "We believe in forging emotional connections with both our clients and among the spaces we design and their future users. We align our approach with the business objectives of each brand, fostering strategic collaboration, partnerships, and crowdsourcing to deliver comprehensive solutions based on collective wisdom."
            }
          </p>
        </div>
      </section>

      {/* ── TEAM DESIGN ──────────────────────────────── */}


      <section className="studio-parallax-block">
        <div className="parallax-wrapper">
          <img src={teamDesign} alt="TeamDesign" ref={refTeamDesign} className="parallax-image" />
        </div>
      </section>



      <div className="team-design-reveal" ref={yellowRef}>
        <div className={`yellow-reveal ${slideYellow ? "slide" : ""}`}>
        <h3 className="design-title">{t.teamDesign}</h3>
          {/* <img src={starImage} alt="Star" className="star-reveal" /> */}
        </div>
     <div className="team-column">
                        {/* <h4>{lang === 'ES' ? <>Equipo de<br />Diseño</> : <> Design <br /> Team</>}</h4> */}
                        <ul>
                            <li>Arch. Francisco Brandan</li>
                            <li>Arch. Valentina Cabrera</li>
                            <li>Arch. Lucía Ceballos</li>
                            <li>Arch. Christopher Crespi</li>
                            <li>Arch. Simón Fassi</li>
                            <li>Arch. Daniela Francisco</li>
                            <li>Arch. María Agustina Lopez</li>
                            <li>Arch. Pilar Perez</li>
                            <li>Arch. Camila Ripoll</li>
                            <li>Arch. Ignacio Sottini</li>

                        </ul>
                    </div>
      </div>

      {/* ── TEAM ARCH ───────────────────────────────── */}



      <section className="studio-parallax-block">
        <div className="parallax-wrapper">
          <img src={teamArch} alt="TeamArch" ref={refTeamArch} className="parallax-image2" />
        </div>
      </section>

   
    {/* Nuevo bloque verde independiente */}
<div className="team-arch-reveal" ref={greenRef}>
  <div className={`green-reveal ${slideGreen ? "slide-left" : ""}`}>
  <h3 className="design-title right">{t.teamArch}</h3>
{/*     <img src={starImage} alt="Star" className="star-reveal" /> */}
  </div>
<div className="team-column-Archi">
                        {/* <h4>{lang === 'ES' ? <>Equipo de<br />Arquitectura</> : <>Architecture <br /> Team</>}</h4> */}
                        <ul>
                            <li>Arch. Abril Accotto</li>
                            <li>Arch. Franco Alvite</li>
                            <li>Arch. David Andres</li>
                            <li>Arch. Lucas Benitez</li>
                            <li>Arch. Bautista Dalmasso</li>
                            <li>Arch. Rosario Depalo</li>
                            <li>Arch. Franco Ferrari</li>
                            <li>Arch. Agostina Giacosa</li>
                            <li>Arch. Julieta Luccaroni</li>
                            <li>Arch. Víctor Ocaranza</li>
                            <li>Arch. Federico Ponce</li>
                            <li>Arch. Amparo Rodriguez</li>
                            <li>Arch. Triana Scarpinello</li>

                        </ul>
                    </div>

</div>

{/* ── MAPA OBRAS ─────────────────────── */}
<section className="studio-map-section">
  <WorksMap projects={mapData} />
 {/*  <div className="legend">
    <span>● {t.mapLegend1}</span>
    <span>○ {t.mapLegend2}</span>
  </div> */}
</section>
    {/*   <section className="studio-map-block">
        <img src={worldMap} alt="map" className="map-image" />
        <div className="legend">
          <span>● {t.mapLegend1}</span>
          <span>○ {t.mapLegend2}</span>
        </div>
      </section> */}

     
          <div className="team-columns-wrapper">
  {/* <h2>{lang === 'ES' ? "Equipo" : "Team"}</h2> */}

  <div className="team-columns">
    <div className="team-column">
      <h4>{lang === 'ES' ? "Fundadores" : "Founders"}</h4>
      <ul>
        <li>Marco Ferrari / Arch. Co-founder</li>
        <li>Gabriela Jagodnik / Arch. Co-founder</li>
        <li>Ramiro Veiga / Arch. Co-founder</li>
      </ul>
    </div>

    <div className="team-column">
      <h4>PMs</h4>
      <ul>
        <li>Arch. Julieta Astorica</li>
        <li>Arch. Violeta Bonicatto</li>
        <li>Arch. Marco Ferrari / Co-founder</li>
        <li>Arch. Gustavo Macagno</li>
        <li>Arch. Ramiro Veiga / Co-founder</li>
      </ul>
    </div>

    <div className="team-column">
      <h4>{lang === 'ES' ? "Soporte" : "Support"}</h4>
      <ul>
        <li>Sofía Agnolon</li>
        <li>Cristina Alemandi</li>
        <li>Mariana Fedriani</li>
        <li>Sofía Jagodnik</li>
        <li>Soledad Pereyra</li>
        <li>Mateo Sanchez</li>
      </ul>
    </div>
  </div>
</div>

      <section className="studio-end-section">
        <div className="desktop-hide">
          <ContactFooterDesktop />
        </div>
        <div className="mobile-hide">
          <ContactFooter />
        </div>
      </section>
    </div>
  );
};

export default StudioNew;