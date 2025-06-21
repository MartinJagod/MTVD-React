import React, { useState } from 'react';
import { FaLinkedin, FaPinterest, FaYoutube, FaInstagram, FaEnvelope, FaCopy } from 'react-icons/fa';
import logoSlogan from '../../assets/images/logo-slogan.png'; // Ajusta la ruta según tu proyecto

const ContactFooterDesktop = () => {
  const emails = [
    { country: "SPAIN", email: "contact@mtvd-design.com" },
    { country: "USA", email: "contact@mtvd-design.com" },
    { country: "ARGENTINA", email: "contact@mtvd-design.com" }
  ];

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
    
    <div style={{width:"100%"}}>

    <div class="linea-separadora" style={{width:"100%" ,height:"1px", backgroundColor:"#000000", width:"100%", marginTop:"4%", marginBottom:"4%"}}></div>
    <div
  className="contact-section-footer"
  style={{
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: "1rem 8%",
    alignItems: "center",
  }}
>
    <img
  src={logoSlogan}
  alt="Logo Slogan"
  className="logo-slogan"
  style={{
    maxWidth: "20%",
    height: "auto",
    flex: "1 1 200px",
    marginBottom: "2rem",
  }}
/>

      <div className="contact-details" >
        {emails.map(({ country, email }, index) => (
          <div key={index} className="email-container">
            <p style={{fontSize:"1.5rem", marginLeft:"-45%"}}>
              <strong>{country}</strong> <br /> {email} 
              <FaCopy 
                className="copy-icon"
                onClick={() => copyToClipboard(email)}
                title="Copiar dirección de email"
                />
            </p>
            {copiedEmail === email && <span className="copy-message"></span>}
          </div>
        ))}
<br />
      <div className="social-icons-black" style={{fontSize:"1.5rem", marginBottom:"5%", marginLeft:"-45%"}} >
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
            </div>

      <br /><br />
      <br /><br />
      <br /><br />
      <br /><br />
    </div>
            </div>
  );
};

export default ContactFooterDesktop;
