import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function Directores() {
  const [directores, setDirectores] = useState([]);
  const [nombre, setNombre] = useState('');
  const [estado, setEstado] = useState('Activo');
  const [editandoId, setEditandoId] = useState(null);
  const [mensaje, setMensaje] = useState(null); // { tipo: 'error' | 'ok', texto }

  const obtenerDirectores = async () => {
    try {
      const res = await api.get('/directores');
      setDirectores(res.data);
    } catch (error) {
      console.error("Error al cargar directores", error);
      setMensaje({ tipo: 'error', texto: 'No se pudieron cargar los directores' });
    }
  };

  useEffect(() => { obtenerDirectores(); }, []);

  const limpiarFormulario = () => {
    setNombre('');
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
        await api.put(`/directores/${editandoId}`, { nombres: nombre, estado });
        setMensaje({ tipo: 'ok', texto: 'Director actualizado correctamente' });
      } else {
        await api.post('/directores', { nombres: nombre, estado });
        setMensaje({ tipo: 'ok', texto: 'Director creado correctamente' });
      }
      limpiarFormulario();
      obtenerDirectores();
    } catch (error) {
      console.error("Error al guardar director", error);
      setMensaje({ tipo: 'error', texto: textoError(error, 'No se pudo guardar el director') });
    }
  };

  const handleEditar = (d) => {
    setEditandoId(d.id);
    setNombre(d.nombres || '');
    setEstado(d.estado || 'Activo');
    setMensaje(null);
  };

  const handleEliminar = async (d) => {
    if (!window.confirm(`¿Eliminar al director "${d.nombres}"?`)) return;
    setMensaje(null);
    try {
      await api.delete(`/directores/${d.id}`);
      if (editandoId === d.id) limpiarFormulario();
      setMensaje({ tipo: 'ok', texto: 'Director eliminado correctamente' });
      obtenerDirectores();
    } catch (error) {
      console.error("Error al eliminar director", error);
      setMensaje({ tipo: 'error', texto: textoError(error, 'No se pudo eliminar el director') });
    }
  };

  return (
    <div>
      <h2>Módulo de Directores</h2>

      {mensaje && (
        <p style={{ color: mensaje.tipo === 'error' ? 'crimson' : 'green', fontWeight: 'bold' }}>
          {mensaje.texto}
        </p>
      )}

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input type="text" placeholder="Nombre del director" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        <select value={estado} onChange={(e) => setEstado(e.target.value)}>
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
        </select>
        <button type="submit">{editandoId ? 'Actualizar Director' : 'Guardar Director'}</button>
        {editandoId && (
          <button type="button" onClick={limpiarFormulario}>Cancelar edición</button>
        )}
      </form>

      <ul>
        {directores.map((d) => (
          <li key={d.id}>
            {d.nombres} ({d.estado}){' '}
            <button onClick={() => handleEditar(d)}>Editar</button>{' '}
            <button onClick={() => handleEliminar(d)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}