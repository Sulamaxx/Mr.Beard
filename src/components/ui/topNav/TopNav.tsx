import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './TopNav.scss';
import logo from '/src/assets/images/logo.svg'; // Adjust the path as needed
import defaultAvatar from '/src/assets/images/profile/user_avatar.png'; // Add default avatar

interface TopNavProps {
  primaryColor?: string;
}

// Define the User interface based on the provided data structure
interface User {
  id: number;
  name: string;
  email: string;
  mobile: string;
  role: string | null;
  profile_picture?: string;
}

const TopNav: React.FC<TopNavProps> = ({ primaryColor = '#000' }) => {
  const location = useLocation();
  const [activePage, setActivePage] = useState<string>('');
  const [isSideMenuOpen, setIsSideMenuOpen] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string>(defaultAvatar);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if user is logged in by looking for the user item in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        // Set profile image URL
        if (parsedUser.profile_picture && parsedUser.profile_picture !== 'default_avatar.png') {
          const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
          setProfileImageUrl(`${baseUrl}/storage/${parsedUser.profile_picture}`);
        } else {
          setProfileImageUrl(defaultAvatar);
        }
      } catch (error) {
        console.error('Failed to parse user data:', error);
        setUser(null);
        setProfileImageUrl(defaultAvatar);
      }
    }
  }, []);

  useEffect(() => {
    // Extract the current path from the location
    const path = location.pathname.split('/')[1].toLowerCase();
    setActivePage(path || ''); // Default to 'beard' if on homepage
    
    // Close the side menu when route changes
    setIsSideMenuOpen(false);
    // Close the dropdown when route changes
    setIsDropdownOpen(false);
  }, [location]);

  // Handle click outside to close menu and dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Handle side menu close
      if (isSideMenuOpen && !target.closest('.top-nav__side-menu') && !target.closest('.top-nav__toggle')) {
        setIsSideMenuOpen(false);
      }
      
      // Handle dropdown close
      if (isDropdownOpen && dropdownRef.current && !dropdownRef.current.contains(target) && 
          !target.closest('.user-dropdown-toggle')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSideMenuOpen, isDropdownOpen]);

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

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSignOut = () => {
    // Remove user from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    // Update user state
    setUser(null);
    setProfileImageUrl(defaultAvatar);
    // Close dropdown
    setIsDropdownOpen(false);
  };

  // Function to trim name for desktop view
  const getTrimmedName = (fullName: string): string => {
    const nameParts = fullName.trim().split(' ');
    return nameParts[0]; // Return only the first name
  };

  const handleProfileImageError = () => {
    setProfileImageUrl(defaultAvatar);
  };

  const navItems = [
    { name: 'BEARD', path: '/beard' },
    { name: 'HAIR', path: '/hair' },
    { name: 'ACCESSORIES', path: '/accessories' },
    { name: 'APPAREL', path: '/apparel' },
    { name: 'CONTACT', path: '/contact' },
    { name: 'ABOUT', path: '/about' },
    { name: 'CART', path: '/cart' },
    // Sign In link will be conditionally rendered based on login status
    { name: 'WISHLIST', path: '/wishlist' }
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
                activePage === item.path.substring(1)
                  ? "top-nav__item--active"
                  : ""
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

          {/* Auth nav item - conditionally rendered based on login status */}
          {user ? (
            <div className="user-dropdown-container" ref={dropdownRef}>
              <button
                className={`top-nav__item user-dropdown-toggle user-dropdown-with-avatar ${
                  isDropdownOpen ? "top-nav__item--active" : ""
                }`}
                onClick={toggleDropdown}
                style={isDropdownOpen ? { color: primaryColor } : undefined}
              >
                <div className="user-info-desktop">
                  <span className="user-name-desktop">
                    {getTrimmedName(user.name).toUpperCase()}
                  </span>
                  <img 
                    src={profileImageUrl} 
                    alt="Profile" 
                    className="user-avatar"
                    onError={handleProfileImageError}
                  />
                </div>
              </button>

              {isDropdownOpen && (
                <div className="user-dropdown-menu">
                  <Link
                    to="/profile"
                    className="user-dropdown-item"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    My Profile
                  </Link>
                  <Link
                    to={"orders"}
                    className="user-dropdown-item"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    My Orders
                  </Link>
                  <button
                    className="user-dropdown-item"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/signin"
              className={`top-nav__item ${
                activePage === "signin" ? "top-nav__item--active" : ""
              }`}
              style={
                activePage === "signin" ? { color: primaryColor } : undefined
              }
            >
              SIGN IN
            </Link>
          )}
        </div>

        {/* Mobile toggle button */}
        <button
          className={`top-nav__toggle ${
            isSideMenuOpen ? "top-nav__toggle--active" : ""
          }`}
          onClick={toggleSideMenu}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Side menu for mobile */}
      <div
        className={`top-nav__side-menu-overlay ${
          isSideMenuOpen ? "top-nav__side-menu-overlay--active" : ""
        }`}
      ></div>
      <div
        className={`top-nav__side-menu ${
          isSideMenuOpen ? "top-nav__side-menu--active" : ""
        }`}
      >
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
                activePage === item.path.substring(1)
                  ? "top-nav__side-menu-item--active"
                  : ""
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

          {/* Auth nav items in side menu - mobile keeps full name */}
          {user ? (
            <>
              <div className="side-menu-user-header">
                {user.name.toUpperCase()}
              </div>
              <Link
                to="/profile"
                className={`top-nav__side-menu-item ${
                  activePage === 'profile' ? 'top-nav__side-menu-item--active' : ''
                }`}
                style={
                  activePage === 'profile'
                    ? { color: primaryColor }
                    : undefined
                }
                onClick={() => setIsSideMenuOpen(false)}
              >
                MY PROFILE
              </Link>
              <Link
                to="/orders"
                className={`top-nav__side-menu-item ${
                  activePage === 'user_account' ? 'top-nav__side-menu-item--active' : ''
                }`}
                style={
                  activePage === 'orders'
                    ? { color: primaryColor }
                    : undefined
                }
                onClick={() => setIsSideMenuOpen(false)}
              >
                MY ORDERS
              </Link>
              <button
                className="top-nav__side-menu-item sign-out-button"
                onClick={() => {
                  handleSignOut();
                  setIsSideMenuOpen(false);
                }}
              >
                SIGN OUT
              </button>
            </>
          ) : (
            <Link
              to="/signin"
              className={`top-nav__side-menu-item ${
                activePage === "signin" ? "top-nav__side-menu-item--active" : ""
              }`}
              style={
                activePage === "signin" ? { color: primaryColor } : undefined
              }
              onClick={() => setIsSideMenuOpen(false)}
            >
              SIGN IN
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default TopNav;