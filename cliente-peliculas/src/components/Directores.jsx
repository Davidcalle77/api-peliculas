import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function Directores() {
  const [directores, setDirectores] = useState([]);
  const [nombre, setNombre] = useState('');

  const obtenerDirectores = async () => {
    try {
      const res = await api.get('/directores');
      setDirectores(res.data);
    } catch (error) {
      console.error("Error al cargar directores", error);
    }
  };

  useEffect(() => { obtenerDirectores(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/directores', { nombres: nombre });
      setNombre('');
      obtenerDirectores();
    } catch (error) {
      console.error("Error al crear director", error);
    }
  };

  return (
    <div>
      <h2>Módulo de Directores</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input type="text" placeholder="Nombre del director" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        <button type="submit">Guardar Director</button>
      </form>
      <ul>
        {directores.map((d) => (
          <li key={d.id}>{d.nombres}</li>
        ))}
      </ul>
    </div>
  );
}