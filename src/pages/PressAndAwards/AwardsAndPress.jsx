import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Parcial/Navbar';
import './AwardsAndPress.css';

import fondo from '../../assets/images/fondopressAwards.jpg'; // fondo parallax

// 📦  Datos
import { milestones, yearHighlights } from '../../data/awardsData';

const AwardsAndPress = () => {
  /* ---------- Parallax fondo ---------- */
  const backgroundRef = useRef(null);
  const timelineRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!timelineRef.current || !backgroundRef.current) return;
      const scrollX = timelineRef.current.scrollLeft;
      const maxScroll = timelineRef.current.scrollWidth - timelineRef.current.clientWidth;
      const move = (scrollX / maxScroll) * 5;               // 0–5 %
      backgroundRef.current.style.transform = `translateX(${move}%)`;
    };

    const tl = timelineRef.current;
    tl?.addEventListener('scroll', handleScroll);
    return () => tl?.removeEventListener('scroll', handleScroll);
  }, []);

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

  /* ---------- Autoscroll al final del timeline ---------- */
  const animateToEnd = () => {
    const container = timelineRef.current;
    const extra = -24;  // píxeles extra si quieres margen
    const maxLeft = container.scrollWidth;
    container.scrollTo({ left: maxLeft, behavior: 'smooth' });

    const start = container.scrollLeft;
    const distance = maxLeft;
    const duration = 11500;
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
            const highlight = yearHighlights[m.year];
            const isFirstOfYear = idx === milestones.findIndex(mm => mm.year === m.year);
            const above = idx % 2 === 0;

            return (
              <React.Fragment key={m.id}>
                {/* Encabezado de año + frase */}
                {isFirstOfYear && (
                  <div className={`timeline-hito fade-in ${above ? 'above' : 'above'}`}
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
                <div className={`timeline-item fade-in ${above ? 'above' : 'below'}`}
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

    </div>
  );
};

export default AwardsAndPress;
