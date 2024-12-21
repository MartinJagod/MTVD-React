import React, { useState, useEffect } from 'react';
import './Proyectos.css';

function Proyectos({ onNavigate }) {
  const [imagenes, setImagenes] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const imagesPerRow = 7; // Número de imágenes por fila
  const apiKey = '46939622-ea27aebde81d6ef511de7d2fc'; // Reemplaza con tu clave de API de Pixabay

  useEffect(() => {
    // Llamada a la API de Pixabay para obtener imágenes de arquitectura
    fetch(`https://pixabay.com/api/?key=${apiKey}&q=arquitectura&image_type=photo&per_page=50`)
      .then(response => response.json())
      .then(data => setImagenes(data.hits))
      .catch(error => console.error('Error al obtener imágenes:', error));
  }, [apiKey]);

  const handleImageClick = (index) => {
    setSelectedIndex(index);
  };

  const getRandomOffset = () => {
    const percentage = (Math.random() * 20 - 10) / 100; // ±10%
    return 150 + 150 * percentage;
  };

  const getDirection = (index) => {
    if (selectedIndex === null) return null;

    const topLeft = selectedIndex - imagesPerRow - 1;
    const top = selectedIndex - imagesPerRow;
    const topRight = selectedIndex - imagesPerRow + 1;
    const left = selectedIndex - 1;
    const right = selectedIndex + 1;
    const bottomLeft = selectedIndex + imagesPerRow - 1;
    const bottom = selectedIndex + imagesPerRow;
    const bottomRight = selectedIndex + imagesPerRow + 1;

    if (index === topLeft) return { direction: 'top-left', offsetX: -getRandomOffset(), offsetY: -getRandomOffset() };
    if (index === top) return { direction: 'top', offsetX: 0, offsetY: -getRandomOffset() };
    if (index === topRight) return { direction: 'top-right', offsetX: getRandomOffset(), offsetY: -getRandomOffset() };
    if (index === left) return { direction: 'left', offsetX: -getRandomOffset(), offsetY: 0 };
    if (index === right) return { direction: 'right', offsetX: getRandomOffset(), offsetY: 0 };
    if (index === bottomLeft) return { direction: 'bottom-left', offsetX: -getRandomOffset(), offsetY: getRandomOffset() };
    if (index === bottom) return { direction: 'bottom', offsetX: 0, offsetY: getRandomOffset() };
    if (index === bottomRight) return { direction: 'bottom-right', offsetX: getRandomOffset(), offsetY: getRandomOffset() };

    return null;
  };

  return (
    <div className="proyectos-container">
      <button onClick={() => onNavigate('Home')} className="back-button">
        Volver al Home
      </button>
      {imagenes.map((imagen, index) => {
        const direction = getDirection(index);
        const offsetX = direction ? direction.offsetX : 0;
        const offsetY = direction ? direction.offsetY : 0;

        return (
          <div
            key={index}
            className={`proyecto-wrapper 
              ${selectedIndex !== null && selectedIndex !== index && !direction ? 'dimmed' : ''} 
              ${selectedIndex === index ? 'selected' : ''} 
              ${direction ? 'surrounding' : ''}`}
            style={direction ? { transform: `translate(${offsetX}px, ${offsetY}px)` } : {}}
            onClick={() => handleImageClick(index)}
          >
            <img src={imagen.webformatURL} alt={imagen.tags} className="proyecto-imagen" />
            <div className="proyecto-info">
              <h3>Proyecto {index + 1}</h3>
              <p>Descripción del proyecto de arquitectura.</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Proyectos;
