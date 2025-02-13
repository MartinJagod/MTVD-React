import React, { useEffect, useState, useRef } from "react";
import Modal from "react-modal";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";

// 🔹 Verificar si `#root` existe antes de definirlo como AppElement
const rootElement = document.getElementById("root");
if (rootElement) {
    Modal.setAppElement(rootElement);
} else {
    console.warn("⚠ No se encontró #root en el DOM. Verifica index.html.");
}

const ProjectPopup = ({ isOpen, onClose, initialImage, projectName }) => {
    const [initialIndex, setInitialIndex] = useState(0);
    const [images, setImages] = useState([]);
    const modalRef = useRef(null);

    console.log("🟢 1. Modal abierto. Proyecto seleccionado:", projectName);

    useEffect(() => {
        if (!projectName || projectName.trim() === "") {
            console.warn("⚠ No se ejecuta el fetch porque `projectName` es:", projectName);
            return;
        }

        console.log("🟠 2. Ejecutando fetch con:", projectName);
        fetchImages();
    }, [projectName]);

    const fetchImages = async () => {
        console.log("🔵 3. Se llamó a fetchImages()");
    
        if (!projectName) {
            console.warn("⚠ No se ejecuta el fetch porque `projectName` es:", projectName);
            return;
        }
    
        try {
            const API_URL = "http://193.203.182.77:5000/api/images/";
            const formattedProjectName = encodeURIComponent(projectName.trim());
            const fullURL = `${API_URL}${formattedProjectName}`;
    
            console.log(`🔍 4. Intentando obtener imágenes de: ${fullURL}`);
    
            const response = await fetch(fullURL);
            console.log("🔵 5. Respuesta HTTP recibida:", response.status, response);
    
            if (!response.ok) throw new Error(`❌ Error HTTP: ${response.status}`);
    
            const data = await response.json();
            console.log("✅ 6. Imágenes recibidas de la API en React:", data);
    
            if (!data || !data.images || !Array.isArray(data.images)) {
                console.error("⚠ 7. La API no devolvió un array válido:", data);
                return;
            }
    
            console.log("🟢 8. Procesando imágenes...");
            const formattedImages = data.images.map(img => encodeURI(img));
            console.log("✅ 9. Imágenes después de formatear:", formattedImages);
    
            setImages(formattedImages);
        } catch (error) {
            console.error("❌ 10. Error cargando imágenes:", error);
            setImages([]);
        }
    };

    console.log("📸 11. Imágenes en el estado después del fetch:", images);

    useEffect(() => {
        if (initialImage && images.length > 0) {
            const index = images.findIndex(img => img.includes(initialImage));
            console.log(`🔄 12. Configurando imagen inicial: ${initialImage}, índice encontrado: ${index}`);
            setInitialIndex(index !== -1 ? index : 0);
        }
    }, [initialImage, images]);

    // 🔹 Evitar que el modal se renderice si no está abierto
    if (!isOpen) return null;

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose} // 🔹 Maneja el cierre al hacer clic fuera
            className="popup-modal"
            overlayClassName="popup-overlay" // 🔹 Aplicar el fondo para el clic externo
            shouldCloseOnOverlayClick={true} // 🔹 Habilita el cierre al hacer clic fuera
        >
            <div className="popup-content" ref={modalRef}>
                <button className="close-btn" onClick={onClose}>×</button>

                {images && images.length > 0 ? (
                    <Swiper
                        className="custom-swiper"
                        modules={[Navigation, Pagination, Autoplay]}
                        navigation
                        pagination={{ clickable: true }}
                        spaceBetween={0}
                        slidesPerView={1}
                        initialSlide={initialIndex}
                        loop={true}
                        zoom={true}
                    >
                        {images.map((image, index) => {
                            console.log(`🖼 13. Renderizando imagen ${index}:`, image);
                            return (
                                <SwiperSlide key={index}>
                                    <img src={image} alt={`Imagen ${index + 1}`} className="carousel-image" />
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                ) : (
                    <p>⚠ No hay imágenes disponibles para este proyecto.</p>
                )}
            </div>
        </Modal>
    );
};

export default ProjectPopup;

