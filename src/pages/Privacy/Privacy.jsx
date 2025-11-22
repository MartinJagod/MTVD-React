// src/pages/Privacy/Privacy.jsx
import React, { useContext } from "react";
import { LanguageContext } from "../../context/LanguageContext";
import Navbar from "../Parcial/Navbar";
import ContactFooter from "../Parcial/ContactFooter";
import ContactFooterDesktop from "../Parcial/ContactFooterDesktop";
import "./Privacy.css"; // si luego querés ajustes propios
import "../Studio/studio.css"; // reutiliza la estética de Studio

export default function Privacy() {
  const { lang } = useContext(LanguageContext);

  return (
    <div className="studio-section">
      <header className="studio-header">
        <Navbar />
      </header>

      <div className="politicas-text">
        <span className="studio-title">
          {lang === "ES"
            ? "Política de Privacidad – MTVD"
            : "Privacy Policy – MTVD"}
        </span>

        <p className="studio-paragraph">
          {lang === "ES"
            ? "En MTVD Design Studio valoramos la privacidad de nuestros usuarios y clientes."
            : "At MTVD Design Studio we value the privacy of our users and clients."}
        </p>

        <ul className="studio-paragraph">
          <li>
            <strong>{lang === "ES" ? "Datos que recopilamos:" : "Data we collect:"}</strong>{" "}
            {lang === "ES"
              ? "podemos solicitar información básica de contacto (nombre, email, teléfono) cuando completás formularios o te suscribís a nuestras novedades."
              : "we may request basic contact information (name, email, phone) when you fill out forms or subscribe to our updates."}
          </li>
          <li>
            <strong>{lang === "ES" ? "Uso de la información:" : "Use of information:"}</strong>{" "}
            {lang === "ES"
              ? "utilizamos estos datos únicamente para responder consultas, enviar información sobre nuestros servicios y compartir novedades relacionadas a MTVD."
              : "we use this information only to answer inquiries, share updates about our services, and communicate news related to MTVD."}
          </li>
          <li>
            <strong>{lang === "ES" ? "Protección de datos:" : "Data protection:"}</strong>{" "}
            {lang === "ES"
              ? "no compartimos ni vendemos tu información personal a terceros."
              : "we do not share or sell your personal information to third parties."}
          </li>
          <li>
            <strong>Cookies:</strong>{" "}
            {lang === "ES"
              ? "nuestro sitio puede usar cookies con fines estadísticos y para mejorar la experiencia de navegación."
              : "our site may use cookies for statistical purposes and to improve browsing experience."}
          </li>
          <li>
            <strong>{lang === "ES" ? "Tus derechos:" : "Your rights:"}</strong>{" "}
            {lang === "ES"
              ? "podés solicitar en cualquier momento la actualización o eliminación de tus datos escribiéndonos a contact@mtvd-design.com."
              : "you may request the update or deletion of your data at any time by writing to contact@mtvd-design.com."}
          </li>
        </ul>

        <p className="studio-paragraph">
          {lang === "ES"
            ? "Si tenés preguntas sobre esta política, podés escribirnos a "
            : "If you have questions about this policy, you can contact us at "}{" "}
          <a href="mailto:contacto@mtvd.com">contact@mtvd-design.com</a>
        </p>
      </div>

      <footer className="studio-footer mobile-hide">
        <ContactFooterDesktop />
      </footer>
      <footer className="studio-footer desktop-hide">
        <ContactFooter />
      </footer>
    </div>
  );
}
