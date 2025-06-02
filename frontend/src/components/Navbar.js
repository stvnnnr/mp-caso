// src/components/Navbar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const activeStyle = {
    fontWeight: 'bold',
    borderBottom: '2px solid var(--mp-blanco)'
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Marca con texto similar al logo del MP */}
        <div className="navbar-brand">
          MINISTERIO PÚBLICO
        </div>

        {/* Enlaces a las secciones */}
        <ul className="nav-list">
          <li>
            <NavLink
              to="/home"
              style={({ isActive }) => (isActive ? activeStyle : undefined)}
            >
              Inicio
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/cases"
              style={({ isActive }) => (isActive ? activeStyle : undefined)}
            >
              Casos
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/cases/create"
              style={({ isActive }) => (isActive ? activeStyle : undefined)}
            >
              Crear Caso
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/statistics"
              style={({ isActive }) => (isActive ? activeStyle : undefined)}
            >
              Estadísticas
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
