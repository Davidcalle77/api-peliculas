import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function Generos() {
  const [generos, setGeneros] = useState([]);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [estado, setEstado] = useState('Activo');
  const [editandoId, setEditandoId] = useState(null);
  const [mensaje, setMensaje] = useState(null); // { tipo: 'error' | 'ok', texto }

  const obtenerGeneros = async () => {
    try {
      const res = await api.get('/generos');
      setGeneros(res.data);
    } catch (error) {
      console.error("Error al cargar géneros", error);
      setMensaje({ tipo: 'error', texto: 'No se pudieron cargar los géneros' });
    }
  };

  useEffect(() => { obtenerGeneros(); }, []);

  const limpiarFormulario = () => {
    setNombre('');
    setDescripcion('');
    setEstado('Activo');
    setEditandoId(null);
  };

  const textoError = (error, porDefecto) => {
    const data = error.response?.data;
    if (data?.errores?.length) return `${data.mensaje}: ${data.errores.join(', ')}`;
    return data?.mensaje || porDefecto;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje(null);
    try {
      if (editandoId) {
        await api.put(`/generos/${editandoId}`, { nombre, descripcion, estado });
        setMensaje({ tipo: 'ok', texto: 'Género actualizado correctamente' });
      } else {
        await api.post('/generos', { nombre, descripcion, estado });
        setMensaje({ tipo: 'ok', texto: 'Género creado correctamente' });
      }
      limpiarFormulario();
      obtenerGeneros();
    } catch (error) {
      console.error("Error al guardar género", error);
      setMensaje({ tipo: 'error', texto: textoError(error, 'No se pudo guardar el género') });
    }
  };

  const handleEditar = (g) => {
    setEditandoId(g.id);
    setNombre(g.nombre || '');
    setDescripcion(g.descripcion || '');
    setEstado(g.estado || 'Activo');
    setMensaje(null);
  };

  const handleEliminar = async (g) => {
    if (!window.confirm(`¿Eliminar el género "${g.nombre}"?`)) return;
    setMensaje(null);
    try {
      await api.delete(`/generos/${g.id}`);
      if (editandoId === g.id) limpiarFormulario();
      setMensaje({ tipo: 'ok', texto: 'Género eliminado correctamente' });
      obtenerGeneros();
    } catch (error) {
      console.error("Error al eliminar género", error);
      setMensaje({ tipo: 'error', texto: textoError(error, 'No se pudo eliminar el género') });
    }
  };

  return (
    <div>
      <h2>Módulo de Géneros</h2>

      {mensaje && (
        <p style={{ color: mensaje.tipo === 'error' ? 'crimson' : 'green', fontWeight: 'bold' }}>
          {mensaje.texto}
        </p>
      )}

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        <input type="text" placeholder="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />
        <select value={estado} onChange={(e) => setEstado(e.target.value)}>
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
        </select>
        <button type="submit">{editandoId ? 'Actualizar Género' : 'Guardar Género'}</button>
        {editandoId && (
          <button type="button" onClick={limpiarFormulario}>Cancelar edición</button>
        )}
      </form>

      <ul>
        {generos.map((g) => (
          <li key={g.id}>
            {g.nombre} - {g.descripcion} ({g.estado}){' '}
            <button onClick={() => handleEditar(g)}>Editar</button>{' '}
            <button onClick={() => handleEliminar(g)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}