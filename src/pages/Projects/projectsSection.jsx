import React, { useEffect, useState, useRef, useMemo, useContext } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { subcategoriaProyectosData, subcategoriaProyectosDataES } from './subcategoriasProyectosData';
import './projectsHome.css';
import './ProjectsSection.css';

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
  str.replace(/([A-Z])/g, ' $1').trim();

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
    Design:       { bg: '#FEC93A', color: '#333' }, // Amarillo - Texto oscuro
    Architecture: { bg: '#3B76F3', color: '#333' }, // Azul - Texto blanco
    Branding:     { bg: '#44B87E', color: '#333' }, // Verde - Texto blanco
  };

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Estado principal: 'Design', 'Architecture', 'Branding' o 'All'
  const [section, setSection] = useState('All');

  // Estados de datos
  const [images, setImages] = useState([]);         
  const [filteredImages, setFilteredImages] = useState([]); 
  const [subcatFilter, setSubcatFilter] = useState('');
  const [fileNameSelected, setFileNameSelected] = useState("");

  // Estados de UI
  const [showInput, setShowInput] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Refs
  const isSliding = useRef(false);

  // --- HELPERS ---

  /* Deduce la categoría según el ID del proyecto */
  const getCategoryById = (id) => {
    if (id <= 5000) return 'design';
    if (id <= 8000) return 'architecture';
    return 'branding'; // 8001–10000
  };

  /* Normaliza cadenas para búsqueda/comparación */
  const normalize = (str) =>
    str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') 
      .replace(/\.[^/.]+$/, '')        
      .replace(/\d+$/, '')             
      .replace(/[^a-z0-9]/g, '');      

  // --- MEMOS ---

  /* Índice de búsqueda para la Navbar */
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

  /* Datos de subcategorías según idioma */
  const proyectosDataLocal = lang === "ES"
    ? subcategoriaProyectosDataES
    : subcategoriaProyectosData;

  /* Mapa de búsqueda rápida para metadatos */
  const nameLookup = useMemo(() => {
    const map = {};
    proyectosDataLocal.forEach(p => {
      const key = normalize(p.nombre);
      (map[key] ||= []).push({ id: p.id, subCategoria: p.subCategoria });
    });
    return map;
  }, [proyectosDataLocal]);

  // Rangos de ID por sección
  const sectionRanges = {
    Design:       [1, 5000],
    Architecture: [5001, 8000],
    Branding:     [8001, 10000],
  };

  // --- EFECTOS ---

  /* 1. Carga de proyectos desde la API */
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
          const raw = decodeURIComponent(url.split('/').pop())
            .replace(/\.[^/.]+$/, '')
            .replace(/\d+$/, '');
          
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

  /* 2. Fetch secundario (Backup) */
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

  /* 3. Actualizar fileNameSelected */
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

  /* 4. Limpiar filtro de subcategoría */
  useEffect(() => {
    setSubcatFilter('');
  }, [section]);

  /* 5. Animación del menú */
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

  /* 6. Leer sección de la URL */
  useEffect(() => {
    const sectionsList = ['Design', 'Architecture', 'Branding'];
    const sectionFromUrl = searchParams.get('section');
    if (sectionFromUrl && sectionsList.includes(sectionFromUrl)) {
      setSection(sectionFromUrl);
    }
  }, [searchParams]);


  // --- HANDLERS ---

  const handleSelectProject = (item) => {
    const slug = encodeURIComponent(item.projectName.replace(/\s+/g, ''));
    navigate(`/project/${item.category}/${slug}`);
    setShowInput(false);
  };

  const toggleSection = (sec) => {
    if (section === sec) {
      setSection('All'); 
    } else {
      setSection(sec);
    }
  };

  const visible = images.filter(
    (img) => !subcatFilter || img.subCategoria === subcatFilter
  );
  
  const subcatsInSection = [...new Set(images.map(i => i.subCategoria))].sort();

  return (
    <div className="projects-section">
      <div className="projects-fixed-top">

        {/* Header */}
        <header className="projects-header" style={{ position: 'fixed', top: 0, width: '100%' }}>
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
          {/* Se eliminaron los estilos inline que forzaban el centrado */}
          <div className="desktop-menu-projetcs">
            <nav className="menu-items-split-desktop">
              <div className="menu-left-projects">
                {['Design', 'Architecture', 'Branding'].map((sec) => {
                  const isActive = section === sec;
                  
                  // Estilos dinámicos
                  const style = isActive ? {
                    backgroundColor: SECTION_STYLES[sec].bg,
                    color: SECTION_STYLES[sec].color,
                    borderColor: SECTION_STYLES[sec].bg, 
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

        {/* Subcategorías */}
        <div className="subcategories">
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

      </div>

      {/* Contenido Scrollable */}
      <div className="projects-section">
        <div className="projects-scrollable-content">

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