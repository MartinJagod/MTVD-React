import React, { useEffect, useState, useRef } from "react";
import Modal from "react-modal";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";

Modal.setAppElement("#root");

const ProjectPopup = ({ isOpen, onClose, initialImage, projectName }) => {
    const [initialIndex, setInitialIndex] = useState(0);
    const [images, setImages] = useState([]);
    const isFetching = useRef(false);

    console.log("Intentando cargar imágenes para:", projectName);

    useEffect(() => {
        const fetchImages = async () => {
            if (!projectName) {
                console.warn("⚠ No se ejecuta el fetch porque `projectName` es:", projectName);
                return;
            }
            console.log("✅ Ejecutando fetch con:", projectName);
            try {
                const API_URL = "http://193.203.182.77:5000/assets/images/";
                const formattedProjectName = encodeURIComponent(projectName.replace(/\s+/g, ""));
                console.log(`🔍 Intentando obtener imágenes de: ${API_URL}${formattedProjectName}`);

                const response = await fetch(`${API_URL}${formattedProjectName}`);
                if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

                const data = await response.json();
                console.log("✅ Imágenes recibidas:", data.images);

                // 🔹 Codificar las URLs de las imágenes para evitar errores con espacios en nombres de archivo
                const formattedImages = data.images.map(img => encodeURI(img));

                setImages(formattedImages || []);
            } catch (error) {
                console.error("❌ Error cargando imágenes:", error);
                setImages([]);
            }
        };

        fetchImages();
    }, [projectName]);

    console.log("📸 Imágenes en el estado:", images);

    useEffect(() => {
        if (initialImage && images.length > 0) {
            const index = images.findIndex(img => img.includes(initialImage));
            setInitialIndex(index !== -1 ? index : 0);
        }
    }, [initialImage, images]);

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} className="popup-modal">
            <button className="close-btn" onClick={onClose}>×</button>

            {images.length > 0 ? (
                <Swiper
                    className="custom-swiper"
                    modules={[Navigation, Pagination, Autoplay]}
                    navigation
                    pagination={{ clickable: true }}
                    spaceBetween={0}
                    slidesPerView={1}
                    initialSlide={initialIndex}
                    loop={true}
                >
                    {images.map((image, index) => (
                        <SwiperSlide key={index}>
                            <img src={image} alt={`Imagen ${index + 1}`} className="carousel-image" />
                        </SwiperSlide>
                    ))}
                </Swiper>
            ) : (
                <p>No hay imágenes disponibles para este proyecto.</p>
            )}
        </Modal>
    );
};

export default ProjectPopup;
