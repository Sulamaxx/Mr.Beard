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
  user_type?: 'admin' | 'staff' | 'customer'; // Add user_type field
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

  // Get user type display text
  const getUserTypeDisplay = () => {
    if (!user) return 'USER';
    
    switch (user.user_type) {
      case 'admin':
        return 'ADMIN';
      case 'staff':
        return 'STAFF';
      case 'customer':
        return 'USER';
      default:
        return user.role ? user.role.toUpperCase() : 'USER';
    }
  };

  // Get appropriate dashboard link based on user type
  const getDashboardLink = () => {
    if (!user) return '/';
    
    switch (user.user_type) {
      case 'admin':
        return '/admin';
      case 'staff':
        return '/admin/orders';
      case 'customer':
      default:
        return '/';
    }
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
        <div className="topbar-user" ref={dropdownRef}>
          <div className={`dropdown ${isDropdownOpen ? 'show' : ''}`}>
            <button 
              className="dropdown-toggle" 
              type="button" 
              id="userDropdown" 
              onClick={toggleDropdown}
              aria-expanded={isDropdownOpen}
            >
              {getUserTypeDisplay()} {user ? `- ${user.name}` : ''}
              <i className="bi bi-chevron-down ms-1"></i>
            </button>
            <ul className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`} aria-labelledby="userDropdown">
              {/* Dashboard/Home link based on user type */}
              <li>
                <Link 
                  to={getDashboardLink()} 
                  className="dropdown-item"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <i className="bi bi-house me-2"></i>
                  {user?.user_type === 'admin' ? 'Dashboard' : 
                   user?.user_type === 'staff' ? 'Orders' : 'Home'}
                </Link>
              </li>
              
              {/* Profile and Settings - Show for admin and staff */}
              {(user?.user_type === 'admin' || user?.user_type === 'staff') && (
                <>
                  {/* <li>
                    <Link 
                      to="/admin/profile" 
                      className="dropdown-item"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <i className="bi bi-person me-2"></i>
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/admin/settings" 
                      className="dropdown-item"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <i className="bi bi-gear me-2"></i>
                      Settings
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li> */}
                </>
              )}
              
              {/* User info section */}
              {user && (
                <>
                  <li className="dropdown-item-text">
                    <small className="text-muted">
                      Signed in as<br />
                      <strong>{user.email}</strong>
                    </small>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                </>
              )}
              
              {/* Logout */}
              <li>
                <button 
                  className="dropdown-item text-danger" 
                  onClick={handleSignOut}
                >
                  <i className="bi bi-box-arrow-right me-2"></i>
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