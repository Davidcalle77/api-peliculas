import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Generos from './components/Generos';
import Directores from './components/Directores';
import Productoras from './components/Productoras';
import Tipos from './components/Tipos';
import Media from './components/Media';

const enlaces = [
  { to: '/generos', texto: 'Géneros' },
  { to: '/directores', texto: 'Directores' },
  { to: '/productoras', texto: 'Productoras' },
  { to: '/tipos', texto: 'Tipos' },
  { to: '/media', texto: 'Películas y Series' },
];

function App() {
  const [abierto, setAbierto] = useState(false);

  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
        <div className="container">
          <NavLink className="navbar-brand" to="/">🎬 Gestión de Películas y Series</NavLink>
          <button
            className="navbar-toggler"
            type="button"
            aria-label="Abrir menú"
            onClick={() => setAbierto(!abierto)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`collapse navbar-collapse ${abierto ? 'show' : ''}`}>
            <ul className="navbar-nav ms-auto">
              {enlaces.map((e) => (
                <li className="nav-item" key={e.to}>
                  <NavLink
                    to={e.to}
                    className={({ isActive }) => `nav-link ${isActive ? 'active fw-bold' : ''}`}
                    onClick={() => setAbierto(false)}
                  >
                    {e.texto}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      <div className="container pb-5">
        <Routes>
          <Route path="/generos" element={<Generos />} />
          <Route path="/directores" element={<Directores />} />
          <Route path="/productoras" element={<Productoras />} />
          <Route path="/tipos" element={<Tipos />} />
          <Route path="/media" element={<Media />} />
          <Route
            path="/"
            element={
              <div className="card shadow-sm text-center my-5">
                <div className="card-body py-5">
                  <h2 className="mb-3">Sistema de Gestión de Películas y Series</h2>
                  <p className="text-muted mb-4">
                    Aplicación web con API REST (Node.js, Express, PostgreSQL) y cliente en React,
                    desplegada en la nube.
                  </p>
                  <p className="mb-0">Seleccione un módulo en el menú superior para comenzar.</p>
                </div>
              </div>
            }
          />
        </Routes>
      </div>

      <footer className="pie">
        <strong>Proyecto Integrado 2 – Desarrollo de Aplicaciones Web</strong><br />
        Estudiantes Juan David Calle Correa - Edinson Mena Arroyo · Universidad Digital de Antioquia · 2026 - 2
      </footer>
    </Router>
  );
}

export default App;