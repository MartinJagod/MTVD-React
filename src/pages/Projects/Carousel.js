import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./projectsHome.css"; // Asegúrate de que contenga los estilos necesarios

const Carousel = ({ title, images }) => {
  const carouselRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const velocity = useRef(0);
  const animationFrame = useRef(null);

  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - carouselRef.current.offsetLeft;
    scrollLeft.current = carouselRef.current.scrollLeft;
    velocity.current = 0; // Resetear velocidad
    if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5; // Ajusta sensibilidad
    carouselRef.current.scrollLeft = scrollLeft.current - walk;
    velocity.current = walk * 0.9; // Ajusta el efecto de inercia
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    applyInertia();
  };

  const applyInertia = () => {
    if (Math.abs(velocity.current) < 0.5) return;
    carouselRef.current.scrollLeft -= velocity.current;
    velocity.current *= 0.95; // Aplica fricción más fuerte
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
        {images.map((imageUrl, index) => (
          <div key={index} className="carousel-item-projectsHome">
            <img src={imageUrl} alt={`Imagen ${index + 1}`} className="carousel-image-projectsHome" />
            <p>
  {decodeURIComponent(imageUrl.split('/').pop().replace(/\.[^/.]+$/, '').replace(/\d+$/, ''))}
</p>

          </div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
