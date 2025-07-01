import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from "react-router-dom";

import Navbar from "../Parcial/Navbar";
import ContactFooter from "../Parcial/ContactFooter";
import "./contact.css";
import ContactFooterDesktop from '../Parcial/ContactFooterDesktop'; // Ajusta la ruta según tu estructura de carpetas


const Contact = () => {
     // Inicio animación de menú 
                 const [menuOpen, setMenuOpen] = useState(false);
                 const [searchTerm, setSearchTerm] = useState('');
                 const navigate = useNavigate();
                 const options = ['Architecture', 'Awards', 'Asphalt', 'Aluminum', 'Aggregate', 'Asbestos', 'Adhesive', 'Anchor', 'Acrylic', 'Acoustic'];
         
            useEffect(() => {
                if (menuOpen) {
                    const links = document.querySelectorAll('.menu-link');
                    const dash = document.querySelector('.menu-dash');
        
                    // Espera 3 segundos antes de iniciar las animaciones
                    const timeout = setTimeout(() => {
                        links.forEach((link, index) => {
                            setTimeout(() => {
                                link.classList.add('animate-color');
                                dash.className = `menu-dash ${link.classList[1]}`; // Sincroniza el color del guion
        
                                setTimeout(() => {
                                    link.classList.remove('animate-color');
                                    if (index === links.length - 1) {
                                        dash.className = 'menu-dash'; // Resetea el guion al final
                                    }
                                }, 200); // Duración para volver al estado inicial
                            }, index * 200); // Espaciado entre animaciones
                        });
                    }, 500); // Espera 0.5 segundos para que el menú se abra completamente y haga color al guion
        
                    // Limpia el timeout al desmontar el componente o si `menuOpen` cambia
                    return () => clearTimeout(timeout);
                }
            }, [menuOpen]);
            // Fin animación de menú
    //inicio headermover
    const [isSliding, setIsSliding] = useState(false); // Controla el deslizamiento del Navbar
    let activityTimeout = null;
      const [showInput, setShowInput] = useState(false);
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
            }, 10000);
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
            <Navbar isSliding={isSliding}
                    menuOpen={menuOpen}
                    setMenuOpen={setMenuOpen}
                    showInput={showInput}
                    setShowInput={setShowInput}
            />
            </header>

            {/* Main Content */}
            <main className="contact-main">
             

                {/* Formulario */}
                <form className="contact-form">
  <div className="form-columns-contact">
    {/* --------- COLUMNA IZQUIERDA --------- */}
    <div className="left-column-contact">
      <h5 className="form-section-title-contact">Contact information</h5>

      <div className="form-group-contact">
        <input type="text" id="name" name="name" placeholder="Name and surname *" required />
      </div>
      <div className="form-group-contact">
        <input type="email" id="email" name="email" placeholder="E‑mail *" required />
      </div>
      <div className="form-group-contact">
        <input type="tel" id="phone" name="phone" placeholder="Phone number" />
      </div>

      <h5 className="form-section-title-contact">About your project</h5>

      <div className="form-group-contact">
        <input type="text" id="projectType" name="projectType" placeholder="Tipo de proyecto" />
      </div>
      <div className="form-group-contact">
        <input type="text" id="projectSize" name="projectSize" placeholder="Tamaño de proyecto" />
      </div>
      <div className="form-group-contact">
        <input type="text" id="city" name="city" placeholder="Ciudad donde se ubica el proyecto" />
      </div>
          <p className="form-note-contact" style={{marginTop:"5%"}}>* Campos obligatorios</p>
    </div>

    {/* --------- COLUMNA DERECHA --------- */}
    <div className="right-column-contact">
      <h5 className="form-section-title-contact">Message</h5>

      <div className="form-group-contact">
        <textarea
          id="message"
          name="message"
          rows="10"
          placeholder="Message *"
          required
        />
      </div>


      <div className="form-submit-contact">
        <button type="submit">Send</button>
      </div>
    </div>
  </div>
</form>

            </main>

            {/* Footer */}
            <footer className="contact-footer">
                <div className="mobile-hide-contact">
                <ContactFooter />
                </div>

                <div className="desktop-hide-contact">
                 <ContactFooterDesktop />
                </div>  
            </footer>
        </div>
    );
};

export default Contact;
