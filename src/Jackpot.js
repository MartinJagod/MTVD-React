import React, { useState, useEffect } from 'react';
import './Jackpot.css';

function Jackpot() {
  const [imagenesColumna1, setImagenesColumna1] = useState([]);
  const [imagenesColumna2, setImagenesColumna2] = useState([]);
  const [imagenesColumna3, setImagenesColumna3] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [overlayPosition, setOverlayPosition] = useState({ top: 0, left: 0 });
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const apiKey = '46939622-ea27aebde81d6ef511de7d2fc'; // Reemplaza con tu clave de API de Pixabay

  useEffect(() => {
    fetch(`https://pixabay.com/api/?key=${apiKey}&q=arquitectura&image_type=photo&per_page=45`)
      .then(response => response.json())
      .then(data => {
        const images = data.hits;
        setImagenesColumna1(images.slice(0, 15));
        setImagenesColumna2(images.slice(15, 30));
        setImagenesColumna3(images.slice(30, 45));
      })
      .catch(error => console.error('Error al obtener imágenes:', error));
  }, [apiKey]);

  const handleProjectClick = (colIndex, imgIndex, event) => {
    setOverlayPosition({ top: event.clientY, left: event.clientX });
    setSelectedProject({ colIndex, imgIndex });

    // Retrasar un poco el estado de visibilidad para permitir que el CSS tome la escala inicial
    setTimeout(() => setIsOverlayVisible(true), 10);
  };

  const closeOverlay = () => {
    setIsOverlayVisible(false);
    setTimeout(() => setSelectedProject(null), 2000); // Esperar la transición de cierre antes de limpiar el proyecto seleccionado
  };

  const handleScroll = (e) => {
    const target = e.target;
    if (target.scrollTop === 0) {
      target.scrollTop = target.scrollHeight;
    } else if (target.scrollTop + target.clientHeight >= target.scrollHeight) {
      target.scrollTop = 0;
    }
  };

  const getSelectedImage = () => {
    if (!selectedProject) return null;
    const { colIndex, imgIndex } = selectedProject;
    if (colIndex === 0) return imagenesColumna1[imgIndex];
    if (colIndex === 1) return imagenesColumna2[imgIndex];
    if (colIndex === 2) return imagenesColumna3[imgIndex];
    return null;
  };

  const selectedImage = getSelectedImage();

  return (
    <div className="jackpot-container">
      {[imagenesColumna1, imagenesColumna2, imagenesColumna3].map((imagenesColumna, colIndex) => (
        <div
          className="jackpot-column"
          key={colIndex}
          onScroll={handleScroll}
        >
          {imagenesColumna.map((imagen, imgIndex) => (
            <div
              key={imgIndex}
              className="jackpot-item"
              onClick={(event) => handleProjectClick(colIndex, imgIndex, event)}
            >
              <img src={imagen.webformatURL} alt={imagen.tags} className="jackpot-image" />
            </div>
          ))}
        </div>
      ))}

      {selectedImage && (
        <div
          className={`overlay ${isOverlayVisible ? 'overlay-visible' : ''}`}
          style={{
            position: 'fixed',
            top: `${overlayPosition.top}px`,
            left: `${overlayPosition.left}px`,
          }}
          onClick={closeOverlay}
        >
          <img
            src={selectedImage.webformatURL}
            alt={selectedImage.tags}
            className="overlay-image"
          />
        </div>
      )}
    </div>
  );
}

export default Jackpot;
