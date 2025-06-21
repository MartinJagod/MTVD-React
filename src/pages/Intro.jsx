import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import IntroScreen from './Home/IntroScreen'; // ←  ajusta la ruta si cambia

export default function Intro() {
  const navigate = useNavigate();

  useEffect(() => {
    // Duración total de la animación (ms)
    const T = 3500;

    const timer = setTimeout(() => {
      sessionStorage.setItem('seenIntro', '1');   // marca como vista
      navigate('/', { replace: true });           // vuelve al Home
    }, T);

    return () => clearTimeout(timer);
  }, [navigate]);

  /* Solo renderiza la animación */
  return <IntroScreen />;
}
