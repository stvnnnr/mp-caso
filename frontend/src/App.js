// src/App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CreateCase from './pages/CreateCase';
import ListCases from './pages/ListCases';
import ReassignCase from './pages/ReassignCase';
import UpdateCaseStatus from './pages/UpdateCaseStatus';
import Statistics from './pages/Statistics';
import './App.css';

function App() {
  return (
    <div className="App">
      {/* Barra de navegación visible en todas las páginas */}
      <Navbar />

      {/* Contenedor principal de contenido */}
      <div className="container">
        <Routes>
          {/* Redirige "/" a "/home" */}
          <Route path="/" element={<Navigate to="/home" />} />

          <Route path="/home" element={<Home />} />
          <Route path="/cases" element={<ListCases />} />
          <Route path="/cases/create" element={<CreateCase />} />
          <Route path="/cases/:id/reassign" element={<ReassignCase />} />
          <Route path="/cases/:id/update-status" element={<UpdateCaseStatus />} />
          <Route path="/statistics" element={<Statistics />} />

          {/* Si no coincide ninguna ruta, redirige a /home */}
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
