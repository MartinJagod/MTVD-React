import React, { useState, useEffect, useRef } from "react";
import "./CarouselLogos.css";

const CarouselLogos = ({ logos }) => {
  const [logoList, setLogoList] = useState([...logos, ...logos]); // Duplicamos los logos para el scroll infinito
  const trackRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const autoScroll = useRef(null);

  useEffect(() => {
    startAutoScroll();
    return () => clearInterval(autoScroll.current);
  }, []);

  const startAutoScroll = () => {
    clearInterval(autoScroll.current);
    autoScroll.current = setInterval(() => {
      if (!isDragging.current) {
        moveLogos();
      }
    }, 2000); // Ajusta la velocidad del desplazamiento automático
  };

  const moveLogos = () => {
    if (trackRef.current) {
      trackRef.current.style.transition = "transform 0.5s ease-in-out";
      trackRef.current.style.transform = "translateX(-15vw)"; // Mueve el track

      setTimeout(() => {
        setLogoList((prev) => {
          const [first, ...rest] = prev;
          return [...rest, first]; // Mueve el primer logo al final
        });

        trackRef.current.style.transition = "none";
        trackRef.current.style.transform = "translateX(0)";
      }, 500); // Espera a que termine la animación antes de actualizar el array
    }
  };

  // 🖱️ Manejo del arrastre con mouse
  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - trackRef.current.offsetLeft;
    scrollLeft.current = trackRef.current.scrollLeft;
    trackRef.current.style.cursor = "grabbing";
    clearInterval(autoScroll.current);
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const moveX = e.pageX - startX.current;
    trackRef.current.scrollLeft = scrollLeft.current - moveX;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    trackRef.current.style.cursor = "grab";
    startAutoScroll();
  };

  // 📱 Manejo del arrastre táctil
  const handleTouchStart = (e) => {
    isDragging.current = true;
    startX.current = e.touches[0].pageX - trackRef.current.offsetLeft;
    scrollLeft.current = trackRef.current.scrollLeft;
    clearInterval(autoScroll.current);
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    const moveX = e.touches[0].pageX - startX.current;
    trackRef.current.scrollLeft = scrollLeft.current - moveX;
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    startAutoScroll();
  };

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
        {logoList.map((logo, index) => (
          <div key={index} className="carousel-item">
            <img src={logo} alt={`Logo ${index}`} className="logo-image" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarouselLogos;

