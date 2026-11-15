import React, { useEffect, useState } from 'react';
import api from '../services/api';

const formInicial = {
  serial: '',
  titulo: '',
  sinopsis: '',
  url: '',
  imagenPortada: '',
  anioEstreno: '',
  generoId: '',
  directorId: '',
  productoraId: '',
  tipoId: '',
};

export default function Media() {
  const [mediaList, setMediaList] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [directores, setDirectores] = useState([]);
  const [productoras, setProductoras] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [form, setForm] = useState(formInicial);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  const obtenerMedia = async () => {
    try {
      const res = await api.get('/media');
      setMediaList(res.data);
    } catch (err) {
      console.error('Error al cargar media', err);
    }
  };

  const cargarCatalogos = async () => {
    try {
      const [g, d, p, t] = await Promise.all([
        api.get('/generos'),
        api.get('/directores'),
        api.get('/productoras'),
        api.get('/tipos'),
      ]);
      setGeneros(g.data);
      setDirectores(d.data);
      setProductoras(p.data);
      setTipos(t.data);
    } catch (err) {
      console.error('Error al cargar catálogos', err);
    }
  };

  useEffect(() => {
    obtenerMedia();
    cargarCatalogos();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setExito('');
    try {
      await api.post('/media', {
        ...form,
        anioEstreno: Number(form.anioEstreno),
        generoId: Number(form.generoId),
        directorId: Number(form.directorId),
        productoraId: Number(form.productoraId),
        tipoId: Number(form.tipoId),
      });
      setExito('Media creada exitosamente');
      setForm(formInicial);
      obtenerMedia();
    } catch (err) {
      console.error('Error al crear media', err);
      setError(
        err.response?.data?.errores?.join(' | ') ||
          err.response?.data?.mensaje ||
          err.message
      );
    }
  };

  return (
    <div>
      <h2>Módulo de Media (Películas y Series)</h2>

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
          maxWidth: '600px',
          marginBottom: '20px',
        }}
      >
        <input type="text" name="serial" placeholder="Serial (Ej: PEL-001)" value={form.serial} onChange={handleChange} required />
        <input type="text" name="titulo" placeholder="Título" value={form.titulo} onChange={handleChange} required />
        <input type="number" name="anioEstreno" placeholder="Año Estreno" value={form.anioEstreno} onChange={handleChange} required />
        <input type="text" name="url" placeholder="URL de la película" value={form.url} onChange={handleChange} required />
        <input type="text" name="imagenPortada" placeholder="URL Imagen Portada" value={form.imagenPortada} onChange={handleChange} required />

        <select name="generoId" value={form.generoId} onChange={handleChange} required>
          <option value="">Género</option>
          {generos.map((g) => (
            <option key={g.id} value={g.id}>{g.nombre}</option>
          ))}
        </select>

        <select name="directorId" value={form.directorId} onChange={handleChange} required>
          <option value="">Director</option>
          {directores.map((d) => (
            <option key={d.id} value={d.id}>{d.nombres}</option>
          ))}
        </select>

        <select name="productoraId" value={form.productoraId} onChange={handleChange} required>
          <option value="">Productora</option>
          {productoras.map((p) => (
            <option key={p.id} value={p.id}>{p.nombre}</option>
          ))}
        </select>

        <select name="tipoId" value={form.tipoId} onChange={handleChange} required>
          <option value="">Tipo</option>
          {tipos.map((t) => (
            <option key={t.id} value={t.id}>{t.nombre}</option>
          ))}
        </select>

        <textarea
          name="sinopsis"
          placeholder="Sinopsis"
          value={form.sinopsis}
          onChange={handleChange}
          style={{ gridColumn: 'span 2' }}
          required
        />

        <button type="submit" style={{ gridColumn: 'span 2' }}>Guardar Media</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {exito && <p style={{ color: 'green' }}>{exito}</p>}

      <h3>Lista de Registros</h3>
      <ul>
        {mediaList.map((m) => (
          <li key={m.id}>
            <strong>{m.titulo}</strong> ({m.anioEstreno}) - Serial: {m.serial}
            {m.genero && ` - ${m.genero.nombre}`}
            {m.tipo && ` - ${m.tipo.nombre}`}
          </li>
        ))}
      </ul>
    </div>
  );
}