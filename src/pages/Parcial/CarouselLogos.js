import React, { useState, useEffect, useRef } from "react";
import "./CarouselLogos.css";

const CarouselLogos = ({ logos }) => {
  // Duplicamos los logos para asegurar un scroll infinito sin interrupciones
  const [logoList, setLogoList] = useState([...logos, ...logos, ...logos]);
  const trackRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const currentTranslate = useRef(0);
  const prevTranslate = useRef(0);
  const animationRef = useRef(null);
  const autoScrollRef = useRef(null);
  const logoWidth = useRef(0);
  
  // Función para detener el desplazamiento automático
  const stopAutoScroll = () => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
      autoScrollRef.current = null;
    }
  };
  
  // Función para iniciar el desplazamiento automático
  const startAutoScroll = () => {
    stopAutoScroll();
    autoScrollRef.current = setInterval(() => {
      if (!isDragging.current && trackRef.current) {
        currentTranslate.current -= 2; // Movimiento más suave
        prevTranslate.current = currentTranslate.current;
        applyTransform();
        checkBoundary();
      }
    }, 20); // Intervalo más corto para un movimiento más suave
  };
  
  // Aplicar transformación al track
  const applyTransform = () => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${currentTranslate.current}px)`;
    }
  };
  
  // Verificar y ajustar límites para scroll infinito
  const checkBoundary = () => {
    if (!trackRef.current) return;
    
    const logosSetWidth = logos.length * logoWidth.current;
    
    // Si nos hemos desplazado más allá del primer conjunto de logos
    if (Math.abs(currentTranslate.current) > logosSetWidth) {
      // Reset sin animación
      trackRef.current.style.transition = 'none';
      currentTranslate.current += logosSetWidth;
      prevTranslate.current = currentTranslate.current;
      applyTransform();
      // Forzar reflow - usando void para satisfacer el linter
      void trackRef.current.offsetHeight;
    }
    
    // Si nos hemos desplazado hacia atrás más allá del último conjunto
    if (currentTranslate.current > 0) {
      trackRef.current.style.transition = 'none';
      currentTranslate.current -= logosSetWidth;
      prevTranslate.current = currentTranslate.current;
      applyTransform();
      // Forzar reflow - usando void para satisfacer el linter
      void trackRef.current.offsetHeight;
    }
  };
  
  // Inicialización
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    
    // Obtener ancho de los elementos
    const calculateDimensions = () => {
      const firstItem = track.querySelector('.carousel-item');
      if (firstItem) {
        logoWidth.current = firstItem.offsetWidth + 20; // 20 para el gap
      }
    };
    
    calculateDimensions();
    
    // Recalcular dimensiones si cambia el tamaño de la ventana
    window.addEventListener('resize', calculateDimensions);
    
    // Iniciar desplazamiento automático
    startAutoScroll();
    
    // Limpieza
    return () => {
      stopAutoScroll();
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', calculateDimensions);
    };
  }, [logos.length]);
  
  // Animación durante el arrastre
  const animation = () => {
    applyTransform();
    if (isDragging.current) {
      animationRef.current = requestAnimationFrame(animation);
    }
  };
  
  // Manejadores de eventos de ratón
  const handleMouseDown = (e) => {
    e.preventDefault();
    isDragging.current = true;
    startX.current = e.clientX;
    prevTranslate.current = currentTranslate.current;
    
    if (trackRef.current) {
      trackRef.current.style.cursor = 'grabbing';
      trackRef.current.style.transition = 'none';
    }
    
    stopAutoScroll();
    cancelAnimationFrame(animationRef.current);
    animationRef.current = requestAnimationFrame(animation);
    
    console.log("Mouse down detected"); // Debug
  };
  
  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    
    const currentPosition = e.clientX;
    const diff = currentPosition - startX.current;
    currentTranslate.current = prevTranslate.current + diff;
    
    console.log("Mouse move: ", diff); // Debug
  };
  
  const handleMouseUp = () => {
    console.log("Mouse up detected"); // Debug
    finishDrag();
  };
  
  const handleMouseLeave = () => {
    if (isDragging.current) {
      finishDrag();
    }
  };
  
  // Manejadores de eventos táctiles
  const handleTouchStart = (e) => {
    // Nota: Eliminar preventDefault aquí para permitir el comportamiento táctil nativo
    isDragging.current = true;
    startX.current = e.touches[0].clientX;
    prevTranslate.current = currentTranslate.current;
    
    if (trackRef.current) {
      trackRef.current.style.transition = 'none';
    }
    
    stopAutoScroll();
    cancelAnimationFrame(animationRef.current);
    animationRef.current = requestAnimationFrame(animation);
    
    console.log("Touch start detected"); // Debug
  };
  
  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    
    const currentPosition = e.touches[0].clientX;
    const diff = currentPosition - startX.current;
    currentTranslate.current = prevTranslate.current + diff;
    
    console.log("Touch move: ", diff); // Debug
  };
  
  const handleTouchEnd = () => {
    console.log("Touch end detected"); // Debug
    finishDrag();
  };
  
  // Finalizar arrastre
  const finishDrag = () => {
    if (!isDragging.current) return;
    
    isDragging.current = false;
    cancelAnimationFrame(animationRef.current);
    
    if (trackRef.current) {
      trackRef.current.style.cursor = 'grab';
      trackRef.current.style.transition = 'transform 0.3s ease-out';
    }
    
    prevTranslate.current = currentTranslate.current;
    
    // Reiniciar desplazamiento automático después de un breve retraso
    setTimeout(() => {
      startAutoScroll();
    }, 500);
  };
  
  return (
    <div className="carousel-container">
      <div
        className="carousel-track"
        ref={trackRef}
        style={{ transform: `translateX(${currentTranslate.current}px)` }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
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