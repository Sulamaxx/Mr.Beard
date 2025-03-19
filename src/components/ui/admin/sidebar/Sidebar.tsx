import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.scss";

interface SidebarProps {
  activeItem?: string;
}

const closeSidebar = () => {
  document.getElementById("admin-sidebar").classList.toggle("sidebar-open");
};

const Sidebar: React.FC<SidebarProps> = ({ activeItem = "dashboard" }) => {
  return (
    <div className="admin-sidebar" id="admin-sidebar">
      <div className="sidebar-header">
        <div className="row">
          <div className="sidebar-brand col-auto">
            <span className="sidebar-icon">
              <i className="bi bi-grid"></i>
            </span>
            DASHBOARD
          </div>
          <div className="col text-end">
            <button
              className="sidebar-close btn btn-secondary py-0 px-2"
              onClick={() => {
                closeSidebar();
              }}        
            >
              <i className="bi bi-x-lg fs-2"></i>
            </button>
          </div>
        </div>
      </div>
      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          <li className="sidebar-menu-item">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={() => {
                closeSidebar();
              }}
            >
              <span className="sidebar-icon">
                <i className="bi bi-grid"></i>
              </span>
              DASHBOARD
            </NavLink>
          </li>
          <li className="sidebar-menu-item">
            <NavLink
              to="/admin/products"
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={() => {
                closeSidebar();
              }}            >
              <span className="sidebar-icon">
                <i className="bi bi-box"></i>
              </span>
              ALL PRODUCTS
            </NavLink>
          </li>
          <li className="sidebar-menu-item">
            <NavLink
              to="/admin/orders"
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={() => {
                closeSidebar();
              }}            >
              <span className="sidebar-icon">
                <i className="bi bi-file-text"></i>
              </span>
              ORDER LIST
            </NavLink>
          </li>
          <li className="sidebar-menu-item">
            <NavLink
              to="/admin/users"
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={() => {
                closeSidebar();
              }}            >
              <span className="sidebar-icon">
                <i className="bi bi-person"></i>
              </span>
              USER LIST
            </NavLink>
          </li>
          <li className="sidebar-menu-item">
            <NavLink
              to="/admin/order-history"
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={() => {
                closeSidebar();
              }}            >
              <span className="sidebar-icon">
                <i className="bi bi-clock-history"></i>
              </span>
              ORDER HISTORY
            </NavLink>
          </li>
          <li className="sidebar-menu-item">
            <NavLink
              to="/admin/gallery"
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={() => {
                closeSidebar();
              }}            >
              <span className="sidebar-icon">
                <i className="bi bi-images"></i>
              </span>
              PHOTO GALLERY
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
