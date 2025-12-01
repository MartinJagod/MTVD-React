import React, { useEffect, useState, useRef, useMemo, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { subcategoriaProyectosData, subcategoriaProyectosDataES } from './subcategoriasProyectosData';
import './projectsHome.css';
import './ProjectsSection.css';
import { FaExternalLinkAlt } from 'react-icons/fa';
// Componentes Parciales
import Navbar from '../Parcial/Navbar';
import ContactFooter from '../Parcial/ContactFooter';
import ContactFooterDesktop from '../Parcial/ContactFooterDesktop';

// Datos y API
import projectsData from './projectsData';
import API_BASE from '../../apiBase';
import { LanguageContext } from '../../context/LanguageContext';

// Helper para formatear nombres (camelCase a Texto)
const formatName = (str) =>
  str
    .replace(/([A-Z])/g, ' $1')   // Espacio antes de mayúsculas
    .replace(/([0-9]+)/g, ' $1')  // NUEVO: Espacio antes de números
    .trim();

function ProjectsSection() {
  const { lang } = useContext(LanguageContext); // EN | ES

  // Mapa de Títulos
  const TITLE_MAP = {
    Design:       { EN: 'Design',       ES: 'Diseño' },
    Architecture: { EN: 'Architecture', ES: 'Arquitectura' },
    Branding:     { EN: 'Brands',       ES: 'Marcas' },
  };

  // Configuración de colores para los botones activos
  const SECTION_STYLES = {
    Design:       { bg: '#FEC93A', color: '#333' }, // Amarillo
    Architecture: { bg: '#3B76F3', color: '#FFF' }, // Azul
    Branding:     { bg: '#44B87E', color: '#FFF' }, // Verde
  };

  const [searchParams, setSearchParams] = useSearchParams(); // Agregamos setSearchParams
  const navigate = useNavigate();

  // Estado inicial: 'All' para que empiece mostrando todo y sin subcategorías
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
  
  // Refs
  const isSliding = useRef(false);

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
const tituloOpen = lang === "ES"
    ? "Abrir en nueva pestaña"
    : "Open in new tab";

  const proyectosDataLocal = lang === "ES"
    ? subcategoriaProyectosDataES
    : subcategoriaProyectosData;

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

  /* 1. Carga de proyectos */
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
        // 1. Obtenemos el nombre sin extensión, pero DEJAMOS los números
  const raw = decodeURIComponent(url.split('/').pop())
    .replace(/\.[^/.]+$/, ''); 
  
  // 2. Para buscar en tu 'lookup', usamos normalize (que ya se encarga de limpiar internamente)
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

  /* 2. Fetch secundario */
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
      .catch(error => {
        setFilteredImages([]);
      });
  }, [section]);

  /* 3. Helper Filenames */
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

  /* 4. Limpiar filtro al cambiar sección */
 /*  useEffect(() => {
    setSubcatFilter('');
  }, [section]); */

  /* 5. Animación Menú */
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

  /* 6. Leer URL */
  /* useEffect(() => {
    const sectionsList = ['Design', 'Architecture', 'Branding'];
    const sectionFromUrl = searchParams.get('section');
    if (sectionFromUrl && sectionsList.includes(sectionFromUrl)) {
      setSection(sectionFromUrl);
    }
  }, [searchParams]); */
/* NUEVO: Sincronizar URL con el estado actual */
  useEffect(() => {
    const params = {};
    if (section !== 'All') params.section = section;
    if (subcatFilter) params.sub = subcatFilter;
    
    // replace: true evita crear historial infinito si cambias filtros rápido,
    // pero permite que el botón "Atrás" del navegador funcione para salir de la página.
    setSearchParams(params, { replace: true });
  }, [section, subcatFilter, setSearchParams]);
  // --- HANDLERS ---

  const handleSelectProject = (item) => {
    const slug = encodeURIComponent(item.projectName.replace(/\s+/g, ''));
    navigate(`/project/${item.category}/${slug}`);
    setShowInput(false);
  };

 const toggleSection = (sec) => {
    if (section === sec) {
      setSection('All');
      setSubcatFilter(''); // Limpiar subcategoría
    } else {
      setSection(sec);
      setSubcatFilter(''); // Limpiar subcategoría al cambiar de sección mayor
    }
  };

 // --- RENDER HELPERS ---

  // 1. Filtrar 'images' por la sección actual INMEDIATAMENTE.
  // Esto asegura que si venimos de 'All', usemos los datos que ya tenemos en memoria
  // para filtrar al instante, sin esperar al fetch del useEffect.
  const projectsForCurrentSection = useMemo(() => {
    if (section === 'All') return images;
    return images.filter(img => img.category === section.toLowerCase());
  }, [images, section]);

  // 2. Usar esa lista filtrada para calcular 'visible' (Grid de imágenes)
  const visible = projectsForCurrentSection.filter(
    (img) => !subcatFilter || img.subCategoria === subcatFilter
  );
  
  // 3. Usar la misma lista filtrada para las subcategorías
  // Ahora solo saldrán las subcategorías de los proyectos que coinciden con la sección
  const subcatsInSection = [...new Set(projectsForCurrentSection.map(i => i.subCategoria))].sort();
  return (
    <div className="projects-section">
      <div className="projects-fixed-top">

        {/* Header - Sin posición fija inline */}
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

        {/* Selector de Sección */}
        <div className="section-selector-projects">
          <div className="desktop-menu-projetcs">
            <nav className="menu-items-split-desktop">
              <div className="menu-left-projects">
                {['Design', 'Architecture', 'Branding'].map((sec) => {
                  const isActive = section === sec;
                  
                  // Estilos dinámicos
                  const style = isActive ? {
                    backgroundColor: SECTION_STYLES[sec].bg,
                    color: SECTION_STYLES[sec].color,
                   /*  borderColor: SECTION_STYLES[sec].bg,  */
                    fontWeight: '800'
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

        {/* Subcategorías - SOLO SE MUESTRAN SI HAY SECCIÓN SELECCIONADA */}
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

      {/* Contenido Scrollable */}
      <div className="projects-section">
        <div className={`projects-scrollable-content ${section === 'All' ? 'no-selection' : ''}`}>

          <div className="desktop-hide image-grid masonry">
            <div className="column-project">
              {visible.filter((_, i) => i % 2 === 0).map((item, i) => (
                <div className="image-wrapper" key={i}>
                  <img
                    src={item.url}
                    alt={item.name}
                    className="project-image"
                    onClick={() => navigate(`/project/${item.category}/${item.name}`)}
                  />
                  <div className="image-label-section">{formatName(item.name)}</div>
                  <button 
    className="open-new-tab-btn"
    title="Abrir en nueva pestaña"
    onClick={(e) => {
      e.stopPropagation(); // Evita que se dispare el click de la imagen
      // Detecta si tu app usa HashRouter (#) o rutas limpias
      const prefix = window.location.hash ? '/#' : ''; 
      window.open(`${window.location.origin}${prefix}/project/${item.category}/${item.name}`, '_blank');
    }}
  >
    <FaExternalLinkAlt size={12} />
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
                    onClick={() => navigate(`/project/${item.category}/${item.name}`)}
                  />
                  <div className="image-label-section">{formatName(item.name)}</div>
                   <button 
    className="open-new-tab-btn"
    title="Abrir en nueva pestaña"
    onClick={(e) => {
      e.stopPropagation(); // Evita que se dispare el click de la imagen
      // Detecta si tu app usa HashRouter (#) o rutas limpias
      const prefix = window.location.hash ? '/#' : ''; 
      window.open(`${window.location.origin}${prefix}/project/${item.category}/${item.name}`, '_blank');
    }}
  >
    <FaExternalLinkAlt size={12} />
  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mobile-hide image-list-desktop masonry">
            {visible.map((item, i) => (
              <div className="image-wrapper" key={i}>
                <img
                  src={item.url}
                  alt={item.name}
                  className="project-image"
                  onClick={() => navigate(`/project/${item.category}/${item.name}`)}
                />
                <div className="image-label-section">{formatName(item.name)}</div>
                 <button 
    className="open-new-tab-btn"
    title={tituloOpen}
    onClick={(e) => {
      e.stopPropagation(); // Evita que se dispare el click de la imagen
      // Detecta si tu app usa HashRouter (#) o rutas limpias
      const prefix = window.location.hash ? '/#' : ''; 
      window.open(`${window.location.origin}${prefix}/project/${item.category}/${item.name}`, '_blank');
    }}
  >
    <FaExternalLinkAlt size={12} />
  </button>
              </div>
            ))}
          </div>

        </div>

        {/* Footer */}
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