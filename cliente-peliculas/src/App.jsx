import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Generos from './components/Generos';
import Directores from './components/Directores';
import Productoras from './components/Productoras';
import Tipos from './components/Tipos';
import Media from './components/Media';

function App() {
  return (
    <Router>
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1>Gestión de Películas y Series - Cliente React</h1>
        
        {/* Menú de navegación superior */}
        <nav style={{ marginBottom: '20px', display: 'flex', gap: '15px', background: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
          <Link to="/generos" style={{ textDecoration: 'none', fontWeight: 'bold', color: '#333' }}>Géneros</Link>
          <Link to="/directores" style={{ textDecoration: 'none', fontWeight: 'bold', color: '#333' }}>Directores</Link>
          <Link to="/productoras" style={{ textDecoration: 'none', fontWeight: 'bold', color: '#333' }}>Productoras</Link>
          <Link to="/tipos" style={{ textDecoration: 'none', fontWeight: 'bold', color: '#333' }}>Tipos</Link>
          <Link to="/media" style={{ textDecoration: 'none', fontWeight: 'bold', color: '#333' }}>Media (Películas/Series)</Link>
        </nav>

        {/* Rutas de los módulos */}
        <Routes>
          <Route path="/generos" element={<Generos />} />
          <Route path="/directores" element={<Directores />} />
          <Route path="/productoras" element={<Productoras />} />
          <Route path="/tipos" element={<Tipos />} />
          <Route path="/media" element={<Media />} />
          <Route path="/" element={<h2>Selecciona un módulo en el menú superior para comenzar.</h2>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;