import React, { useEffect, useState, useRef, useMemo, useContext } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { subcategoriaProyectosData, subcategoriaProyectosDataES } from './subcategoriasProyectosData';
import './projectsHome.css';
import './ProjectsSection.css';
// Eliminamos react-icons para evitar el error de build
// import { FaExternalLinkAlt } from 'react-icons/fa';

// Componentes Parciales
import Navbar from '../Parcial/Navbar';
import ContactFooter from '../Parcial/ContactFooter';
import ContactFooterDesktop from '../Parcial/ContactFooterDesktop';

// Datos y API
import projectsData from './projectsData';
import API_BASE from '../../apiBase';
import { LanguageContext } from '../../context/LanguageContext';

// Helper para formatear nombres
const formatName = (str) =>
  str
    .replace(/([A-Z])/g, ' $1')
    .replace(/([0-9]+)/g, ' $1')
    .trim();

function ProjectsSection() {
  const { lang } = useContext(LanguageContext); // EN | ES
const location = useLocation();
  // Mapa de Títulos
  const TITLE_MAP = {
    Design:       { EN: 'Design',       ES: 'Diseño' },
    Architecture: { EN: 'Architecture', ES: 'Arquitectura' },
    Branding:     { EN: 'Brands',       ES: 'Marcas' },
  };

  // Configuración de colores
  const SECTION_STYLES = {
    Design:       { bg: '#FEC93A', color: '#333' },
    Architecture: { bg: '#3B76F3', color: '#333' },
    Branding:     { bg: '#44B87E', color: '#333' },
  };

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Estado inicial
  const [section, setSection] = useState(() => {
    const sec = searchParams.get('section');
    return ['Design', 'Architecture', 'Branding'].includes(sec) ? sec : 'All';
  });
  
  // Estados de datos
  const [images, setImages] = useState([]);         
  const [filteredImages, setFilteredImages] = useState([]); 
  const [subcatFilter, setSubcatFilter] = useState(() => {
    return searchParams.get('sub') || '';
  });
  const [fileNameSelected, setFileNameSelected] = useState("");

  // Estados de UI
  const [showInput, setShowInput] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  // ---------------------------------------------------------
  // 🟢 LÓGICA DE LONG PRESS (MANTENER PRESIONADO)
  // ---------------------------------------------------------
  const longPressTimer = useRef(null);
  const isLongPressTriggered = useRef(false);

  const handlePressStart = (item) => {
    // Solo activamos esta lógica si la pantalla es menor a 1440px (Móvil/Tablet)
    if (window.innerWidth >= 1440) return;

    isLongPressTriggered.current = false;
    
    // Iniciamos temporizador de 500ms
    longPressTimer.current = setTimeout(() => {
      isLongPressTriggered.current = true;
      
      // Acción: Abrir en nueva pestaña
      const prefix = window.location.hash ? '/#' : ''; 
      window.open(`${window.location.origin}${prefix}/project/${item.category}/${item.name}`, '_blank');
      
      // Feedback táctil (vibración) si el dispositivo lo soporta
      if (navigator.vibrate) navigator.vibrate(50);

    }, 500); 
  };

  const handlePressEnd = () => {
    // Si el usuario suelta el dedo antes de los 500ms, cancelamos el long press
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleProjectClick = (item) => {
    // Si se disparó el long press (es true), NO navegamos en la misma pestaña
    if (isLongPressTriggered.current) {
      isLongPressTriggered.current = false; // Resetear para la próxima
      return;
    }
    // Si fue un click rápido normal, navegamos
    navigate(`/project/${item.category}/${item.name}`);
  };

  // Evitar menú contextual nativo (guardar imagen, etc) en móviles para que no moleste
  const handleContextMenu = (e) => {
    if (window.innerWidth < 1440) {
       // e.preventDefault(); // Descomentar si quieres bloquear el menú nativo del navegador
    }
  };
  // ---------------------------------------------------------

  // --- HELPERS ---
  const getCategoryById = (id) => {
    if (id <= 5000) return 'design';
    if (id <= 8000) return 'architecture';
    return 'branding'; 
  };

  const normalize = (str) =>
    str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') 
      .replace(/\.[^/.]+$/, '')        
      .replace(/\d+$/, '')             
      .replace(/[^a-z0-9]/g, '');      

  // --- MEMOS ---
  const searchIndex = useMemo(() => {
    return Object.entries(projectsData).flatMap(([idStr, p]) => {
      const id = Number(idStr);
      const category = getCategoryById(id);

      if (section !== 'All' && category !== section.toLowerCase()) return [];

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
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .toLowerCase();

      return [{
        label: p.nombreproyecto,
        projectName: p.nombreproyecto,
        category,
        fullText
      }];
    });
  }, [section]);

  const tituloOpen = lang === "ES" ? "Abrir en nueva pestaña" : "Open in new tab";

  const proyectosDataLocal = lang === "ES" ? subcategoriaProyectosDataES : subcategoriaProyectosData;

  const nameLookup = useMemo(() => {
    const map = {};
    proyectosDataLocal.forEach(p => {
      const key = normalize(p.nombre);
      (map[key] ||= []).push({ id: p.id, subCategoria: p.subCategoria });
    });
    return map;
  }, [proyectosDataLocal]);

  const sectionRanges = {
    Design:       [1, 5000],
    Architecture: [5001, 8000],
    Branding:     [8001, 10000],
  };

  // --- EFECTOS ---
  useEffect(() => {
    fetch(`${API_BASE}/projects-home`)
      .then(r => r.json())
      .then(data => {
        let hits = [];
        let minId = 0;
        let maxId = 10000;

        if (section === 'All') {
          const d = data?.design?.hits ?? [];
          const a = data?.architecture?.hits ?? [];
          const b = data?.branding?.hits ?? [];
          hits = [...d, ...a, ...b];
          minId = 1;
          maxId = 10000;
        } else {
          hits = data?.[section.toLowerCase()]?.hits ?? [];
          if (sectionRanges[section]) {
            [minId, maxId] = sectionRanges[section];
          }
        }

        const enriched = hits.flatMap(url => {
          const raw = decodeURIComponent(url.split('/').pop()).replace(/\.[^/.]+$/, ''); 
          const key = normalize(raw);
          const metas = nameLookup[key] || [];
          const meta = metas.find(m => m.id >= minId && m.id <= maxId);

          if (!meta) return [];

          return {
            url,
            name: raw,
            id: meta.id,
            category: getCategoryById(meta.id),
            subCategoria: meta.subCategoria,
          };
        });

        setImages(enriched.sort(() => Math.random() - 0.5));
      })
      .catch((err) => {
        console.error("Error fetching projects:", err);
        setImages([]);
      });
  }, [section, nameLookup]);

  useEffect(() => {
    if (section === 'All') return; 
    fetch(`${API_BASE}/projects-home`)
      .then(response => response.json())
      .then(data => {
        const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
        const categoryData = data[section.toLowerCase()];
        if (categoryData && categoryData.hits) {
          setFilteredImages(shuffle(categoryData.hits));
        } else {
          setFilteredImages([]);
        }
      })
      .catch(error => { setFilteredImages([]); });
  }, [section]);

  const getFileName = (imageUrl) => {
    if (!imageUrl) return "";
    let fileName = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
    fileName = decodeURIComponent(fileName);
    let fileNameWithoutExtension = fileName.replace(/\.[^/.]+$/, "");
    return fileNameWithoutExtension.replace(/\d+$/, "");
  };

  useEffect(() => {
    if (filteredImages.length > 0) {
      const firstImage = filteredImages[0];
      setFileNameSelected(getFileName(firstImage));
    }
  }, [filteredImages]);

  useEffect(() => {
    if (menuOpen) {
      const links = document.querySelectorAll('.menu-link');
      const dash = document.querySelector('.menu-dash');
      const timeout = setTimeout(() => {
        links.forEach((link, index) => {
          setTimeout(() => {
            link.classList.add('animate-color');
            if (dash) dash.className = `menu-dash ${link.classList[1]}`;
            setTimeout(() => {
              link.classList.remove('animate-color');
              if (index === links.length - 1 && dash) {
                dash.className = 'menu-dash';
              }
            }, 200);
          }, index * 200);
        });
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [menuOpen]);

  useEffect(() => {
    const params = {};
    if (section !== 'All') params.section = section;
    if (subcatFilter) params.sub = subcatFilter;
    setSearchParams(params, { replace: true });
  }, [section, subcatFilter, setSearchParams]);

  const handleSelectProject = (item) => {
    const slug = encodeURIComponent(item.projectName.replace(/\s+/g, ''));
    navigate(`/project/${item.category}/${slug}`);
    setShowInput(false);
  };
useEffect(() => {
  if (location.state?.resetProjects) {
    // Reset “solo cuando se clickea Proyectos en el navbar”
    setSection('All');
    setSubcatFilter('');
    setShowInput(false);
    setMenuOpen(false);

    // Consumir la bandera para que el BACK mantenga selecciones
    navigate(location.pathname, { replace: true, state: {} });
  }
}, [location.state, location.pathname, navigate]);

  const toggleSection = (sec) => {
    if (section === sec) {
      setSection('All');
      setSubcatFilter(''); 
    } else {
      setSection(sec);
      setSubcatFilter(''); 
    }
  };

  const projectsForCurrentSection = useMemo(() => {
    if (section === 'All') return images;
    return images.filter(img => img.category === section.toLowerCase());
  }, [images, section]);

  const visible = projectsForCurrentSection.filter(
    (img) => !subcatFilter || img.subCategoria === subcatFilter
  );
  
  const subcatsInSection = [...new Set(projectsForCurrentSection.map(i => i.subCategoria))].sort();

  return (
    <div className="projects-section">
      <div className="projects-fixed-top">
        <header className="projects-header">
          <Navbar
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            showInput={showInput}
            setShowInput={setShowInput}
            page="ProjectsSection"
            searchData={searchIndex}
            onSelect={handleSelectProject}
          />
        </header>

        <div className="section-selector-projects">
          <div className="desktop-menu-projetcs">
            <nav className="menu-items-split-desktop">
              <div className="menu-left-projects">
                {['Design', 'Architecture', 'Branding'].map((sec) => {
                  const isActive = section === sec;
                  const style = isActive ? {
                    backgroundColor: SECTION_STYLES[sec].bg,
                    color: SECTION_STYLES[sec].color,
                    
                  } : {};

                  return (
                    <button
                      key={sec}
                      className={`menu-link-desktop-section ${isActive ? 'active' : ''}`}
                      onClick={() => toggleSection(sec)}
                      style={style}
                    >
                      {TITLE_MAP[sec][lang]}
                    </button>
                  );
                })}
              </div>
            </nav>
          </div>
        </div>

        {section !== 'All' && (
        <div className={`subcategories ${section !== 'All' ? 'show' : ''}`}>
          {subcatsInSection.map(sub => (
            <button
              key={sub}
              className={`subcategory-button ${sub === subcatFilter ? 'active' : ''}`}
              onClick={() => setSubcatFilter(sub === subcatFilter ? '' : sub)}
            >
              {sub}
            </button>
          ))}
        </div>
        )}
      </div>

      <div className="projects-section">
        <div className={`projects-scrollable-content ${section === 'All' ? 'no-selection' : ''}`}>

          {/* GRID MÓVIL / TABLET (Donde aplicamos Long Press) */}
          <div className="desktop-hide image-grid masonry">
            <div className="column-project">
              {visible.filter((_, i) => i % 2 === 0).map((item, i) => (
                <div className="image-wrapper" key={i}>
                  <img
                    src={item.url}
                    alt={item.name}
                    className="project-image"
                    /* Eventos para Click vs Long Press */
                    onTouchStart={() => handlePressStart(item)}
                    onTouchEnd={handlePressEnd}
                    onMouseDown={() => handlePressStart(item)}
                    onMouseUp={handlePressEnd}
                    onMouseLeave={handlePressEnd}
                    onClick={() => handleProjectClick(item)}
                    onContextMenu={handleContextMenu} 
                  />
                  <div className="image-label-section">{formatName(item.name)}</div>
                  {/* Botón Icono (Oculto por CSS en < 1440px) */}
                  <button 
                    className="open-new-tab-btn"
                    title="Abrir en nueva pestaña"
                    onClick={(e) => {
                      e.stopPropagation();
                      const prefix = window.location.hash ? '/#' : ''; 
                      window.open(`${window.location.origin}${prefix}/project/${item.category}/${item.name}`, '_blank');
                    }}
                  >
                    {/* SVG simple para evitar dependencia react-icons */}
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="12" width="12" xmlns="http://www.w3.org/2000/svg">
                        <path d="M432,320H400a16,16,0,0,0-16,16V448H64V128H208a16,16,0,0,0,16-16V80a16,16,0,0,0-16-16H48A48,48,0,0,0,0,112V464a48,48,0,0,0,48,48H400a48,48,0,0,0,48-48V336A16,16,0,0,0,432,320ZM488,0h-128c-21.37,0-32.05,25.91-17,41l35.73,35.73L135,320.37a24,24,0,0,0,0,34L157.67,377a24,24,0,0,0,34,0L435.28,133.32,471,169c15,15,41,4.5,41-17V24A24,24,0,0,0,488,0Z"></path>
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <div className="column-project">
              {visible.filter((_, i) => i % 2 !== 0).map((item, i) => (
                <div className="image-wrapper" key={i}>
                  <img
                    src={item.url}
                    alt={item.name}
                    className="project-image"
                    onTouchStart={() => handlePressStart(item)}
                    onTouchEnd={handlePressEnd}
                    onMouseDown={() => handlePressStart(item)}
                    onMouseUp={handlePressEnd}
                    onMouseLeave={handlePressEnd}
                    onClick={() => handleProjectClick(item)}
                    onContextMenu={handleContextMenu}
                  />
                  <div className="image-label-section">{formatName(item.name)}</div>
                   <button 
                    className="open-new-tab-btn"
                    title="Abrir en nueva pestaña"
                    onClick={(e) => {
                      e.stopPropagation();
                      const prefix = window.location.hash ? '/#' : ''; 
                      window.open(`${window.location.origin}${prefix}/project/${item.category}/${item.name}`, '_blank');
                    }}
                  >
                    {/* SVG simple para evitar dependencia react-icons */}
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="12" width="12" xmlns="http://www.w3.org/2000/svg">
                        <path d="M432,320H400a16,16,0,0,0-16,16V448H64V128H208a16,16,0,0,0,16-16V80a16,16,0,0,0-16-16H48A48,48,0,0,0,0,112V464a48,48,0,0,0,48,48H400a48,48,0,0,0,48-48V336A16,16,0,0,0,432,320ZM488,0h-128c-21.37,0-32.05,25.91-17,41l35.73,35.73L135,320.37a24,24,0,0,0,0,34L157.67,377a24,24,0,0,0,34,0L435.28,133.32,471,169c15,15,41,4.5,41-17V24A24,24,0,0,0,488,0Z"></path>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* GRID DESKTOP (Mantiene comportamiento normal) */}
          <div className="mobile-hide image-list-desktop masonry">
            {visible.map((item, i) => (
              <div className="image-wrapper" key={i}>
                <img
                  src={item.url}
                  alt={item.name}
                  className="project-image"
                  /* Aquí también aplicamos Long Press por si acaso cae entre 768px y 1440px */
                  onTouchStart={() => handlePressStart(item)}
                  onTouchEnd={handlePressEnd}
                  onMouseDown={() => handlePressStart(item)}
                  onMouseUp={handlePressEnd}
                  onMouseLeave={handlePressEnd}
                  onClick={() => handleProjectClick(item)}
                  onContextMenu={handleContextMenu}
                />
                <div className="image-label-section">{formatName(item.name)}</div>
                 <button 
                    className="open-new-tab-btn"
                    title={tituloOpen}
                    onClick={(e) => {
                      e.stopPropagation();
                      const prefix = window.location.hash ? '/#' : ''; 
                      window.open(`${window.location.origin}${prefix}/project/${item.category}/${item.name}`, '_blank');
                    }}
                  >
                    {/* SVG simple para evitar dependencia react-icons */}
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="12" width="12" xmlns="http://www.w3.org/2000/svg">
                        <path d="M432,320H400a16,16,0,0,0-16,16V448H64V128H208a16,16,0,0,0,16-16V80a16,16,0,0,0-16-16H48A48,48,0,0,0,0,112V464a48,48,0,0,0,48,48H400a48,48,0,0,0,48-48V336A16,16,0,0,0,432,320ZM488,0h-128c-21.37,0-32.05,25.91-17,41l35.73,35.73L135,320.37a24,24,0,0,0,0,34L157.67,377a24,24,0,0,0,34,0L435.28,133.32,471,169c15,15,41,4.5,41-17V24A24,24,0,0,0,488,0Z"></path>
                    </svg>
                  </button>
              </div>
            ))}
          </div>

        </div>

        <div>
          <footer className="studio-footer mobile-hide">
            <ContactFooterDesktop />
          </footer>
          <footer className="studio-footer desktop-hide">
            <ContactFooter />
          </footer>
        </div>
      </div>
    </div>
  );
}

export default ProjectsSection;