import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function Generos() {
  const [generos, setGeneros] = useState([]);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const obtenerGeneros = async () => {
    try {
      const res = await api.get('/generos');
      setGeneros(res.data);
    } catch (error) {
      console.error("Error al cargar géneros", error);
    }
  };

  useEffect(() => { obtenerGeneros(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/generos', { nombre, descripcion });
      setNombre('');
      setDescripcion('');
      obtenerGeneros();
    } catch (error) {
      console.error("Error al crear género", error);
    }
  };

  return (
    <div>
      <h2>Módulo de Géneros</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        <input type="text" placeholder="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />
        <button type="submit">Guardar Género</button>
      </form>
      <ul>
        {generos.map((g) => (
          <li key={g.id}>{g.nombre} - {g.descripcion}</li>
        ))}
      </ul>
    </div>
  );
}