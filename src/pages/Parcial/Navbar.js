import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import logoHorizontal from '../../assets/images/logo-horizontal.png';
import logoHorizontalBlack from '../../assets/images/Logo-horizontal-negro.png';

// En el componente Navbar

const Navbar = ({ isSliding, menuOpen, setMenuOpen, showInput, setShowInput }) => {
    const [isBlurred, setIsBlurred] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredOptions, setFilteredOptions] = useState([]);
    const options = ['Architecture', 'Awards', 'Asphalt', 'Aluminum', 'Aggregate', 'Asbestos', 'Adhesive', 'Anchor', 'Acrylic', 'Acoustic'];
    
    const location = useLocation(); // Detecta la ruta actual
    const isHome = location.pathname === '/'; // Verifica si estás en el home

    // Referencias para el menú y el buscador
    const menuRef = useRef(null);
    const searchRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsBlurred(true);
            } else {
                setIsBlurred(false);
            }
        };
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuOpen && menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }

            if (showInput && searchRef.current && !searchRef.current.contains(event.target)) {
                setShowInput(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuOpen, showInput, setMenuOpen, setShowInput]);

    const handleSearchClick = (event) => {
        event.stopPropagation(); // Detiene la propagación del evento al manejador global
        setShowInput(!showInput);
    };

    const handleInputChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        setFilteredOptions(options.filter((opt) => opt.toLowerCase().includes(term.toLowerCase())));
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const toggleSearch = () => {
        setShowInput(!showInput);
    };

    // Determina qué logo usar y el color de los íconos basado en la ruta actual
    const logo = location.pathname === '/' ? logoHorizontal : logoHorizontalBlack;
    const iconColor = location.pathname === '/' ? 'white' : 'black';

    return (
        <div     className={`header-navbar ${isBlurred ? '' : 'no-blur'} ${isSliding ? 'navbar-slide-up' : ''} ${
            isHome ? 'navbar-home' : 'navbar-other'
        }`}
    >
            <div className="header-content">
                <Link to="/">
                    <img src={logo} alt="Logo Horizontal" className="logo-img" />
                </Link>
                <div className="icons">
                    <FaSearch
                        className="search-icon-home"
                        onClick={handleSearchClick}
                        style={{ color: iconColor }} // Cambia el color del ícono
                    />
                    <span
                        className="icon"
                        onClick={toggleMenu}
                        style={{ color: iconColor }} // Cambia el color del ícono
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
                    <Link to="/projectsHome" className="menu-link projects">Projects</Link>
                    <Link to="/awardsandpress" className="menu-link press-awards">Press & Awards</Link>
                    <Link to="/studio" className="menu-link studio">Studio</Link>
                    <Link to="/contact" className="menu-link contact">Contact</Link>
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
                {searchTerm && (
                    <div className="search-menu">
                        {filteredOptions.length > 0 ? (
                            <ul>
                                {filteredOptions.map((option, index) => (
                                    <li key={index}>{option}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="no-results">No results found</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
