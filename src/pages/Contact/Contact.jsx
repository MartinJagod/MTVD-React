import React, { useState, useEffect } from 'react';
import Navbar from "../Parcial/Navbar";
import ContactFooter from "../Parcial/ContactFooter";
import "./contact.css";


const Contact = () => {
    //inicio headermover
    const [isSliding, setIsSliding] = useState(false); // Controla el deslizamiento del Navbar
    let activityTimeout = null;
      const [showInput, setShowInput] = useState(false);
          const [menuOpen, setMenuOpen] = useState(false);
    useEffect(() => {
        const handleUserActivity = () => {
            setIsSliding(false); // Detiene el deslizamiento si hay actividad
    
            if (activityTimeout) {
                clearTimeout(activityTimeout);
            }
    
            // Configura el timeout para iniciar el deslizamiento después de 2 segundos
            activityTimeout = setTimeout(() => {
                // Solo desliza el Navbar si el menú y el buscador están cerrados
                if (!menuOpen && !showInput) {
                    setIsSliding(true);
                }
            }, 2000);
        };
    
        // Escuchar eventos de actividad del usuario
        window.addEventListener('mousemove', handleUserActivity);
        window.addEventListener('scroll', handleUserActivity);
        window.addEventListener('click', handleUserActivity);
    
        return () => {
            // Limpia los eventos y el timeout al desmontar
            window.removeEventListener('mousemove', handleUserActivity);
            window.removeEventListener('scroll', handleUserActivity);
            window.removeEventListener('click', handleUserActivity);
            if (activityTimeout) {
                clearTimeout(activityTimeout);
            }
        };
    }, [menuOpen, showInput]);
    return (
        <div className="contact-page">
            {/* Navbar */}
            <header className="contact-header">
            <Navbar
                menuOpen={menuOpen}
                setMenuOpen={setMenuOpen} // Se pasa correctamente como prop
                showInput={showInput}
                setShowInput={setShowInput}
            />
            </header>

            {/* Main Content */}
            <main className="contact-main">
                <h2 className="contact-title">
                    Complete the <br />
                    form and write to us. <br />
                    <span className="contact-highlight">We will contact you.</span>
                </h2>

                {/* Formulario */}
                <form className="contact-form">
                    <h5 className="form-section-title">Contact information</h5>

                    {/* Nombre y Apellido */}
                    <div className="form-group">
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Name and surname *"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className="form-group">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="E-mail *"
                            required
                        />
                    </div>

                    {/* Teléfono */}
                    <div className="form-group">
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            placeholder="Phone number"
                        />
                    </div>

                    <h5 className="form-section-title">About your project</h5>

                    {/* Tipo de Proyecto */}
                    <div className="form-group">
                        <input
                            type="text"
                            id="projectType"
                            name="projectType"
                            placeholder="Tipo de proyecto"
                        />
                    </div>

                    {/* Tamaño de Proyecto */}
                    <div className="form-group">
                        <input
                            type="text"
                            id="projectSize"
                            name="projectSize"
                            placeholder="Tamaño de proyecto"
                        />
                    </div>

                    {/* Ciudad */}
                    <div className="form-group">
                        <input
                            type="text"
                            id="city"
                            name="city"
                            placeholder="Ciudad donde se ubica el proyecto"
                        />
                    </div>

                    {/* Mensaje */}
                    <h5 className="form-section-title">Message</h5>
                    <div className="form-group">
                        <textarea
                            id="message"
                            name="message"
                            rows="5"
                            placeholder="Message *"
                            required
                        ></textarea>
                    </div>

                    {/* Campos obligatorios */}
                    <p className="form-note">* Campos obligatorios</p>

                    {/* Botón Enviar */}
                    <div className="form-submit">
                        <button type="submit">ENVIAR</button>
                    </div>
                </form>
            </main>
<br />
<br />
<br />
<br />
            {/* Footer */}
            <footer className="contact-footer">
                <ContactFooter />
            </footer>
        </div>
    );
};

export default Contact;
