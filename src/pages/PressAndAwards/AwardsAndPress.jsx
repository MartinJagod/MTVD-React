import React, { useEffect, useState, useRef, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Parcial/Navbar';
import './AwardsAndPress.css';
import { LanguageContext } from '../../context/LanguageContext';

import fondo from '../../assets/images/fondopressAwards.jpg'; // fondo parallax

// 📦  Datos
import { milestones, yearHighlights, yearHighlightsES } from '../../data/awardsData';


/* ─────────────── ➊ Generador de índice ─────────────── */
function buildSearchIndex(highlights) {
  const index = [];

  milestones.forEach(m => {
    /*  Título y año  */
    const base = { id: m.id };        // 🆕

    index.push({ ...base, label: `${m.title} (${m.year})` });
    index.push({ ...base, label: m.year });                       // 2015, 2022, etc.

    /*  Cada link: label + dominio  */
    m.links.forEach(link => {
      const domain = new URL(link.url).hostname.replace(/^www\./, '');

      index.push({ ...base, label: `${m.title} – ${link.label}` });
      index.push({ ...base, label: `${m.title} – ${domain}` });
      index.push({ ...base, label: link.label });
      index.push({ ...base, label: domain });
    });
  });

  /*  Año + highlight (“2023 – We open our Miami base”)  */
  Object.entries(highlights).forEach(([year, text]) =>
  index.push({ id: `year-${year}`, label: `${year} – ${text}` })
);

  // quitamos duplicados por label
  const seen = new Set();
  return index.filter(i => i.label && !seen.has(i.label) && seen.add(i.label));
}
const AwardsAndPress = () => {
  /* ---------- Parallax fondo ---------- */
  const backgroundRef = useRef(null);
  const timelineRef = useRef(null);
  const itemRefs = useRef({});
   const { lang } = useContext(LanguageContext);          // ✅ ahora dentro del componente
   const highlights = useMemo(
     () => (lang === "ES" ? yearHighlightsES : yearHighlights),
     [lang]
   );
useEffect(() => {
  const isMobile = window.innerWidth <= 768; // Ajustá si querés otro breakpoint
  const multiplier = isMobile ? 80 : 10;     // Más velocidad en mobile

  const handleScroll = () => {
    if (!timelineRef.current || !backgroundRef.current) return;
    const scrollX = timelineRef.current.scrollLeft;
    const maxScroll = timelineRef.current.scrollWidth - timelineRef.current.clientWidth;
    const move = ((scrollX / maxScroll) * multiplier) * (-1); 
    backgroundRef.current.style.transform = `translateX(${move}%)`;
  };

  const tl = timelineRef.current;
  tl?.addEventListener('scroll', handleScroll);
  return () => tl?.removeEventListener('scroll', handleScroll);
}, []);

  const PCT   = 0.8;       // 80 % del ancho visible
const MAX   = 1400;      // …pero nunca más de 1400 px (ajusta a tu gusto)

const getStep = el => Math.min(el.clientWidth * PCT, MAX);

const scrollBySafe = dir => {
  const el = timelineRef.current;
  if (!el) return;

  const delta   = getStep(el) * dir;                // dir = +1 / –1
  const maxLeft = el.scrollWidth - el.clientWidth;
  const target  = Math.max(0, Math.min(maxLeft, el.scrollLeft + delta));

  el.scrollTo({ left: target, behavior: 'smooth' });
};

const goPrevChunk = () => scrollBySafe(-1);
const goNextChunk = () => scrollBySafe(+1);

  /* ---------- Year counter ---------- */
  const YearCounter = ({ targetYear }) => {
    const elementRef = useRef(null);
    const intervalRef = useRef(null);
    /* const [year, setYear] = useState(1998);

    const clear = () => { clearInterval(intervalRef.current); intervalRef.current = null; };

    const reset = () => {
      clear();
      setYear(targetYear);
      intervalRef.current = setInterval(() => {
        setYear(prev => (prev < targetYear ? prev + 1 : (clear(), targetYear)));
      }, 20);
    };

    useEffect(() => {
      const obs = new IntersectionObserver(
        ([entry]) => (entry.isIntersecting ? reset() : clear()),
        { threshold: 0.5 }
      );
      if (elementRef.current) obs.observe(elementRef.current);
      return () => { obs.disconnect(); clear(); };
    }, []); */

    return <div ref={elementRef} className="timeline-hito-year">{targetYear}</div>;
  };

  /* ---------- Navbar helpers ---------- */
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [isSliding, setIsSliding] = useState(false);
  const getExtraOffset = () => (
    window.matchMedia('(min-width: 1400px)').matches   // breakpoint “mobile”
      ? 4500   // mobile / tablet
      : 0  // desktop
  );
  const scrollToMilestone = ({ id }) => {
    const container = timelineRef.current;
    const node = itemRefs.current[id];
    if (!container || !node) return;

    /* ----- coordenadas absolutas ---------- */
    const containerRect = container.getBoundingClientRect();
    const nodeRect = node.getBoundingClientRect();

    /* centro del hito, medido en coordenadas del documento */
    const nodeCenterDoc =
      nodeRect.left + nodeRect.width / 2;

    /* centro del viewport interno del contenedor */
    const containerLeftDoc = containerRect.left;
    const containerCenter = containerLeftDoc + container.clientWidth / 2;

    /* cuánto tenemos que desplazar el scroll  */
    const delta = nodeCenterDoc - containerCenter;
    const extraOffset = getExtraOffset();
    /* posición destino del scroll (actual + delta) */
    /* const targetLeft = container.scrollLeft + delta + 6300; */
    /* posición destino del scroll (actual + delta) */
    const targetLeft = container.scrollLeft + delta + extraOffset;
    container.scrollTo({ left: targetLeft, behavior: 'smooth' });
    setShowInput(false);
  };

  /* ---------- Rueda del mouse = scroll horizontal ---------- */
  useEffect(() => {
    const el = timelineRef.current;
    if (!el) return;

    const handleWheel = e => {
      // Solo cuando haya desplazamiento vertical;
      // el horizontal (deltaX) ya funciona nativo.
      if (e.deltaY === 0) return;

      e.preventDefault();                 // cancela el scroll vertical
      el.scrollLeft += e.deltaY * 5;          // mueve en X la misma cantidad
      //   └── ajusta el factor (+/-) si lo sientes muy rápido o lento
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);


  /* ---------- Autoscroll al final del timeline ---------- */
  const animateToEnd = () => {
    const container = timelineRef.current;
    const extra = 0;  // píxeles extra si quieres margen
    const maxLeft = container.scrollWidth - 100;
    console.log(`Max scroll width: ${maxLeft}px`);
    container.scrollTo({ left: maxLeft, behavior: 'smooth' });

    const start = container.scrollLeft;
    const distance = maxLeft;
    const duration = 860;
    const ease = t => 1 - Math.pow(1 - t, 3);

    let t0 = null;
    const step = ts => {
      t0 ??= ts;
      const p = Math.min((ts - t0) / duration, 1);
      container.scrollLeft = start + distance * ease(p);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  useEffect(() => {
    const container = timelineRef.current;
    if (!container) return;

    let lastWidth = container.scrollWidth;
    let stable = 0;
    const STABLE_N = 5;

    const ro = new ResizeObserver(() => {
      const w = container.scrollWidth;
      if (w === lastWidth) {
        if (++stable >= STABLE_N) {
          ro.disconnect();
          animateToEnd();
        }
      } else {
        lastWidth = w;
        stable = 0;
      }
    });
    ro.observe(container);

    // Fallback: si ya está todo listo desde el inicio, scroll al final
    const fallback = setTimeout(() => animateToEnd(), 100);

    return () => {
      clearTimeout(fallback);
      ro.disconnect();
    };
  }, []);


  /* ---------- Render helpers ---------- */
  const renderSections = (above, milestone) => (
    above ? (
      <>
        <div className="timeline-first-section">
          <p className="timeline-title-item">{milestone.title}</p>
        </div>
        <div className="timeline-second-section">
          <img src={milestone.image} alt={milestone.title} className="timeline-image" />
        </div>
        <div className="timeline-third-section">
          <ul className="timeline-links">
            {milestone.links.map(({ label, url }, i) => (
              <li key={i} className="timeline-link">
                <a href={url} target="_blank" rel="noopener noreferrer">{label}</a>
              </li>
            ))}
          </ul>
        </div>
      </>
    ) : (
      <>
        <div className="timeline-third-section">
          <ul className="timeline-links">
            {milestone.links.map(({ label, url }, i) => (
              <li key={i} className="timeline-link">
                <a href={url} target="_blank" rel="noopener noreferrer">{label}</a>
              </li>
            ))}
          </ul>
        </div>
        <div className="timeline-second-section">
          <img src={milestone.image} alt={milestone.title} className="timeline-image" />
        </div>
        <div className="timeline-first-section">
          <p className="timeline-title-item">{milestone.title}</p>
        </div>
      </>
    )
  );
const searchIndex = useMemo(() => buildSearchIndex(highlights), [highlights]);
  /* ---------- JSX ---------- */
  return (
    <div className="awards-and-press">
      <header className="projects-header">
        <Navbar
          isSliding={isSliding}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          showInput={showInput}
          setShowInput={setShowInput}
          page="AwardsAndPress"
          searchData={searchIndex}
          onSelect={scrollToMilestone}
        />
      </header>
      <div className="timeline-container">

        {/* Parallax background */}
        <div ref={backgroundRef} className="awards-and-press-background"
          style={{ backgroundImage: `url(${fondo})`, backgroundRepeat: 'repeat-x' }} />
        <div className="timeline-horizontal" ref={timelineRef}
          style={{ overflowX: 'auto', position: 'relative' }}>

          {/* Línea base */}
          <div className="timeline-start-circle"></div>
          <div className="timeline-line"></div>

          {/* Hitos */}
          {milestones.map((m, idx) => {
            const highlight = highlights[m.year];
            const isFirstOfYear = idx === milestones.findIndex(mm => mm.year === m.year);
            const above = idx % 2 === 0;

            return (
              <React.Fragment key={m.id}>
                {/* Encabezado de año + frase */}
                {isFirstOfYear && (
                  <div
                    ref={el => (itemRefs.current[`year-${m.year}`] = el)} // opcional
                    className={`timeline-hito fade-in ${above ? 'above' : 'above'}`}
                    style={{
                      height: 300,
                      textAlign: 'center',
                      transform: `translateY(${above ? 122 : 122}px)`,
                      animationDelay: ` 0.5s`
                    }}>
                    <YearCounter targetYear={+m.year} />
                    <div className="timeline-hito-phrase">{highlight}</div>
                  </div>
                )}

                {/* Hito */}
                <div
                  ref={el => (itemRefs.current[m.id] = el)}
                  className={`timeline-item fade-in ${above ? 'above' : 'below'}`}
                  style={{
                    transform: `translateY(${above ? -24 : 24}px)`,
                    animationDelay: `0.5s`
                  }}>
                  {renderSections(above, m)}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
  {/* Flecha ← */}
  <button
    className="timeline-flecha-nav timeline-flecha-nav--left"
    onClick={goPrevChunk}
    aria-label="Retroceder"
  >
    ‹
  </button>

  {/* Flecha → */}
  <button
    className="timeline-flecha-nav timeline-flecha-nav--right"
    onClick={goNextChunk}
    aria-label="Avanzar"
  >
    ›
  </button>
</div>

  );
};

export default AwardsAndPress;
