import React, { useEffect, useState, useRef } from 'react';
import Modal from 'react-modal';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

const root = document.getElementById('root');
if (root) Modal.setAppElement(root);

const API_BASE = 'http://193.203.182.77:5000/api/images/popup/';

// Estilos para el modal responsive
const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
   
  },
  content: {
    position: 'relative',
    inset: '0',
    
    width: '90vw',
    height: '85vh',
    maxWidth: '95vw',
    maxHeight: '95vh',
   /*  minWidth: '320px',
    minHeight: '400px', */
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '12px',
    outline: 'none',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    padding: 0,
    margin: 0,
    overflow: 'hidden',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  backgroundColor: 'transparent'

  }
};

const popupContentStyles = {
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  overflow: 'hidden'
};

const closeBtnStyles = {
  position: 'absolute',
  top: '15px',
  right: '15px',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  color: '#333',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  borderRadius: '50%',
  width: '40px',
  height: '40px',
  fontSize: '20px',
  cursor: 'pointer',
  zIndex: 10,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s ease',
  fontWeight: 'bold'
};

const swiperStyles = {
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  margin : "auto 0"

};

const slideStyles = {
  display: 'flex !important',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  backgroundColor: 'transparent',
};

const imageStyles = {
  maxWidth: '90%',
  maxHeight: '90%',
  width: 'auto',
  height: 'auto',
  objectFit: 'contain',
  display: 'block',
  margin: 'auto'
};

const noImagesStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  fontSize: '18px',
  color: '#666'
};

export default function ProjectPopup({
  isOpen,
  onClose,
  initialImage,
  projectName,
  category,
}) {
  console.log('🔍 ProjectPopup props:', { isOpen, projectName, category, initialImage });

  /* Utilidades */
  const normalize = (str = '') =>
  str
    .normalize('NFD')                    // descompone letras con acento (ej: ó → o + ◌́)
    .replace(/[\u0300-\u036f]/g, '')     // elimina los signos diacríticos (acentos, diéresis, etc.)
    .replace(/\s+/g, '')                 // elimina todos los espacios
    .trim();                             // remueve espacios iniciales y finales (por si acaso)

  const formattedProject = normalize(projectName);

  /* Estados */
  const [images, setImages] = useState([]);
  const [initialIndex, setIndex] = useState(0);
  const modalRef = useRef(null);

  /* Fetch cuando cambia proyecto o categoría */
  useEffect(() => {
    console.log('⚙️ useEffect ejecutado con:', { formattedProject, category });

    if (!formattedProject || !category) {
      console.warn('⚠️ formattedProject o category no definidos:', { formattedProject, category });
      setImages([]);
      return;
    }

    async function load() {
      const url = `${API_BASE}${category}/${projectName}`;
      console.log('🌐 Intentando fetch a:', url);

      try {
        const res = await fetch(url);
        console.log('📥 Estado respuesta:', res.status);

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        console.log('📦 Datos recibidos:', data);

        if (Array.isArray(data.images) && data.images.length) {
          setImages(data.images.map(src => encodeURI(src)));
        } else {
          console.warn('⚠️ No se recibieron imágenes válidas:', data);
          setImages([]);
        }
      } catch (err) {
        console.error('❌ Error en el fetch:', err);
        setImages([]);
      }
    }

    load();
  }, [formattedProject, category, isOpen]);

  /* Slide inicial */
  useEffect(() => {
    if (!initialImage || !images.length) return;
    const idx = images.findIndex(i => i.includes(initialImage));
    setIndex(idx !== -1 ? idx : 0);
  }, [initialImage, images]);

  /* Cerrar con tecla Escape */
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevenir scroll del body cuando el modal está abierto
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  /* No render si modal cerrado */
  if (!isOpen) return null;

  /* Renderizado */
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={modalStyles}
      shouldCloseOnOverlayClick
      shouldCloseOnEsc
    >
      <div style={popupContentStyles} ref={modalRef}>
        <button 
          style={closeBtnStyles}
          onClick={onClose}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
            e.target.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
            e.target.style.transform = 'scale(1)';
          }}
        >
          ×
        </button>

        {images.length ? (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center'}}>
            <Swiper
              style={swiperStyles}
              modules={[Navigation, Pagination, Autoplay]}
              navigation
              pagination={{ 
                clickable: true,
                dynamicBullets: true 
              }}
              slidesPerView={1}
              initialSlide={initialIndex}
              loop={images.length > 1}
              zoom={{ maxRatio: 3 }}
              spaceBetween={0}
              centeredSlides={true}
            >
              {images.map((src, i) => (
                <SwiperSlide key={i} style={slideStyles}>
                  <img 
                    src={src} 
                    alt={`Imagen ${i + 1}`} 
                    style={imageStyles}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          <div style={noImagesStyles}>
            <p>⚠ No hay imágenes disponibles para este proyecto.</p>
          </div>
        )}
      </div>
    </Modal>
  );
}