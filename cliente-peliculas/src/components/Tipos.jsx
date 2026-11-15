import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function Tipos() {
  const [tipos, setTipos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const obtenerTipos = async () => {
    try {
      const res = await api.get('/tipos');
      setTipos(res.data);
    } catch (error) {
      console.error("Error al cargar tipos", error);
    }
  };

  useEffect(() => { obtenerTipos(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tipos', { nombre, descripcion });
      setNombre('');
      setDescripcion('');
      obtenerTipos();
    } catch (error) {
      console.error("Error al crear tipo", error);
    }
  };

  return (
    <div>
      <h2>Módulo de Tipos (Película / Serie)</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input type="text" placeholder="Nombre (Ej: Película)" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        <input type="text" placeholder="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
        <button type="submit">Guardar Tipo</button>
      </form>
      <ul>
        {tipos.map((t) => (
          <li key={t.id}>ID: {t.id} - {t.nombre} ({t.descripcion})</li>
        ))}
      </ul>
    </div>
  );
}