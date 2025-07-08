import React, { useState, useContext} from 'react';
import { FaLinkedin, FaPinterest, FaYoutube, FaInstagram, FaEnvelope, FaCopy } from 'react-icons/fa';
import logoSlogan from '../../assets/images/logo-slogan.png'; // Ajusta la ruta según tu proyecto
import { LanguageContext } from "../../context/LanguageContext";


const ContactFooter = () => {
  const { lang, toggleLang } = useContext(LanguageContext);
  
   const emails = (lang => {
    const defaultEmails = {
      SPAIN:     { email: "arquitectos@estudiomontevideo.com", cellphone: "+34622641468" },
      USA:       { email: "arquitectos@estudiomontevideo.com", cellphone: "+5493516251960" },
      ARGENTINA: { email: "arquitectos@estudiomontevideo.com", cellphone: "+5493516251960" }
    };
  
    if (lang === "EN") {
      for (const key in defaultEmails) {
        defaultEmails[key].email = "contact@mtvd-design.com";
      }
    }
  
    // Convertimos el objeto a un array con el campo `country` incluido
    return Object.entries(defaultEmails).map(([country, data]) => ({
      country,
      ...data
    }));
  })(lang); // o tu variable `currentLang`
  /* 
  const emails = [
    { country: "SPAIN", email: "arquitectos@estudiomontevideo.com", cellphone:" +34622641468" },
    { country: "USA", email: "arquitectos@estudiomontevideo.com" , cellphone:"+5493516251960" },
    { country: "ARGENTINA", email: "arquitectos@estudiomontevideo.com", cellphone:" +5493516251960"}
  ];
 */
  const [copiedEmail, setCopiedEmail] = useState(null);

  // Función para copiar email al portapapeles y mostrar mensaje temporal
  const copyToClipboard = (email) => {
    navigator.clipboard.writeText(email)
      .then(() => {
        setCopiedEmail(email); // Muestra el mensaje
        setTimeout(() => setCopiedEmail(null), 2000); // Oculta después de 2 segundos
      })
      .catch(err => console.error("❌ Error al copiar:", err));
  };

  return (
    <div className="contact-section-footer">
      <img src={logoSlogan} alt="Logo Slogan" className="logo-slogan" />

      <div className="contact-details">
        {emails.map(({ country, email, cellphone }, index) => (
          <div key={index} className="email-container">
            <p>
              <strong>{country}</strong> <br /> {email} {/*<br />  {cellphone} <br /> */}
              <FaCopy 
                className="copy-icon"
                onClick={() => copyToClipboard(email)}
                title="Copiar dirección de email"
              />
            </p>
            {copiedEmail === email && <span className="copy-message"></span>}
          </div>
        ))}
      </div>

      <div className="social-icons-black">
        <a href="https://www.linkedin.com/company/mtvd/" target="_blank" rel="noopener noreferrer">
          <FaLinkedin className="social-icon" />
        </a>
        <a href="https://ar.pinterest.com/mtvddesignstudio/" target="_blank" rel="noopener noreferrer">
          <FaPinterest className="social-icon" />
        </a>
        <a href="https://www.youtube.com/@MTVDDesignStudio" target="_blank" rel="noopener noreferrer">
          <FaYoutube className="social-icon" />
        </a>
        <a href="https://www.instagram.com/estudio_montevideo" target="_blank" rel="noopener noreferrer">
          <FaInstagram className="social-icon" />
        </a>
        <a href="https://mail.google.com/mail/?view=cm&fs=1&to=contact@mtvd-design.com&su=Request%20for%20Information%20about%20MTVD"
          target="_blank" rel="noopener noreferrer">
          <FaEnvelope className="social-icon" />
        </a>
      </div>

      <br /><br />
    </div>
  );
};

export default ContactFooter;
