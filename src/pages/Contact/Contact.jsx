import React, { useEffect, useState, useRef, useCallback, useMemo, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import projectsData from '../Projects/projectsData';
import projectsDataES from '../Projects/projectsDataES';
import { LanguageContext } from '../../context/LanguageContext';
import Navbar from "../Parcial/Navbar";
import ContactFooter from "../Parcial/ContactFooter";
import "./contact.css";
import ContactFooterDesktop from '../Parcial/ContactFooterDesktop'; // Ajusta la ruta según tu estructura de carpetas

/* rango → categoría */
const getCategoryById = id =>
  id <= 5000 ? 'design'
    : id <= 8000 ? 'architecture'
      : 'branding';



const Contact = () => {
  // Inicio animación de menú 
  const { lang, toggleLang } = useContext(LanguageContext);
  // Inicio animación de menú 
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // 🔹 Dataset por idioma
  const dataset = lang === 'ES' ? projectsDataES : projectsData;

  /* helpers */
  const buildIndex = (data) =>
    Object.entries(data).map(([idStr, p]) => {
      const id = Number(idStr);
      const category = getCategoryById(id);

      const fullText = [
        p.nombreproyecto,
        p.frase1, p.frase2, p.frase3,
        p.location,
        p.encabezado,
        p.parrafo1, p.parrafo2,
        p.nombre1, p.nombre2,
        p.contador1?.toString(),
        p.contador2?.toString()
      ]
        .filter(Boolean)
        .join(' | ')
        .normalize('NFD').replace(/\p{Diacritic}/gu, '')
        .toLowerCase();

      return { label: p.nombreproyecto, projectName: p.nombreproyecto, category, fullText };
    });

  const handleSelectProject = (item) => {
    const slug = encodeURIComponent(item.projectName.replace(/\s+/g, ''));
    navigate(`/project/${item.category}/${slug}`);
    setShowInput(false);
  };

  /*  const filteredOptions = options.filter(option =>
     option.toLowerCase().includes(searchTerm.toLowerCase())
   ); */


  /* ── índices globales, se calculan 1 vez ── */
  const searchIndexes = useMemo(() => ({
    EN: buildIndex(projectsData),
    ES: buildIndex(projectsDataES),
  }), []);

  /* índice que realmente vas a usar */
  const searchIndex = searchIndexes[lang === 'ES' ? 'ES' : 'EN'];

  // ------------ secuencia de bordes ------------
  useEffect(() => {
    const fields = document.querySelectorAll(
      '.form-group-contact input, .form-group-contact textarea'
    );

    const palette = ['var(--c1)', 'var(--c2)', 'var(--c3)', 'var(--c4)'];
    const FLASH_MS = 700;   // duración de la animación
    const GAP_MS = 400;   // separación entre un campo y el siguiente

    fields.forEach((field, i) => {
      setTimeout(() => {
        // paso 1: fija el color para este campo
        field.style.setProperty('--flash', palette[i % palette.length]);

        // paso 2: lanza la animación
        field.classList.add('flash-border');

        // paso 3: limpia al terminar
        setTimeout(() => {
          field.classList.remove('flash-border');
          field.style.removeProperty('--flash');
        }, FLASH_MS);
      }, i * GAP_MS);
    });
  }, []);
  // ---------------------------------------------


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
// --- handler de envío (memoizado) ---
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Network response was not ok');

      alert(lang === 'ES'
        ? '¡Mensaje enviado con éxito!'
        : 'Message sent successfully!');
      e.target.reset();
      navigate('/');     
    } catch (err) {
      console.error(err);
      alert(lang === 'ES'
        ? 'Hubo un problema al enviar el mensaje.'
        : 'There was a problem sending your message.');
    }
  }, [lang, navigate]);

  return (
    <div className="contact-page">
      {/* Navbar */}
      <header className="contact-header">
        <Navbar isSliding={isSliding}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          showInput={showInput}
          searchData={searchIndex}
          onSelect={handleSelectProject}

          setShowInput={setShowInput}
        />
      </header>

      {/* Main Content */}
      <main className="contact-main">


        {/* Formulario */}
        <form className="contact-form" onSubmit={handleSubmit}>
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
              <p className="form-note-contact" style={{ marginTop: "5%" }}>* Campos obligatorios</p>
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
