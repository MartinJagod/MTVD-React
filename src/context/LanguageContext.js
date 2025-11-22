import { createContext, useState, useEffect  } from 'react';

export const LanguageContext = createContext();
const spanishSpeakingCountries = [
  "AR", "BO", "CL", "CO", "CR", "CU", "DO", "EC", "SV", "GQ", "GT", "HN",
  "MX", "NI", "PA", "PY", "PE", "PR", "ES", "UY", "VE"
];

const detectLanguageFromIP = async () => {
  try {
    const res   = await fetch('https://ipapi.co/json/');
    const data  = await res.json();
    const code  = data.country;
    const lang  = spanishSpeakingCountries.includes(code) ? 'ES' : 'EN';
    return { lang, countryCode: code };
  } catch {
    return { lang: 'EN', countryCode: '??' };
  }
};
/* useEffect(() => {
  if (country) {
    fetch('/api/visits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country }),
    }).catch(() => {});
  }
}, [country]); */

export const LanguageProvider = ({ children }) => {
  /* const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'EN'); */
const [lang, setLang] = useState('EN');
const [country, setCountry] = useState(null);

useEffect(() => {
  const savedLang = localStorage.getItem('lang');
const savedCtry = localStorage.getItem('country');

  if (savedLang && savedCtry) {
      setLang(savedLang);
      setCountry(savedCtry);
    } else {
      detectLanguageFromIP().then(({ lang: detLang, countryCode }) => {
        setLang(detLang);
        setCountry(countryCode);
        localStorage.setItem('lang',     detLang);
        localStorage.setItem('country',  countryCode);
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
