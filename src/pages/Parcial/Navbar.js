import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import './Navbar.css';
import logoHorizontal from '../../assets/images/logo-horizontal.png';
import logoHorizontalBlack from '../../assets/images/Logo-horizontal-negro.png';
import { LanguageContext } from "../../context/LanguageContext";

// En el componente Navbar
const Navbar = ({ isSliding, menuOpen, setMenuOpen, showInput, setShowInput, page, searchData = [], onSelect = () => { } }) => {
    const { lang, toggleLang } = useContext(LanguageContext);
    const [isBlurred, setIsBlurred] = useState(false); // Iniciar en false (sin blur) si estamos arriba
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredOptions, setFilteredOptions] = useState([]);
    const location = useLocation();

    // CORRECCIÓN: Usamos 'page' como respaldo para asegurar que detecte el Home
    // Esto soluciona el problema de que se vea blanca si la ruta varía ligeramente
    // Se añade validación para HashRouter (/#/)
    const isHome = location.pathname === '/' || location.pathname === '/#' || page === 'Home';

    const [hideOnScroll, setHideOnScroll] = useState(false);
    const lastScrollY = useRef(0);
    
    // Referencias para el menú y el buscador
    const menuRef = useRef(null);
    const searchRef = useRef(null);

    // --------------------- efecto: refrescar opciones cuando cambie la página ---------------------
    useEffect(() => {
        setFilteredOptions([]);       // limpia resultados al cambiar de sección
        setSearchTerm('');
    }, [page]);

    // --------------------- filtro en cada pulsación ---------------------
    const handleInputChange = (e) => {
        // texto que ve el usuario
        setSearchTerm(e.target.value);

        // normalizamos (tildes → none, minúsculas)
        const norm = (str) =>
            str.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

        const tokens = norm(e.target.value).split(/\s+/).filter(Boolean);

        const hayQueCoincidir = (item) => {
            const base =
                item.fullText ??
                norm(typeof item === 'string' ? item : item.label ?? '');
            return tokens.every(t => base.includes(t));
        };

        setFilteredOptions(searchData.filter(hayQueCoincidir));
    };

    useEffect(() => {
        const THRESHOLD_HIDE = 0;   // ← 0 px: basta con un solo tick
        const THRESHOLD_SHOW = 3;   // ← sube 3 px y ya aparece

        const handleScroll = () => {
            const y = window.scrollY;
            const prevY = lastScrollY.current;
if (page == 'ProjectsSection') {
                setHideOnScroll(false);
                return; // Detiene la ejecución aquí, ignorando el scroll
            }
            if (page == 'projectsHome') {
                setHideOnScroll(false);
                return; // Detiene la ejecución aquí, ignorando el scroll
            }
            // Blur si pasas 10 px (opcional)
            setIsBlurred(y > 10);

            /* ↙️ Bajas → ocultar */
            if (y > prevY && y > THRESHOLD_HIDE) {
                setHideOnScroll(true);
            }
            /* ↗️ Subes → mostrar */
            else if (y < prevY - THRESHOLD_SHOW) {
                setHideOnScroll(false);
            }

            lastScrollY.current = y;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);


    useEffect(() => {
        const handleClickOutside = (event) => {
            // Si el menú está abierto y el clic no fue dentro del menú, cerrarlo
            if (menuOpen && menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }

            // Si el buscador está abierto y el clic no fue dentro del buscador, cerrarlo
            if (showInput && searchRef.current && !searchRef.current.contains(event.target)) {
                setShowInput(false);
                setSearchTerm('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [menuOpen, showInput]);

    const handleSearchClick = (event) => {
        event.stopPropagation(); // Detiene la propagación del evento al manejador global
        setShowInput(prevState => !prevState);
        if (!showInput) {
            setSearchTerm('');
        }
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const toggleSearch = () => {
        setShowInput(false);
        setSearchTerm('');
    };


    // Determina qué logo usar y el color de los íconos basado en la ruta actual
    // Si es Home (isHome true) -> Logo blanco y texto blanco
    const logo = isHome ? logoHorizontal : logoHorizontalBlack;
    const iconColor = isHome ? 'white' : 'black';

    return (
        <div className={`header-navbar 
        ${isBlurred ? 'blur' : 'no-blur'} 
         ${hideOnScroll ? 'navbar-slide-up' : ''}
        ${isSliding ? 'navbar-slide-up' : ''} 
        ${isHome ? 'navbar-home' : 'navbar-other'}`} // Aquí aplica la clase correcta
        >
            <div className="header-content">
                <Link to="/">
                    <img src={logo} alt="Logo Horizontal" className="logo-img" />
                </Link>
                <div style={{ display: 'flex', alignItems: 'center' }}>

                    {/* Menú horizontal para desktop */}
                    <div className="desktop-menu">
                        <nav className="menu-items" >
                            <Link to="/projectsHome" className="menu-link-desktop projects" style={{ color: iconColor }}>
                                {lang === 'ES' ? 'Proyectos' : 'Projects'}
                            </Link>
                            <Link to="/awardsandpress" className="menu-link-desktop press-awards" style={{ color: iconColor }}>
                                {lang === 'ES' ? 'Prensa y Premios' : 'Press & Awards'}
                            </Link>
                            <Link to="/studio" className="menu-link-desktop studio" style={{ color: iconColor }}>
                                {lang === 'ES' ? 'Estudio' : 'Studio'}
                            </Link>
                            <Link to="/contact" className="menu-link-desktop contact" style={{ color: iconColor }}>
                                {lang === 'ES' ? 'Contacto' : 'Contact'}
                            </Link>
                        </nav>
                    </div>
                    <div className="icons" style={{ display: 'flex', alignItems: 'center', justifyItems: 'center' }}>
                        <button
                            onClick={toggleLang}
                            className="lang-toggle-btn idiomaNavbar"
                            style={{
                                color: iconColor,
                            }}
                            aria-label="Cambiar idioma"
                        >
                            {lang}
                        </button>
                        <FaSearch
                            className="search-icon-home-desktop"
                            onClick={handleSearchClick}
                            style={{ color: iconColor }}
                        />
                        <span
                            className="icon"
                            onClick={toggleMenu}
                            style={{ color: iconColor }}
                        >
                            ☰
                        </span>
                    </div>
                </div>


                {/* Menú hamburguesa */}
                <div className={`hamburger-menu ${menuOpen ? 'menu-open' : 'menu-close'}`} ref={menuRef}>
                    <div className="menu-header">
                        <span className="menu-close-icon" onClick={toggleMenu}>✖</span>
                    </div>
                    <nav className="menu-items">
                        <Link to="/projectsHome" className="menu-link projects">
                            {lang === 'ES' ? 'Proyectos' : 'Projects'}
                        </Link>
                        <Link to="/awardsandpress" className="menu-link press-awards">
                            {lang === 'ES' ? 'Prensa y Premios' : 'Press & Awards'}
                        </Link>
                        <Link to="/studio" className="menu-link studio">
                            {lang === 'ES' ? 'Estudio' : 'Studio'}
                        </Link>
                        <Link to="/contact" className="menu-link contact">
                            {lang === 'ES' ? 'Contacto' : 'Contact'}
                        </Link>
                        <span className="menu-dash"></span>
                    </nav>
                    <div className="menu-footer"></div>
                </div>

                {/* Contenedor de búsqueda */}
                <div className={`search-container ${showInput ? 'search-open' : ''}`} ref={searchRef}>
                    <div className="search-bar">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={handleInputChange}
                        />
                        <span className="menu-close-icon" onClick={toggleSearch}>✖</span>
                    </div>
                    {showInput && searchTerm && (
                        <div className="search-menu">
                            {filteredOptions.length > 0 ? (
                                <ul>
                                    {filteredOptions.map((item, idx) => (
                                        <li key={idx} onClick={() => onSelect(item)}>
                                            {item.label ?? item}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="no-results">No results found</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;