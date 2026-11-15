import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function Tipos() {
  const [tipos, setTipos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [mensaje, setMensaje] = useState(null); // { tipo: 'error' | 'ok', texto }

  const obtenerTipos = async () => {
    try {
      const res = await api.get('/tipos');
      setTipos(res.data);
    } catch (error) {
      console.error("Error al cargar tipos", error);
      setMensaje({ tipo: 'error', texto: 'No se pudieron cargar los tipos' });
    }
  };

  useEffect(() => { obtenerTipos(); }, []);

  const limpiarFormulario = () => {
    setNombre('');
    setDescripcion('');
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
        await api.put(`/tipos/${editandoId}`, { nombre, descripcion });
        setMensaje({ tipo: 'ok', texto: 'Tipo actualizado correctamente' });
      } else {
        await api.post('/tipos', { nombre, descripcion });
        setMensaje({ tipo: 'ok', texto: 'Tipo creado correctamente' });
      }
      limpiarFormulario();
      obtenerTipos();
    } catch (error) {
      console.error("Error al guardar tipo", error);
      setMensaje({ tipo: 'error', texto: textoError(error, 'No se pudo guardar el tipo') });
    }
  };

  const handleEditar = (t) => {
    setEditandoId(t.id);
    setNombre(t.nombre || '');
    setDescripcion(t.descripcion || '');
    setMensaje(null);
  };

  const handleEliminar = async (t) => {
    if (!window.confirm(`¿Eliminar el tipo "${t.nombre}"?`)) return;
    setMensaje(null);
    try {
      await api.delete(`/tipos/${t.id}`);
      if (editandoId === t.id) limpiarFormulario();
      setMensaje({ tipo: 'ok', texto: 'Tipo eliminado correctamente' });
      obtenerTipos();
    } catch (error) {
      console.error("Error al eliminar tipo", error);
      setMensaje({ tipo: 'error', texto: textoError(error, 'No se pudo eliminar el tipo') });
    }
  };

  return (
    <div>
      <h2>Módulo de Tipos (Película / Serie)</h2>

      {mensaje && (
        <p style={{ color: mensaje.tipo === 'error' ? 'crimson' : 'green', fontWeight: 'bold' }}>
          {mensaje.texto}
        </p>
      )}

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input type="text" placeholder="Nombre (Ej: Película)" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        <input type="text" placeholder="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
        <button type="submit">{editandoId ? 'Actualizar Tipo' : 'Guardar Tipo'}</button>
        {editandoId && (
          <button type="button" onClick={limpiarFormulario}>Cancelar edición</button>
        )}
      </form>

      <ul>
        {tipos.map((t) => (
          <li key={t.id}>
            ID: {t.id} - {t.nombre} ({t.descripcion}){' '}
            <button onClick={() => handleEditar(t)}>Editar</button>{' '}
            <button onClick={() => handleEliminar(t)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}