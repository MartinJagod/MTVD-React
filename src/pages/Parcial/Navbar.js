import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import logoHorizontal from '../../assets/images/logo-horizontal.png';
import logoHorizontalBlack from '../../assets/images/Logo-horizontal-negro.png';
import { LanguageContext } from "../../context/LanguageContext";
// En el componente Navbar

const Navbar = ({ isSliding, menuOpen, setMenuOpen, showInput, setShowInput, page, searchData = [], onSelect = () => { } }) => {
    const { lang, toggleLang } = useContext(LanguageContext);
    const [isBlurred, setIsBlurred] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredOptions, setFilteredOptions] = useState([]);
    const location = useLocation();
    const isHome = location.pathname === '/';

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
        const handleScroll = () => {
            setIsBlurred(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
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

    /*   const handleInputChange = (e) => {
          const term = e.target.value;
          setSearchTerm(term);
          setFilteredOptions(
              options.filter((opt) => opt.toLowerCase().includes(term.toLowerCase()))
          );
      }; */

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const toggleSearch = () => {
        setShowInput(false);
        setSearchTerm('');
    };


    // Determina qué logo usar y el color de los íconos basado en la ruta actual
    const logo = isHome ? logoHorizontal : logoHorizontalBlack;
    const iconColor = isHome ? 'white' : 'black';

    return (
        <div className={`header-navbar ${isBlurred ? '' : 'no-blur'} ${isSliding ? 'navbar-slide-up' : ''} ${isHome ? 'navbar-home' : 'navbar-other'}`}>
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
                        <FaSearch
                            className="search-icon-home-desktop"
                            onClick={handleSearchClick}
                            style={{ color: iconColor, paddingLeft: '10px' }}
                        />
                        <button
                            onClick={toggleLang}
                            className="lang-toggle-btn"
                            style={{
                                marginLeft: "12px",
                                background: "transparent",
                                border: "none",
                                padding: "2px 8px",
                                fontSize: "0.75rem",
                                cursor: "pointer",
                                color: iconColor,
                            }}
                            aria-label="Cambiar idioma"
                        >
                            {lang}
                        </button>
                        <span
                            className="icon"
                            onClick={toggleMenu}
                            style={{ color: iconColor, paddingLeft: '10px' }}
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
