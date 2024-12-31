import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import logoHorizontal from '../../assets/images/logo-horizontal.png';
const Navbar = () => {
    const [isBlurred, setIsBlurred] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);
    const [showInput, setShowInput] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredOptions, setFilteredOptions] = useState([]);
    const options = ['Architecture', 'Awards', 'Asphalt', 'Aluminum', 'Aggregate', 'Asbestos', 'Adhesive', 'Anchor', 'Acrylic', 'Acoustic'];

    useEffect(() => {
        // Maneja el cambio de scroll para agregar/quitar el efecto de blur
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

    const handleSearchClick = () => {
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
    return (
        <div className={`header-navbar ${isBlurred ? "" : "no-blur"}`}>
            <div className="header-content">
                <Link to="/">
                    <img src={logoHorizontal} alt="Logo Horizontal" className="logo-img" />
                </Link>
                <div className="icons">
                    <FaSearch className="search-icon-home" onClick={handleSearchClick} />
                    <span className="icon" onClick={toggleMenu}>☰</span>
                </div>
            </div>
            <div className={`hamburger-menu ${menuOpen ? 'menu-open' : 'menu-close'}`}>
                <div className="menu-header">
                    <span className="menu-close-icon" onClick={() => setMenuOpen(false)}>✖</span>
                </div>
                <nav className="menu-items">
                    <Link to="/projectsHome" className="menu-link projects">Projects</Link>
                    <a href="#press-awards" className="menu-link press-awards">Press & Awards</a>
                    <a href="#studio" className="menu-link studio">Studio</a>
                    <Link to="/projects" className="menu-link contact">Contact</Link>
                    <span className="menu-dash"></span>
                </nav>
                <div className="menu-footer"></div>
            </div>

            <div className={`search-container ${showInput ? 'search-open' : ''}`}>
                <div className="search-bar">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleInputChange}
                    />
                    <span className="close-icon" onClick={handleSearchClick}>✖</span>
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
