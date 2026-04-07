import React, { useState, useEffect, useRef, useContext } from "react";
import { LanguageContext } from "../../context/LanguageContext";
import Navbar from "../Parcial/Navbar";
import ContactFooter from "../Parcial/ContactFooter";
import ContactFooterDesktop from "../Parcial/ContactFooterDesktop";
import WorksMap from "./WorksMap";
 
import studioVideo from "../../assets/images/Horizontal.mp4";
import teamDesign from "../../assets/images/team2.jpeg";
import teamArch from "../../assets/images/team.jpeg";
import Gabriela from "../../assets/images/Gabriela.jpg";
import Marco from "../../assets/images/Marco.jpg";
import Ramiro from "../../assets/images/Ramiro.jpg";
import "./StudioNew.css";
import { projectsForMap, studioPoints, COUNTRY_POINTS } from "./projectsForMap";
 import groupIcon from "../../assets/images/group.png";
const TeamIcon = ({ size = 24 }) => (
  <img
    src={groupIcon}
    alt="Team"
    width="100%"
    height="90%"
    style={{ display: "block" }}
  />
);
 
const totalCountries = COUNTRY_POINTS.length;
const useInView = (options = {}) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
 
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
 
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting !== undefined) {
          setIsVisible(entry.isIntersecting);
        }
      },
      {
        threshold: 0.60,
        ...options,
      }
    );
 
    observer.observe(node);
 
    return () => observer.disconnect();
  }, [options]);
 
  return [ref, isVisible];
};
 
const StudioNew = () => {
  const { lang } = useContext(LanguageContext);
 
  const [showInput, setShowInput] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
 
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
 
  const [aboutRef, aboutVisible] = useInView();
  const [designRef, designVisible] = useInView();
  const [archRef, archVisible] = useInView();
  const [mapRef, mapVisible] = useInView();
 
  const [activeMapLayer, setActiveMapLayer] = useState("cities");
 
  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !isMuted;
    setIsMuted(!isMuted);
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
      v.play().catch(() => { });
    };
    v.addEventListener("loadedmetadata", onLoaded);
    return () => v.removeEventListener("loadedmetadata", onLoaded);
  }, []);
 
  const t = {
    heroClaim:
      lang === "ES"
        ? "Creamos espacios que cuentan historias."
        : "We create spaces that tell stories.",
    aboutTitle:
      lang === "ES"
        ? "En MTVD entendemos el diseño como una forma de crear identidad y conexión con las personas."
        : "At MTVD, we understand design as a way to create identity and connect with people.",
    aboutBody1:
      lang === "ES"
        ? "Somos un equipo multidisciplinario que trabaja con intención, combinando técnica, emoción y artesanía para transformar ideas en experiencias reales."
        : "We are a multidisciplinary team that works with intention, combining technique, emotion, and craftsmanship to transform ideas into real experiences.",
    aboutBody2:
      lang === "ES"
        ? "Cada proyecto es un recorrido donde exploramos el contexto, interpretamos las necesidades y construimos espacios que expresan autenticidad."
        : "Each project is a journey where we explore the context, interpret needs, and build spaces that express authenticity.",
    aboutBody3:
      lang === "ES"
        ? "Creemos en el valor del detalle, en la colaboración con el cliente y en el movimiento constante como parte de nuestra evolución."
        : "We believe in the value of detail, in collaboration with the client, and in constant movement as part of our evolution.",
    aboutPill: lang === "ES" ? "Diseño\nArquitectura\nBranding" : "Design\nArchitecture\nBranding",
    designTeam: lang === "ES" ? "Equipo de\nDiseño" : "Design\nTeam",
    archTeam: lang === "ES" ? "Equipo de\nArquitectura" : "Architecture\nTeam",
    statsCities: lang === "ES" ? "ciudades" : "cities",
    statsCountries: lang === "ES" ? "países" : "countries",
    statsStudios: lang === "ES" ? "estudios" : "studios",
    ctaTop: lang === "ES" ? "mirá nuestros" : "check our",
    ctaPill: lang === "ES" ? "proyectos" : "projects",
  };
 
  const mapData = [...studioPoints, ...projectsForMap];
 
  return (
    <div className="studioNewPage">
      {/* 1) HERO */}
      <section className="hero">
        <div className="heroMedia">
          <video
            ref={videoRef}
            src={studioVideo}
            className="heroVideo"
            autoPlay
            muted
            loop
            playsInline
            onDoubleClick={enterFullScreen}
          />
          {/* 
          <Navbar
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            showInput={showInput}
            setShowInput={setShowInput}
            page="StudioNew"
          />
          */}
          <button className="heroBtn heroBtnMute" onClick={toggleMute}>
            {isMuted ? "🔇" : "🔊"}
          </button>
          <button className="heroBtn heroBtnFull" onClick={enterFullScreen}>
            ⛶
          </button>
        </div>
 
        <div className="heroFooter">
          <h1>{t.heroClaim}</h1>
        </div>
      </section>
 
      {/* 2) ABOUT */}
<section
  ref={aboutRef}
  className={`about motionSection ${aboutVisible ? "is-visible" : ""}`}
>
  <div className="aboutTop">
    <div className="aboutText motionUp">
      <p className="aboutLead">{t.aboutTitle}</p>
      <p>{t.aboutBody1}</p>
      <p>{t.aboutBody2}</p>
      <p>{t.aboutBody3}</p>
    </div>
 
    <div className="aboutPillBlock motionSlideRight">
      <div className="aboutPill">
        {t.aboutPill.split("\n").map((line, i) => (
          <span key={i} style={{ display: "block" }}>
            {line}
          </span>
        ))}
      </div>
    </div>
  </div>
 
  <div className="foundersRow">
    <div className="founderCard motionCard">
      <div className="founderPhoto">
        <img src={Marco} alt="Marco Ferrari" />
      </div>
      <div className="founderOverlay" />
      <div className="founderMeta">
        <div className="founderName">Marco Ferrari</div>
        <div className="founderRole">Co-Founder · Director</div>
        <div className="founderLinks">
          <span>LinkedIn</span>
          <span>Email</span>
        </div>
      </div>
    </div>
 
    <div className="founderCard motionCard">
      <div className="founderPhoto">
        <img src={Gabriela} alt="Gabriela Jagodnik" />
      </div>
      <div className="founderOverlay" />
      <div className="founderMeta">
        <div className="founderName">Gabriela Jagodnik</div>
        <div className="founderRole">Co-Founder · Director</div>
        <div className="founderLinks">
          <span>LinkedIn</span>
          <span>Email</span>
        </div>
      </div>
    </div>
 
    <div className="founderCard motionCard">
      <div className="founderPhoto">
        <img src={Ramiro} alt="Ramiro Veiga" />
      </div>
      <div className="founderOverlay" />
      <div className="founderMeta">
        <div className="founderName">Ramiro Veiga</div>
        <div className="founderRole">Co-Founder · Director</div>
        <div className="founderLinks">
          <span>LinkedIn</span>
          <span>Email</span>
        </div>
      </div>
    </div>
  </div>
</section>
 
      {/* 3) DESIGN TEAM */}
      <section
        ref={designRef}
        className={`team teamDesign motionSection ${designVisible ? "is-visible" : ""}`}
      >
        <aside className="teamSide teamSideBlue">
          <div className="teamSideInner">
            <div className="teamFlap">
              <div className="teamFlapFront">
                <h2 className="teamTitle">
                  {t.designTeam.split("\n").map((l, i) => (
                    <span key={i} style={{ display: "block" }}>{l}</span>
                  ))}
                </h2>
              </div>
              <div className="teamFlapBack">
                <div className="teamIcon"><TeamIcon /></div>
              </div>
            </div>
            <div className="teamBack" />
          </div>
        </aside>
 
        <div className="teamPhoto motionRevealPhoto" style={{ backgroundImage: `url(${teamDesign})` }} />
 
        <div className="teamLists motionRevealText">
          <div className="teamCol">
            <h3>Project Managers</h3>
            <ul>
              <li>Arch. Julieta Astorica</li>
              <li>Arch. Violeta Bonicatto</li>
            </ul>
            <h3>Art Director</h3>
            <ul>
              <li>Arch. Camila Ripoll</li>
            </ul>
            <h3>Coordinator</h3>
            <ul>
              <li>Arch. Pilar Perez</li>
              <li>Arch. Christopher Crespi</li>
            </ul>
          </div>
 
          <div className="teamCol">
            <h3>Project Leaders</h3>
            <ul>
              <li>Arch. Lucía Ceballos</li>
              <li>Arch. María Agustina Lopez</li>
              <li>Arch. Simón Fassi</li>
              <li>Arch. Sofía Samuni</li>
              <li>Arch. Francisco Brandan</li>
              <li>Arch. Ignacio Sottini</li>
              <li>Arch. Valentina Daniele</li>
              <li>Arch. Valentina Cabrera</li>
            </ul>
          </div>
        </div>
      </section>
 
      {/* 4) ARCH TEAM */}
      <section
        ref={archRef}
        className={`team teamArch motionSection ${archVisible ? "is-visible" : ""}`}
      >
        <div className="teamPhoto motionRevealPhoto" style={{ backgroundImage: `url(${teamArch})` }} />
 
        <div className="teamLists motionRevealText">
          <div className="teamCol">
            <h3>Project Managers</h3>
            <ul>
              <li>Arch. Gustavo Macagno</li>
            </ul>
            <h3>Coordinator</h3>
            <ul>
              <li>Arch. Agostina Giacosa</li>
            </ul>
            <h3>Project Leaders</h3>
            <ul>
              <li>Arch. Guadalupe Saavedra</li>
              <li>Arch. Amparo Rodriguez</li>
            </ul>
          </div>
 
          <div className="teamCol">
            <h3>Project Leaders</h3>
            <ul>
              <li>Arch. Franco Ferrari</li>
              <li>Arch. Triana Scarpinello</li>
              <li>Arch. Federico Ponce</li>
              <li>Arch. Abril Accotto</li>
              <li>Arch. Víctor Ocaranza</li>
              <li>Arch. Rosario Depalo</li>
              <li>Arch. Lucas Benitez</li>
              <li>Arch. Franco Alvite</li>
              <li>Arch. Agustín Acevedo</li>
            </ul>
          </div>
        </div>
 
        <aside className="teamSide teamSideGreen">
          <div className="teamSideInner">
            <div className="teamFlap">
              <div className="teamFlapFront">
                <h2 className="teamTitle">
                  {t.archTeam.split("\n").map((l, i) => (
                    <span key={i} style={{ display: "block" }}>{l}</span>
                  ))}
                </h2>
              </div>
              <div className="teamFlapBack">
                <div className="teamIcon"><TeamIcon /></div>
              </div>
            </div>
            <div className="teamBack" />
          </div>
        </aside>
      </section>
 
      {/* 5) MAP */}
      <section
        ref={mapRef}
        className={`map motionSection ${mapVisible ? "is-visible" : ""}`}
      >
        <div className="mapStats">
          <div
            className={`stat ${activeMapLayer === "cities" ? "is-active" : ""}`}
            onMouseEnter={() => setActiveMapLayer("cities")}
          >
            <div className="statValue">+25</div>
            <div className="statLabel">{t.statsCities}</div>
          </div>
 
          <div
            className={`stat ${activeMapLayer === "countries" ? "is-active" : ""}`}
            onMouseEnter={() => setActiveMapLayer("countries")}
          >
            <div className="statValue">+15</div>
            <div className="statLabel">{t.statsCountries}</div>
          </div>
 
          <div
            className={`stat ${activeMapLayer === "studios" ? "is-active" : ""}`}
            onMouseEnter={() => setActiveMapLayer("studios")}
          >
            <div className="statValue">4</div>
            <div className="statLabel">{t.statsStudios}</div>
          </div>
        </div>
 
        <div className="mapCanvas">
          <WorksMap
            projects={mapData}
            countryPoints={COUNTRY_POINTS}
            activeLayer={activeMapLayer}
          />
        </div>
      </section>
 
      {/* 6) CONTACT */}
      <section className="contact">
        <div className="contactTop">
          <div className="contactCta">
            <span>{t.ctaTop}</span>
            <span className="contactPill">{t.ctaPill}</span>
          </div>
          <div className="contactRule" />
        </div>
 
        <div className="contactBottom">
          <div className="desktop-hide">
            <ContactFooterDesktop />
          </div>
          {/* <div className="mobile-hide">
            <ContactFooter />
          </div> */}
        </div>
      </section>
    </div>
  );
};
 
export default StudioNew;