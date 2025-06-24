import { createContext, useState, useEffect  } from 'react';

export const LanguageContext = createContext();
const spanishSpeakingCountries = [
  "AR", "BO", "CL", "CO", "CR", "CU", "DO", "EC", "SV", "GQ", "GT", "HN",
  "MX", "NI", "PA", "PY", "PE", "PR", "ES", "UY", "VE"
];

const detectLanguageFromIP = async () => {
  try {
    const res = await fetch("https://ipapi.co/json/");
    const data = await res.json();
    const countryCode = data.country;
    return spanishSpeakingCountries.includes(countryCode) ? "ES" : "EN";
  } catch (err) {
    console.warn("🌍 No se pudo detectar el país por IP.");
    return "EN"; // idioma por defecto
  }
};


export const LanguageProvider = ({ children }) => {
  /* const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'EN'); */
const [lang, setLang] = useState('EN');

useEffect(() => {
  const savedLang = localStorage.getItem('lang');

  if (savedLang) {
    setLang(savedLang);
  } else {
    detectLanguageFromIP().then((detectedLang) => {
      setLang(detectedLang);
      localStorage.setItem('lang', detectedLang);
    });
  }
}, []);
  const toggleLang = () => {
    const newLang = lang === 'EN' ? 'ES' : 'EN';
    setLang(newLang);
    localStorage.setItem('lang', newLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
};
