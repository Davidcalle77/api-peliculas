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

// Imagen de respaldo si la portada no carga
const SIN_PORTADA =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="100%" height="100%" fill="#dee2e6"/><text x="50%" y="50%" fill="#6c757d" font-size="22" text-anchor="middle" dominant-baseline="middle">Sin portada</text></svg>'
  );

export default function Media() {
  const [mediaList, setMediaList] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [directores, setDirectores] = useState([]);
  const [productoras, setProductoras] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [form, setForm] = useState(formInicial);
  const [editandoId, setEditandoId] = useState(null);
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

  const textoError = (err, porDefecto) =>
    err.response?.data?.errores?.join(' | ') ||
    err.response?.data?.mensaje ||
    err.message ||
    porDefecto;

  const limpiarFormulario = () => {
    setForm(formInicial);
    setEditandoId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setExito('');
    const datos = {
      ...form,
      anioEstreno: Number(form.anioEstreno),
      generoId: Number(form.generoId),
      directorId: Number(form.directorId),
      productoraId: Number(form.productoraId),
      tipoId: Number(form.tipoId),
    };
    try {
      if (editandoId) {
        await api.put(`/media/${editandoId}`, datos);
        setExito('Media actualizada exitosamente');
      } else {
        await api.post('/media', datos);
        setExito('Media creada exitosamente');
      }
      limpiarFormulario();
      obtenerMedia();
      cargarCatalogos();
    } catch (err) {
      console.error('Error al guardar media', err);
      setError(textoError(err, 'No se pudo guardar la media'));
    }
  };

  const handleEditar = (m) => {
    setEditandoId(m.id);
    setForm({
      serial: m.serial || '',
      titulo: m.titulo || '',
      sinopsis: m.sinopsis || '',
      url: m.url || '',
      imagenPortada: m.imagenPortada || '',
      anioEstreno: m.anioEstreno ?? '',
      generoId: m.generoId ?? '',
      directorId: m.directorId ?? '',
      productoraId: m.productoraId ?? '',
      tipoId: m.tipoId ?? '',
    });
    setError('');
    setExito('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEliminar = async (m) => {
    if (!window.confirm(`¿Eliminar "${m.titulo}"?`)) return;
    setError('');
    setExito('');
    try {
      await api.delete(`/media/${m.id}`);
      if (editandoId === m.id) limpiarFormulario();
      setExito('Media eliminada exitosamente');
      obtenerMedia();
    } catch (err) {
      console.error('Error al eliminar media', err);
      setError(textoError(err, 'No se pudo eliminar la media'));
    }
  };

  // Solo registros activos, más el que ya tiene seleccionada la media en edición
  const opciones = (lista, idActual) =>
    lista.filter(
      (x) => x.estado === undefined || x.estado === 'Activo' || String(x.id) === String(idActual)
    );

  return (
    <div>
      <h2 className="mb-4">Películas y Series</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {exito && <div className="alert alert-success">{exito}</div>}

      <div className="card shadow-sm mb-5">
        <div className="card-header fw-bold">
          {editandoId ? 'Editar registro' : 'Nuevo registro'}
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-12 col-md-4">
                <input className="form-control" type="text" name="serial" placeholder="Serial (Ej: PEL-001)" value={form.serial} onChange={handleChange} required />
              </div>
              <div className="col-12 col-md-5">
                <input className="form-control" type="text" name="titulo" placeholder="Título" value={form.titulo} onChange={handleChange} required />
              </div>
              <div className="col-12 col-md-3">
                <input className="form-control" type="number" name="anioEstreno" placeholder="Año de estreno" value={form.anioEstreno} onChange={handleChange} required />
              </div>
              <div className="col-12 col-md-6">
                <input className="form-control" type="text" name="url" placeholder="URL de la película" value={form.url} onChange={handleChange} required />
              </div>
              <div className="col-12 col-md-6">
                <input className="form-control" type="text" name="imagenPortada" placeholder="URL de la imagen de portada" value={form.imagenPortada} onChange={handleChange} required />
              </div>

              <div className="col-12 col-sm-6 col-lg-3">
                <select className="form-select" name="generoId" value={form.generoId} onChange={handleChange} required>
                  <option value="">Género</option>
                  {opciones(generos, form.generoId).map((g) => (
                    <option key={g.id} value={g.id}>{g.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="col-12 col-sm-6 col-lg-3">
                <select className="form-select" name="directorId" value={form.directorId} onChange={handleChange} required>
                  <option value="">Director</option>
                  {opciones(directores, form.directorId).map((d) => (
                    <option key={d.id} value={d.id}>{d.nombres}</option>
                  ))}
                </select>
              </div>
              <div className="col-12 col-sm-6 col-lg-3">
                <select className="form-select" name="productoraId" value={form.productoraId} onChange={handleChange} required>
                  <option value="">Productora</option>
                  {opciones(productoras, form.productoraId).map((p) => (
                    <option key={p.id} value={p.id}>{p.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="col-12 col-sm-6 col-lg-3">
                <select className="form-select" name="tipoId" value={form.tipoId} onChange={handleChange} required>
                  <option value="">Tipo</option>
                  {tipos.map((t) => (
                    <option key={t.id} value={t.id}>{t.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="col-12">
                <textarea className="form-control" rows="3" name="sinopsis" placeholder="Sinopsis" value={form.sinopsis} onChange={handleChange} required />
              </div>

              <div className="col-12 d-flex gap-2">
                <button type="submit" className="btn btn-primary">
                  {editandoId ? 'Actualizar Media' : 'Guardar Media'}
                </button>
                {editandoId && (
                  <button type="button" className="btn btn-outline-secondary" onClick={limpiarFormulario}>
                    Cancelar edición
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      <h3 className="mb-3">Catálogo</h3>
      {mediaList.length === 0 && <p className="text-muted">Aún no hay registros.</p>}

      <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
        {mediaList.map((m) => (
          <div className="col" key={m.id}>
            <div className="card h-100 shadow-sm">
              <img
                src={m.imagenPortada || SIN_PORTADA}
                alt={m.titulo}
                className="card-img-top"
                style={{ height: '280px', objectFit: 'cover' }}
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = SIN_PORTADA; }}
              />
              <div className="card-body">
                <h5 className="card-title">{m.titulo}</h5>
                <p className="mb-2">
                  {m.tipo && <span className="badge text-bg-primary me-1">{m.tipo.nombre}</span>}
                  {m.genero && <span className="badge text-bg-secondary me-1">{m.genero.nombre}</span>}
                  <span className="badge text-bg-light border">{m.anioEstreno}</span>
                </p>
                <p className="card-text small text-muted">{m.sinopsis}</p>
                <p className="small mb-0">
                  <strong>Serial:</strong> {m.serial}
                  {m.director && <><br /><strong>Director:</strong> {m.director.nombres}</>}
                  {m.productora && <><br /><strong>Productora:</strong> {m.productora.nombre}</>}
                </p>
              </div>
              <div className="card-footer bg-transparent d-flex gap-2">
                <button className="btn btn-sm btn-outline-primary" onClick={() => handleEditar(m)}>Editar</button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleEliminar(m)}>Eliminar</button>
                {m.url && (
                  <a className="btn btn-sm btn-outline-secondary ms-auto" href={m.url} target="_blank" rel="noreferrer">Ver</a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}