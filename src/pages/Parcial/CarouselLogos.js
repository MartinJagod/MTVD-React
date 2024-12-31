import React, { useRef, useState, useEffect } from "react";
import "./CarouselLogos.css";

const CarouselLogos = ({ duplicatedLogos }) => {
  const trackRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false); // Manejo del estado del arrastre
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (trackRef.current && !isDragging) {
        trackRef.current.scrollLeft += 1; // Velocidad del desplazamiento automático
        if (trackRef.current.scrollLeft >= trackRef.current.scrollWidth / 2) {
          trackRef.current.scrollLeft = 0; // Reinicia el desplazamiento
        }
      }
    }, 10);

    return () => {
      clearInterval(interval); // Limpia el intervalo al desmontar
    };
  }, [isDragging]);

  const handleMouseDown = (e) => {
    if (!trackRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - trackRef.current.offsetLeft);
    setScrollLeft(trackRef.current.scrollLeft);
    trackRef.current.style.cursor = "grabbing";
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !trackRef.current) return;
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Ajusta la velocidad del desplazamiento manual
    trackRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    if (!trackRef.current) return;
    setIsDragging(false);
    trackRef.current.style.cursor = "grab";
  };

  const handleTouchStart = (e) => {
    if (!trackRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - trackRef.current.offsetLeft);
    setScrollLeft(trackRef.current.scrollLeft);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !trackRef.current) return;
    const x = e.touches[0].pageX - trackRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Ajusta la velocidad del desplazamiento manual
    trackRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (trackRef.current) {
        trackRef.current.scrollLeft = 0; // Reinicia la posición en caso de redimensionamiento
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="carousel-container">
      <div
        className="carousel-track"
        ref={trackRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {duplicatedLogos.map((logo, index) => (
          <div key={index} className="carousel-item">
            <img src={logo} alt={`Logo ${index}`} className="logo-image" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarouselLogos;
