import React, { useEffect, useRef } from 'react';
import mobileVideo from '../../assets/images/AnimacionMobile.mp4';
import desktopVideo from '../../assets/images/AnimacionDesktop.mp4';

/**
 * IntroScreen – pantalla de introducción a pantalla completa.
 * - Elige video mobile/desktop según el ancho del viewport.
 * - Reproduce en autoplay, muted, sin loop.
 * - Llama a `onFinish` (prop) cuando termina.
 */
const IntroScreen = ({ onFinish }) => {
  const videoRef = useRef(null);
  const isMobile = window.matchMedia('(max-width: 767px)').matches;
  const src = isMobile ? mobileVideo : desktopVideo;

  useEffect(() => {
    const v = videoRef.current;
    if (v) {
      v.play().catch(() => {});
    }
  }, []);

  return (
    <div className="intro-screen">
      <video
        ref={videoRef}
        src={src}
        autoPlay
        playsInline
        muted
        onEnded={onFinish}
        className="intro-video"
      />
    </div>
  );
};

export default IntroScreen;
