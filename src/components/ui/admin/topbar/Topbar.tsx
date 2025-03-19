import React from 'react';
import { Link } from 'react-router-dom';
import './Topbar.scss';

const Topbar: React.FC = () => {
  return (
    <div className="admin-topbar">
      <div className="topbar-left">
       <button className="sidebar-toggle btn btn-secondary py-0" onClick={()=>{
            document.getElementById('admin-sidebar').classList.toggle('sidebar-open');
       }}>
        <i className="bi bi-list fs-2"></i>
       </button>
      </div>
      <div className="topbar-right">
        <div className="topbar-search">
          <button className="search-btn">
            <i className="bi bi-search"></i>
          </button>
        </div>
        <div className="topbar-notification">
          <button className="notification-btn">
            <i className="bi bi-bell"></i>
          </button>
        </div>
        <div className="topbar-user">
          <div className="dropdown">
            <button className="dropdown-toggle" type="button" id="adminDropdown" data-bs-toggle="dropdown" aria-expanded="false">
              ADMIN
              <i className="bi bi-chevron-down ms-1"></i>
            </button>
            <ul className="dropdown-menu" aria-labelledby="adminDropdown">
              <li><Link to="/admin/profile" className="dropdown-item">Profile</Link></li>
              <li><Link to="/admin/settings" className="dropdown-item">Settings</Link></li>
              <li><hr className="dropdown-divider" /></li>
              <li><Link to="/signin" className="dropdown-item">Logout</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;