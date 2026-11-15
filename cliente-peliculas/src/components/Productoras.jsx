import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function Productoras() {
  const [productoras, setProductoras] = useState([]);
  const [nombre, setNombre] = useState('');
  const [slogan, setSlogan] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [estado, setEstado] = useState('Activo');
  const [editandoId, setEditandoId] = useState(null);
  const [mensaje, setMensaje] = useState(null); // { tipo: 'error' | 'ok', texto }

  const obtenerProductoras = async () => {
    try {
      const res = await api.get('/productoras');
      setProductoras(res.data);
    } catch (error) {
      console.error("Error al cargar productoras", error);
      setMensaje({ tipo: 'error', texto: 'No se pudieron cargar las productoras' });
    }
  };

  useEffect(() => { obtenerProductoras(); }, []);

  const limpiarFormulario = () => {
    setNombre('');
    setSlogan('');
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
        await api.put(`/productoras/${editandoId}`, { nombre, slogan, descripcion, estado });
        setMensaje({ tipo: 'ok', texto: 'Productora actualizada correctamente' });
      } else {
        await api.post('/productoras', { nombre, slogan, descripcion, estado });
        setMensaje({ tipo: 'ok', texto: 'Productora creada correctamente' });
      }
      limpiarFormulario();
      obtenerProductoras();
    } catch (error) {
      console.error("Error al guardar productora", error);
      setMensaje({ tipo: 'error', texto: textoError(error, 'No se pudo guardar la productora') });
    }
  };

  const handleEditar = (p) => {
    setEditandoId(p.id);
    setNombre(p.nombre || '');
    setSlogan(p.slogan || '');
    setDescripcion(p.descripcion || '');
    setEstado(p.estado || 'Activo');
    setMensaje(null);
  };

  const handleEliminar = async (p) => {
    if (!window.confirm(`¿Eliminar la productora "${p.nombre}"?`)) return;
    setMensaje(null);
    try {
      await api.delete(`/productoras/${p.id}`);
      if (editandoId === p.id) limpiarFormulario();
      setMensaje({ tipo: 'ok', texto: 'Productora eliminada correctamente' });
      obtenerProductoras();
    } catch (error) {
      console.error("Error al eliminar productora", error);
      setMensaje({ tipo: 'error', texto: textoError(error, 'No se pudo eliminar la productora') });
    }
  };

  return (
    <div>
      <h2>Módulo de Productoras</h2>

      {mensaje && (
        <p style={{ color: mensaje.tipo === 'error' ? 'crimson' : 'green', fontWeight: 'bold' }}>
          {mensaje.texto}
        </p>
      )}

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
        <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        <input type="text" placeholder="Slogan" value={slogan} onChange={(e) => setSlogan(e.target.value)} />
        <input type="text" placeholder="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
        <select value={estado} onChange={(e) => setEstado(e.target.value)}>
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
        </select>
        <button type="submit">{editandoId ? 'Actualizar Productora' : 'Guardar Productora'}</button>
        {editandoId && (
          <button type="button" onClick={limpiarFormulario}>Cancelar edición</button>
        )}
      </form>

      <ul>
        {productoras.map((p) => (
          <li key={p.id}>
            <strong>{p.nombre}</strong> - {p.slogan} ({p.estado}){' '}
            <button onClick={() => handleEditar(p)}>Editar</button>{' '}
            <button onClick={() => handleEliminar(p)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}