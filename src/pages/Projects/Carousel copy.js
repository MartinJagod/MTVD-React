import React from 'react';
import './projectsHome.css'; // Asegúrate de que este archivo contenga los estilos necesarios
import { Link } from 'react-router-dom';

const Carousel = ({ title, images }) => {
  return (
    <div className="carousel-wrapper-projectsHome">
<Link to="/projects?section={title}">
      <div  className="section-input">{title}</div>
</Link>
      <div className="carousel-container-projectsHome">
        {images.map((image, index) => (
          <div key={index} className="carousel-item-projectsHome">
            <img src={image.webformatURL} alt={image.tags} className="carousel-image-projectsHome" />
            <p>{image.tags}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
