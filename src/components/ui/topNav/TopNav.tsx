import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './TopNav.scss';
import logo from '/src/assets/images/logo.svg'; // Adjust the path as needed

interface TopNavProps {
  primaryColor?: string;
}

const TopNav: React.FC<TopNavProps> = ({ primaryColor = '#000' }) => {
  const location = useLocation();
  const [activePage, setActivePage] = useState<string>('');
  const [isSideMenuOpen, setIsSideMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    // Extract the current path from the location
    const path = location.pathname.split('/')[1].toLowerCase();
    setActivePage(path || ''); // Default to 'beard' if on homepage
    
    // Close the side menu when route changes
    setIsSideMenuOpen(false);
  }, [location]);

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isSideMenuOpen && !target.closest('.top-nav__side-menu') && !target.closest('.top-nav__toggle')) {
        setIsSideMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSideMenuOpen]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isSideMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSideMenuOpen]);

  const toggleSideMenu = () => {
    setIsSideMenuOpen(!isSideMenuOpen);
  };

  const navItems = [
    { name: 'BEARD', path: '/beard' },
    { name: 'HAIR', path: '/hair' },
    { name: 'ACCESSORIES', path: '/accessories' },
    { name: 'APPAREL', path: '/apparel' },
    { name: 'CONTACT', path: '/contact' },
    { name: 'ABOUT', path: '/about' },
    { name: 'CART', path: '/cart' },
    // { name: 'WISHLIST', path: '/wishlist' }
  ];

  return (
    <nav className="top-nav">
      <div className="top-nav__container rounded-5 p-1 px-4">
        <div className="top-nav__logo">
          <Link to="/">
            <img src={logo} alt="Mr. Beard Logo" />
          </Link>
        </div>
        
        {/* Desktop menu */}
        <div className="top-nav__menu">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`top-nav__item ${
                activePage === item.path.substring(1) ? 'top-nav__item--active' : ''
              }`}
              style={
                activePage === item.path.substring(1)
                  ? { color: primaryColor }
                  : undefined
              }
            >
              {item.name}
            </Link>
          ))}
        </div>
        
        {/* Mobile toggle button */}
        <button 
          className={`top-nav__toggle ${isSideMenuOpen ? 'top-nav__toggle--active' : ''}`}
          onClick={toggleSideMenu}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      
      {/* Side menu for mobile */}
      <div className={`top-nav__side-menu-overlay ${isSideMenuOpen ? 'top-nav__side-menu-overlay--active' : ''}`}></div>
      <div className={`top-nav__side-menu ${isSideMenuOpen ? 'top-nav__side-menu--active' : ''}`}>
        <div className="top-nav__side-menu-header">
          <div className="top-nav__logo">
            <Link to="/" onClick={() => setIsSideMenuOpen(false)}>
              <img src={logo} alt="Mr. Beard Logo" />
            </Link>
          </div>
          <button 
            className="top-nav__close"
            onClick={() => setIsSideMenuOpen(false)}
            aria-label="Close navigation menu"
          >
            &times;
          </button>
        </div>
        <div className="top-nav__side-menu-items">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`top-nav__side-menu-item ${
                activePage === item.path.substring(1) ? 'top-nav__side-menu-item--active' : ''
              }`}
              style={
                activePage === item.path.substring(1)
                  ? { color: primaryColor }
                  : undefined
              }
              onClick={() => setIsSideMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default TopNav;