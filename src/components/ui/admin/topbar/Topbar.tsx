import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Topbar.scss';

// Define the User interface based on the provided data structure
interface User {
  id: number;
  name: string;
  email: string;
  mobile: string;
  role: string | null;
}

const Topbar: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in by looking for the user item in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse user data:', error);
        setUser(null);
      }
    }
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Handle dropdown close
      if (isDropdownOpen && dropdownRef.current && !dropdownRef.current.contains(target) && 
          !target.closest('.dropdown-toggle')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSignOut = () => {
    // Remove user from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    // Update user state
    setUser(null);
    // Close dropdown
    setIsDropdownOpen(false);
    
    navigate('/signin'); // Redirect to sign-in page
  };

  return (
    <div className="admin-topbar">
      <div className="topbar-left">
        <button 
          className="sidebar-toggle btn btn-secondary py-0" 
          onClick={() => {
            document.getElementById('admin-sidebar')?.classList.toggle('sidebar-open');
          }}
        >
          <i className="bi bi-list fs-2"></i>
        </button>
      </div>
      <div className="topbar-right">
        <div className="topbar-search d-none d-sm-block">
          <button className="search-btn">
            <i className="bi bi-search"></i>
          </button>
        </div>
        <div className="topbar-notification d-none d-sm-block">
          <button className="notification-btn">
            <i className="bi bi-bell"></i>
          </button>
        </div>
        <div className="topbar-user" ref={dropdownRef}>
          <div className={`dropdown ${isDropdownOpen ? 'show' : ''}`}>
            <button 
              className="dropdown-toggle" 
              type="button" 
              id="adminDropdown" 
              onClick={toggleDropdown}
              aria-expanded={isDropdownOpen}
            >
              ADMIN {user ? `- ${user.name}` : ''}
              <i className="bi bi-chevron-down ms-1"></i>
            </button>
            <ul className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`} aria-labelledby="adminDropdown">
              {/* <li><Link to="/admin/profile" className="dropdown-item">Profile</Link></li>
              <li><Link to="/admin/settings" className="dropdown-item">Settings</Link></li>
              <li><hr className="dropdown-divider" /></li> */}
              <li>
                <button 
                  className="dropdown-item" 
                  onClick={handleSignOut}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;