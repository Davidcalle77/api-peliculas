import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function Productoras() {
  const [productoras, setProductoras] = useState([]);
  const [nombre, setNombre] = useState('');
  const [slogan, setSlogan] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const obtenerProductoras = async () => {
    try {
      const res = await api.get('/productoras');
      setProductoras(res.data);
    } catch (error) {
      console.error("Error al cargar productoras", error);
    }
  };

  useEffect(() => { obtenerProductoras(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/productoras', { nombre, slogan, descripcion });
      setNombre('');
      setSlogan('');
      setDescripcion('');
      obtenerProductoras();
    } catch (error) {
      console.error("Error al crear productora", error);
    }
  };

  return (
    <div>
      <h2>Módulo de Productoras</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
        <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        <input type="text" placeholder="Slogan" value={slogan} onChange={(e) => setSlogan(e.target.value)} />
        <input type="text" placeholder="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
        <button type="submit">Guardar Productora</button>
      </form>
      <ul>
        {productoras.map((p) => (
          <li key={p.id}><strong>{p.nombre}</strong> - {p.slogan}</li>
        ))}
      </ul>
    </div>
  );
}