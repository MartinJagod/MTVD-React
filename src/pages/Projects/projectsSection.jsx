import React, { useEffect, useState, useRef, useMemo, useContext } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {subcategoriaProyectosData, subcategoriaProyectosDataES} from './subcategoriasProyectosData';   // ①
import './ProjectsSection.css';
import Navbar from '../Parcial/Navbar';
import ContactFooter from '../Parcial/ContactFooter';
import projectsData from './projectsData';  
import ContactFooterDesktop from '../Parcial/ContactFooterDesktop'; // Ajusta la ruta según tu estructura de carpetas
import API_BASE from '../../apiBase';

import { LanguageContext } from '../../context/LanguageContext';
// fuera del componente, o con useCallback si prefieres
const formatName = (str) =>
  str.replace(/([A-Z])/g, ' $1').trim();

function ProjectsSection() {
   const { lang } = useContext(LanguageContext);   // EN | ES
   const TITLE_MAP = {
  Design:       { EN: 'Design',       ES: 'Diseño' },
  Architecture: { EN: 'Architecture', ES: 'Arquitectura' },
  Branding:     { EN: 'Brands',     ES: 'Marcas' },   // o 'Branding' si prefieres
};
  const [searchParams] = useSearchParams();
  const [category, setCategory] = useState('All');
  const sections = ['Design', 'Architecture', 'Branding'];
  const [section, setSection] = useState('Design');
  const navigate = useNavigate();
  const [filteredImages, setFilteredImages] = useState([]);
  const [fileNameSelected, setFileNameSelected] = useState("");
  const [images, setImages] = useState([]);        // ← antes filteredImages
  const [subcatFilter, setSubcatFilter] = useState('');
  // Estados para control del menú
  const [showInput, setShowInput] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSliding, setIsSliding] = useState(false);
/* helper para deducir la categoría según el id */
const getCategoryById = (id) => {
  if (id <= 5000)  return 'design';
  if (id <= 8000)  return 'architecture';
  return 'branding';           // 8001–10000
};
  
/* ─── Índice de búsqueda que cambia con `section` ─── */
const searchIndex = useMemo(() => {
  return Object.entries(projectsData).flatMap(([idStr, p]) => {
    const id = Number(idStr);
    const category = getCategoryById(id);      // design / architecture / branding

    // Filtramos: solo proyectos de la sección visible
    if (category !== section.toLowerCase()) return [];

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
      category,          // para navegar
      fullText
    }];
  });
}, [section]);

/* ─── ② helper para clave canónica ─── */
const normalize = (str) =>
  str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\.[^/.]+$/, '')    // sin extensión
    .replace(/\d+$/, '')         // sin números finales
    .replace(/[^a-z0-9]/g, '');  // sin espacios ni signos

  /*  const goToProjects = () => {
       navigate("/projectsHome"); // Cambia a la ruta /projects
   };
*/
const proyectosData = lang === "ES"
  ? subcategoriaProyectosDataES
  : subcategoriaProyectosData;


// 2️⃣  Usala en el useMemo
const nameLookup = useMemo(() => {
  const map = {};
  proyectosData.forEach(p => {
    const key = normalize(p.nombre);
    (map[key] ||= []).push({ id: p.id, subCategoria: p.subCategoria });
  });
  return map;
}, [proyectosData]);   // 👈 importante: se recalcula si cambia el idioma

// 3️⃣  Rango de secciones (si querés traducir las claves, hacelo aquí)
const sectionRanges = {
  Design:        [1,    5000],
  Architecture:  [5001, 8000],
  Branding:      [8001, 10000],
};

  /* ─── fetch + enriquecimiento ─── */
  useEffect(() => {
     fetch(`${API_BASE}/projects-home`)
      .then(r => r.json())
      .then(data => {
        const hits = data?.[section.toLowerCase()]?.hits ?? [];

        const [minId, maxId] = sectionRanges[section];    // rango vigente

       const enriched = hits.flatMap(url => {
  const raw   = decodeURIComponent(url.split('/').pop())
                 .replace(/\.[^/.]+$/, '')
                 .replace(/\d+$/, '');
  const key   = normalize(raw);
  const metas = nameLookup[key] || [];          // ← ahora es array
  const meta  = metas.find(m => m.id >= minId && m.id <= maxId);

  if (!meta) return [];                         // no hay coincidencia válida

  return {
    url,
    name: raw,
    id: meta.id,
    subCategoria: meta.subCategoria,
  };
});

        setImages(enriched.sort(() => Math.random() - 0.5));
      })
      .catch(() => setImages([]));
  }, [section, nameLookup]);


  /* ─── filtrado por sub-categoría (siguiente paso) ─── */
  const visible = images.filter(
    (img) => !subcatFilter || img.subCategoria === subcatFilter
  );


  const extractProjectName = (imageUrl) => {
    if (!imageUrl) return '';
    const fileName = decodeURIComponent(imageUrl.substring(imageUrl.lastIndexOf('/') + 1));
    return fileName.replace(/\.[^/.]+$/, '').replace(/\d+$/, '');
  };
  const goToProject = (category, projectName) => {
    navigate(`/project/${category}/${projectName}`);
  };
  useEffect(() => {
    if (menuOpen) {
      const links = document.querySelectorAll('.menu-link');
      const dash = document.querySelector('.menu-dash');

      const timeout = setTimeout(() => {
        links.forEach((link, index) => {
          setTimeout(() => {
            link.classList.add('animate-color');
            dash.className = `menu-dash ${link.classList[1]}`;

            setTimeout(() => {
              link.classList.remove('animate-color');
              if (index === links.length - 1) {
                dash.className = 'menu-dash';
              }
            }, 200);
          }, index * 200);
        });
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [menuOpen]);

  const subcategories = {
    Design: ['Retail', 'Restaurant', 'Office', 'Hotel', 'Mixeduse', 'Mall'],
    Architecture: ['Commercial', 'Office', 'Hotel', 'MixedUse', 'Residential', 'Planning'],
    Branding: ['Design', 'Architecture'],
  };

  // Obtener sección de la URL
  useEffect(() => {
    const sectionFromUrl = searchParams.get('section');
    if (sectionFromUrl && sections.includes(sectionFromUrl)) {
      setSection(sectionFromUrl);
    }
  }, [searchParams]);

  // 🔹 Fetch de imágenes desde la API según la sección
  useEffect(() => {
    console.log("📡 Solicitando imágenes de la API para:", section);

     fetch(`${API_BASE}/projects-home`)
      .then(response => response.json())
      .then(data => {
        console.log("✅ Datos recibidos:", data);

        const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

        const category = data[section.toLowerCase()];

        if (category && category.hits) {
          setFilteredImages(shuffle(category.hits));
        } else {
          setFilteredImages([]);
        }
      })
      .catch(error => {
        console.error("❌ Error al obtener imágenes:", error);
        setFilteredImages([]);
      });
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
      const name = getFileName(firstImage);
      setFileNameSelected(name);
    }
  }, [filteredImages]);


  useEffect(() => {
    setSubcatFilter('');        // al cambiar sección
  }, [section]);
  const subcatsInSection = [...new Set(images.map(i => i.subCategoria))].sort();

  const handleSelectProject = (item) => {
    const slug = encodeURIComponent(item.projectName.replace(/\s+/g, ''));
    navigate(`/project/${item.category}/${slug}`);
    setShowInput(false);           // cierra el buscador si estaba abierto
  };

  return (
    <div className="projects-section">
      <div className="projects-fixed-top">

        {/* Header */}
        <header className="projects-header" style={{ position: 'fixed', top: 0, width: '100%' }}>
          <Navbar
            /* isSliding={isSliding} */
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            showInput={showInput}
            setShowInput={setShowInput}
            page="ProjectsSection"
            searchData={searchIndex}          /* ← índice filtrado */
            onSelect={handleSelectProject}
          />
        </header>

        {/* Section Selector */}
        <div className="section-selector-projects">
          <div className="mobile-hide section-selector-projects desktop-menu-projetcs   ">
            <nav className="menu-items-split-desktop">
              <div className="menu-left-projects">
                <button
                  className={`menu-link-desktop active`}
                  onClick={() => setSection(section)}
                >
                  {TITLE_MAP[section][lang]}
                </button>
              </div>
              <div className="menu-right-projects">
                {['Design', 'Architecture', 'Branding']
                  .filter((sec) => sec !== section)
                  .map((sec) => (
                    <button
                      key={sec}
                      className={` menu-link-desktop`}
                      onClick={() => setSection(sec)}
                    >
                       {TITLE_MAP[sec][lang]}
                    </button>
                  ))}
              </div>
            </nav>
          </div>


          <select
            className=" desktop-hide section-input-section"
            value={section}
            onChange={(e) => {
              setSection(e.target.value);
            }}
          >
            {sections.map((sec, index) => (
              <option className='section-input-section-option' key={index} value={sec}>
                 {TITLE_MAP[sec][lang]}
              </option>
            ))}
          </select>

          <Link to="/projectsHome" className=" desktop-hide filter-selector">
             {lang === 'ES' ? 'Todos' : 'All'}
          </Link>
        </div>

        {/* Subcategories */}
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


      <div className="projects-section">
        <div className="projects-scrollable-content">


          {/* Grid móvil masonry a dos columnas */}
          <div className="desktop-hide image-grid masonry">
            <div className="column-project">
              {visible.filter((_, i) => i % 2 === 0).map(({ url, name }, i) => (
                <div className="image-wrapper" key={i}>
                  <img
                    src={url}
                    alt={name}
                    className="project-image"
                    onClick={() => navigate(`/project/${section}/${name}`)}
                  />
                  <div className="image-label-section">{formatName(name)}</div>
                </div>
              ))}
            </div>

            <div className="column-project">
              {visible.filter((_, i) => i % 2 !== 0).map(({ url, name }, i) => (
                <div className="image-wrapper" key={i}>
                  <img
                    src={url}
                    alt={name}
                    className="project-image"
                    onClick={() => navigate(`/project/${section}/${name}`)}
                  />
                  <div className="image-label-section">{formatName(name)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Grid desktop de una sola columna (o masonry) */}
          <div className="mobile-hide image-list-desktop masonry">
            {visible.map(({ url, name }, i) => (
              <div className="image-wrapper" key={i}>
                <img
                  src={url}
                  alt={name}
                  className="project-image"
                  onClick={() => navigate(`/project/${section}/${name}`)}
                />
                <div className="image-label-section">{formatName(name)}</div>
              </div>
            ))}
          </div>

        </div>

        {/* Footer */}
        <div>
         
                <footer className="studio-footer mobile-hide">
                <ContactFooterDesktop />
            </footer>
            {/* Pie de página */}
            <footer className="studio-footer desktop-hide">
                <ContactFooter />
            </footer>
        </div>
      </div>
    </div>
  );
}

export default ProjectsSection;
