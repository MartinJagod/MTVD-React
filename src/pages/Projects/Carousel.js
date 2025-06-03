import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./projectsHome.css";

const Carousel = ({ title, images, goToProject  }) => {
  const carouselRef = useRef(null);
  const isDragging = useRef(false);
  const startCoord = useRef(0);
  const scrollStart = useRef(0);
  const velocity = useRef(0);
  const animationFrame = useRef(null);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
const sectionCategory = title.toLowerCase();

  
   /* ─── helper: extrae categoría y proyecto ─── */
const getProjectName = (url) => {
  const match = url.match(/([^/]+)\.(jpe?g|png|webp)$/i);
  return match ? match[1] : null;                   // Ej. "Anik"
};


  useEffect(() => {
    if (!isDesktop || !carouselRef.current) return;
  
    const element = carouselRef.current;
    const totalDistance = 1000; // distancia total que queremos bajar en total
    const bounces = 3; // cantidad de rebotes (ida y vuelta)
    const stepDistance = totalDistance / bounces;
    const stepDuration = 300;
  
    let currentBounce = 0;
    let direction = 1; // 1: baja, -1: sube
  
    const animateBounce = () => {
      const start = element.scrollTop;
      const target = start + direction * stepDistance;
      const startTime = performance.now();
  
      const animateStep = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / stepDuration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        element.scrollTop = start + (target - start) * ease;
  
        if (progress < 1) {
          requestAnimationFrame(animateStep);
        } else {
          currentBounce += 1;
          direction *= -1;
  
          if (currentBounce < bounces * 2) {
            // Seguimos rebotando
            setTimeout(animateBounce, 50);
          } else {
            // 🚨 Último movimiento hacia abajo para frenar en posición final
            smoothScrollTo(element, element.scrollTop + stepDistance, 500);
          }
        }
      };
  
      requestAnimationFrame(animateStep);
    };
  
    animateBounce();
  }, [isDesktop]);
  
  
  const smoothScrollTo = (element, target, duration) => {
    const start = element.scrollTop;
    const change = target - start;
    const startTime = performance.now();
  
    const animateScroll = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      element.scrollTop = start + change * ease;
  
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };
  
    requestAnimationFrame(animateScroll);
  };
  
  
  // Escuchar resize
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseDown = (e) => {
    isDragging.current = true;
    startCoord.current = isDesktop
      ? e.pageY - carouselRef.current.offsetTop
      : e.pageX - carouselRef.current.offsetLeft;
    scrollStart.current = isDesktop
      ? carouselRef.current.scrollTop
      : carouselRef.current.scrollLeft;
    velocity.current = 0;
    if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const currentCoord = isDesktop
      ? e.pageY - carouselRef.current.offsetTop
      : e.pageX - carouselRef.current.offsetLeft;
    const walk = (currentCoord - startCoord.current) * 1.5;

    if (isDesktop) {
      carouselRef.current.scrollTop = scrollStart.current - walk;
    } else {
      carouselRef.current.scrollLeft = scrollStart.current - walk;
    }

    velocity.current = walk * 0.9;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    applyInertia();
  };

  const applyInertia = () => {
    if (Math.abs(velocity.current) < 0.5) return;

    if (isDesktop) {
      carouselRef.current.scrollTop -= velocity.current;
    } else {
      carouselRef.current.scrollLeft -= velocity.current;
    }

    velocity.current *= 0.95;
    animationFrame.current = requestAnimationFrame(applyInertia);
  };

 
  return (
    <div className="carousel-wrapper-projectsHome">
      <Link to={`/projects?section=${title}`}>
        <div className="section-input">{title}</div>
      </Link>

      <div
        ref={carouselRef}
        className="carousel-container-projectsHome"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {images.map((url, index) => {
      const proj = getProjectName(url);
      return (
        <div
          key={index}
          className="carousel-item-projectsHome"
          onClick={() => proj && goToProject(sectionCategory, proj)}
        >
          <img
            src={url}
            alt={`Imagen ${index + 1}`}
            className="carousel-image-projectsHome"
          />
          <p>{proj}</p>
        </div>
      );
    })}
      </div>
    </div>
  );
};

export default Carousel;
