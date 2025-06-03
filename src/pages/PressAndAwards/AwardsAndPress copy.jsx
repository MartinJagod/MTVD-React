import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Parcial/Navbar';
import ContactFooter from '../Parcial/ContactFooter';
import './AwardsAndPress.css';

import fondo from '../../assets/images/fondopressAwards.jpg'; // fondo parallax

// 📦  Datos
import { milestones, yearHighlights } from '../../data/awardsData';

const AwardsAndPress = () => {
  /* ---------- Parallax fondo ---------- */
  const backgroundRef = useRef(null);
  const timelineRef   = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!timelineRef.current || !backgroundRef.current) return;
      const scrollX   = timelineRef.current.scrollLeft;
      const maxScroll = timelineRef.current.scrollWidth - timelineRef.current.clientWidth;
      const move      = (scrollX / maxScroll) * 5;               // 0–5 %
      backgroundRef.current.style.transform = `translateX(${move}%)`;
    };

    timelineRef.current?.addEventListener('scroll', handleScroll);
    return () => timelineRef.current?.removeEventListener('scroll', handleScroll);
  }, []);

  /* ---------- Year counter ---------- */
  const YearCounter = ({ targetYear }) => {
    const [year, setYear]  = useState(1998);
    const elementRef       = useRef(null);
    const intervalRef      = useRef(null);

    const clear = () => { clearInterval(intervalRef.current); intervalRef.current = null; };

    const reset = () => {
      clear();
      setYear(1998);
      intervalRef.current = setInterval(() => {
        setYear(prev => {
          if (prev < targetYear) return prev + 1;
          clear();
          return targetYear;
        });
      }, 20);
    };

    useEffect(() => {
      const obs = new IntersectionObserver(
        ([entry]) => entry.isIntersecting ? reset() : clear(),
        { threshold: 0.5 }
      );
      if (elementRef.current) obs.observe(elementRef.current);
      return () => { obs.disconnect(); clear(); };
    }, []);

    return <div ref={elementRef} className="timeline-hito-year">{year}</div>;
  };

  /* ---------- Navbar helpers ---------- */
  const navigate             = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [isSliding, setIsSliding] = useState(false);

  /* ---------- Auto‑scroll hasta el último hito ---------- */
  const lastMilestoneRef       = useRef(null);
  const [scrolledToLast, setScrolledToLast] = useState(false);

  useEffect(() => {
    if (scrolledToLast || !lastMilestoneRef.current || !timelineRef.current) return;

    const container   = timelineRef.current;
    const target      = lastMilestoneRef.current.offsetLeft;
    const start       = container.scrollLeft;
    const distance    = target - start;
    const duration    = 3000;
    let startTime     = null;

    const easeOutQuad = t => t * (2 - t);

    const anim = time => {
      startTime ??= time;
      const progress = Math.min((time - startTime) / duration, 1);
      container.scrollLeft = start + distance * easeOutQuad(progress);
      if (progress < 1) requestAnimationFrame(anim);
      else setScrolledToLast(true);
    };
    requestAnimationFrame(anim);
  }, [scrolledToLast]);

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
        <div className="timeline-horizontal" ref={timelineRef}
             style={{ overflowX: 'scroll', position: 'relative' }}>

          {/* Parallax background */}
          <div ref={backgroundRef} className="awards-and-press-background"
               style={{ backgroundImage: `url(${fondo})`, backgroundRepeat: 'repeat-x' }} />

          {/* Línea base */}
          <div className="timeline-start-circle"></div>
          <div className="timeline-line"></div>

          {/* Hitos */}
          {milestones.map((m, idx) => {
            const isLast             = idx === milestones.length - 1;
            const highlight           = yearHighlights[m.year];
            const isFirstOfYear       = idx === milestones.findIndex(mm => mm.year === m.year);
            const above              = idx % 2 === 0;

            return (
              <React.Fragment key={m.id}>
                {/* Encabezado de año + frase */}
                {isFirstOfYear && (
                  <div className={`timeline-hito fade-in ${above ? 'above' : 'below'}`}
                       ref={isLast ? lastMilestoneRef : null}
                       style={{
                         height: 300,
                         textAlign: 'center',
                         transform: `translateY(${above ? 80 : -45}px)`,
                         animationDelay: `${idx * 0.2}s`
                       }}>
                    {above && <YearCounter targetYear={+m.year} />}
                    <div className="timeline-hito-phrase">{highlight}</div>
                    {!above && <YearCounter targetYear={+m.year} />}
                  </div>
                )}

                {/* Hito */}
                <div className={`timeline-item fade-in ${above ? 'above' : 'below'}`}
                     style={{
                       transform: `translateY(${above ? -24 : 24}px)`,
                       animationDelay: `${idx * 0.1 + 0.3}s`
                     }}>
                  {renderSections(above, m)}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* (Opcional) Footer de contacto */}
      {/* <ContactFooter /> */}
    </div>
  );
};

export default AwardsAndPress;
