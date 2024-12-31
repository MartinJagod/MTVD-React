import React from 'react';
import { FaLinkedin, FaPinterest, FaYoutube, FaInstagram, FaEnvelope } from 'react-icons/fa';
import logoSlogan from '../../assets/images/logo-slogan.png'; // Ajusta la ruta según tu proyecto

const ContactFooter = () => {
  return (
    <div className="contact-section-footer">
      <hr className="divider-line-home" />
      <img src={logoSlogan} alt="Logo Slogan" className="logo-slogan" />
      <div className="contact-details">
        <p><strong>SPAIN</strong> <br /> contact@mtvd-design.com</p>
        <p><strong>USA</strong> <br /> contact@mtvd-design.com</p>
        <p><strong>ARGENTINA</strong> <br /> contact@mtvd-design.com</p>
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
        <a
  href="https://mail.google.com/mail/?view=cm&fs=1&to=contact@mtvd-design.com&su=Request%20for%20Information%20about%20MTVD"  target="_blank"
  rel="noopener noreferrer"
>
  <FaEnvelope className="social-icon" />
</a>




      </div>
      <br />
      <br />
    </div>
  );
};

export default ContactFooter;
