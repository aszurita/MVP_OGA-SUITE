/**
 * Glosario.jsx
 * Página principal del Glosario Empresarial de Datos.
 *
 * Conversión React del Glosario.aspx + glosario.js + glosarioEdit.js.
 *
 * CSS usados:
 *   - Bootstrap 4  (debe importarse globalmente: css/vendor/bootstrap.min.css)
 *   - simple-line-icons  (font/simple-line-icons/css/simple-line-icons.css)
 *   - iconsminds  (font/iconsmind-s/css/iconsminds.css)
 *   - css/style.css   (tema Dore del ASPX original)
 *   - css/main.css
 *   - ./styles/Glosario.css  (estilos propios extraídos del ASPX)
 *
 * APIs usadas (idénticas al ASPX):
 *   - POST http://gobinfoana01-2:8510/query  (SELECT)
 *   - POST http://gobinfoana01-2:8510/insert
 *   - PUT  http://gobinfoana01-2:8510/update
 *   Tablas: procesos_bi.dbo.T_terminos, t_mapa_dominios,
 *           t_casos_uso_analitica, T_CASOS_USO_TERMINOS_MB
 */
import React, { useState, useEffect } from 'react';

import useGlosario  from './hooks/useGlosario.js';
import { actualizarTermino, sincronizarRelacionesCasoUso } from './services/terminosService.js';

import GlosarioCard       from './components/GlosarioCard.jsx';
import GlosarioListItem   from './components/GlosarioListItem.jsx';
import DominiosSidebar    from './components/DominiosSidebar.jsx';
import RecientesSidebar   from './components/RecientesSidebar.jsx';
import SegmentarDropdown  from './components/SegmentarDropdown.jsx';
import FiltrarDropdown    from './components/FiltrarDropdown.jsx';
import ModalNuevoTermino  from './components/ModalNuevoTermino.jsx';
import ModalEliminar      from './components/ModalEliminar.jsx';

import './styles/Glosario.css';

// ─── Paginación ───────────────────────────────────────────────────────────────
function Paginacion({ currentPage, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const delta = 2;
  const range = [];

  for (let i = Math.max(1, currentPage - delta); i <= Math.min(totalPages, currentPage + delta); i++)
    range.push(i);

  if (range[0] > 1) {
    pages.push(1);
    if (range[0] > 2) pages.push('...');
  }
  range.forEach((p) => pages.push(p));
  if (range[range.length - 1] < totalPages) {
    if (range[range.length - 1] < totalPages - 1) pages.push('...');
    pages.push(totalPages);
  }

  return (
    <nav className="mt-4 mb-4">
      <div className="glosario-pagination">
        <button onClick={() => onChange(currentPage - 1)} disabled={currentPage === 1}>‹</button>
        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`dots-${i}`} style={{ padding: '0 4px', color: '#999' }}>…</span>
          ) : (
            <button key={p} className={p === currentPage ? 'active' : ''} onClick={() => onChange(p)}>
              {p}
            </button>
          )
        )}
        <button onClick={() => onChange(currentPage + 1)} disabled={currentPage === totalPages}>›</button>
      </div>
    </nav>
  );
}

// ─── Spinner de carga ─────────────────────────────────────────────────────────
function Spinner() {
  return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary" role="status">
        <span className="sr-only">Cargando...</span>
      </div>
      <p className="mt-3 text-muted" style={{ fontSize: '0.9rem' }}>Cargando glosario...</p>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function Glosario() {
  const {
    loading, error,
    glosario, dominiosMapa, dicCasosUso, mapaCUDominio, mapaTermCU,
    dictRef,
    searchQuery,    setSearchQuery,
    activeDominio,  seleccionarDominio,
    activeSegmento, setActiveSegmento,
    limpiarFiltros,
    viewMode,       setViewMode,
    allFiltered, paginated, totalPages, currentPage, setCurrentPage, PAGE_SIZE,
    showDominios,   toggleDominios,
    showRecientes,  toggleRecientes,
    recientes,
    modalNuevo,     setModalNuevo,
    modalElim,      setModalElim,
    handleCrossLink,
  } = useGlosario();

  // Estado local para feedback de edición/eliminación sin recargar todo
  const [terminosOverride, setTerminosOverride] = useState({}); // id → datos actualizados
  const [eliminados,       setEliminados]        = useState(new Set());

  // ─── Edición inline ───────────────────────────────────────────────────────
  async function handleEdit(datos, casosUsoSeleccionados) {
    const { id, ...campos } = datos;
    await actualizarTermino(id, campos, 0);
    await sincronizarRelacionesCasoUso(id, casosUsoSeleccionados, 0);
    setTerminosOverride((prev) => ({ ...prev, [id]: { ...datos } }));
  }

  // ─── Eliminación ─────────────────────────────────────────────────────────
  function handleDelete(id, nombre) {
    setModalElim({ open: true, id, nombre });
  }

  function handleDeleted(id) {
    setEliminados((prev) => new Set([...prev, String(id)]));
  }

  // ─── Nuevo término creado → recarga suave ─────────────────────────────────
  function handleCreated() {
    window.location.reload();
  }

  // ─── Click en cross-link (búsqueda del término vinculado) ─────────────────
  function onCrossLink(termino) {
    handleCrossLink(termino);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ─── Items a renderizar (excluyendo eliminados + aplicando overrides) ─────
  const itemsRender = paginated
    .filter((item) => !eliminados.has(String(item.id)))
    .map((item) => terminosOverride[item.id] ? { ...item, ...terminosOverride[item.id] } : item);

  const isOgaUser = false; // Cambiar a true para activar controles de edición/eliminación

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div id="glosario_terminos" className="flex-grow-1 px-3 transition-content">

      {/* ── Fila 1: Título + Buscador ── */}
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-2" style={{ flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 className="mb-0">Glosario Empresarial de Datos</h1>
            </div>
            <div className="search-sm position-relative" style={{ flexGrow: 1, minWidth: 300, maxWidth: 500 }}>
              <input
                className="form-control form-control-sm rounded-pill pr-4"
                placeholder="Buscar..."
                id="glosario-search"
                autoComplete="off"
                style={{ width: '100%', paddingRight: '2.2rem' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <i
                className="iconsminds-magnifi-glass position-absolute text-semi-muted"
                id="glosario-buscar"
                style={{ right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
              />
            </div>
          </div>

          {/* ── Fila 2: Sub-toolbar ── */}
          <div className="mb-2">
            <div className="d-flex flex-column flex-xl-row justify-content-between align-items-xl-center w-100" style={{ gap: 15 }}>

              {/* Izquierda: vista, dominios, filtrar, contador, limpiar */}
              <div className="d-flex flex-wrap align-items-center" style={{ gap: 10, flexGrow: 1 }}>

                {/* Vista tarjeta / lista */}
                <div className="d-flex align-items-center gap-2" id="glosarioView" style={{ gap: 4 }}>
                  <button
                    className={`btn btn-empty p-1${viewMode === 'card' ? ' text-primary' : ' text-semi-muted'}`}
                    type="button"
                    title="Vista de tarjeta"
                    style={{ boxShadow: 'none' }}
                    onClick={() => setViewMode('card')}
                  >
                    <i className="simple-icon-grid" style={{ fontSize: '1.4rem' }} />
                  </button>
                  <button
                    className={`btn btn-empty p-1${viewMode === 'list' ? ' text-primary' : ' text-semi-muted'}`}
                    type="button"
                    title="Vista de lista"
                    style={{ boxShadow: 'none' }}
                    onClick={() => setViewMode('list')}
                  >
                    <i className="simple-icon-list" style={{ fontSize: '1.4rem' }} />
                  </button>
                </div>

                {/* Botón dominios */}
                <button
                  id="btn-toggle-dominios"
                  className={`btn btn-outline-primary btn-sm rounded-pill whitespace-nowrap ml-2${showDominios ? ' active' : ''}`}
                  onClick={toggleDominios}
                >
                  <i className="simple-icon-list mr-1" /> Dominios
                </button>

                {/* Contador */}
                <div className="text-semi-muted ml-md-1">
                  <span
                    id="glosario-count"
                    className="badge badge-primary px-3 py-2"
                    style={{ fontSize: '0.8rem', borderRadius: 12 }}
                  >
                    {allFiltered.length} resultados
                  </span>
                </div>

                {/* Filtrar Por */}
                <FiltrarDropdown
                  activeFiltro={activeSegmento}
                  onFiltrar={(v) => { setActiveSegmento(v === 'dominio' ? 'todos' : v); }}
                />

                {/* Limpiar filtros */}
                <div>
                  <button
                    className="btn-reveal"
                    title="Limpiar filtros"
                    aria-label="Limpiar filtros"
                    onClick={limpiarFiltros}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m16 22-1-4" /><path d="M19 14a1 1 0 0 0 1-1v-1a2 2 0 0 0-2-2h-3a1 1 0 0 1-1-1V4a2 2 0 0 0-4 0v5a1 1 0 0 1-1 1H6a2 2 0 0 0-2 2v1a1 1 0 0 0 1 1" /><path d="M19 14H5l-1.973 6.767A1 1 0 0 0 4 22h16a1 1 0 0 0 .973-1.233z" /><path d="m8 22 1-4" />
                    </svg>
                    <span className="label">Limpiar Filtros</span>
                  </button>
                </div>
              </div>

              {/* Derecha: Nuevo, Segmentar, Recientes */}
              <div className="d-flex flex-wrap align-items-center justify-content-sm-end mt-3 mt-xl-0" style={{ gap: 10 }}>

                {/* Nuevo atributo (solo OGA) */}
                {isOgaUser && (
                  <div id="glosario-add-container" className="btn-slot" style={{ width: 'auto' }}>
                    <button
                      className="btn-reveal"
                      type="button"
                      id="glosario-add-atributo"
                      onClick={() => setModalNuevo(true)}
                    >
                      <i className="iconsminds-add" style={{ fontSize: '1.2rem', WebkitTextStroke: '1px currentColor' }} />
                      <span className="label" style={{ fontWeight: 500 }}>Nuevo Atributo</span>
                    </button>
                  </div>
                )}

                {/* Segmentar Por */}
                <SegmentarDropdown
                  activeSegmento={activeSegmento}
                  onSegmentar={(v) => { setActiveSegmento(v); setCurrentPage(1); }}
                />

                {/* Recientes */}
                <button
                  id="btn-toggle-recientes"
                  className={`btn btn-outline-primary btn-sm rounded-pill whitespace-nowrap ml-2${showRecientes ? ' active' : ''}`}
                  onClick={toggleRecientes}
                >
                  <i className="simple-icon-list mr-1" /> Recientes
                </button>

              </div>
            </div>
          </div>

          <div className="separator mb-5" />
        </div>
      </div>

      {/* ── Cuerpo: dominios + tarjetas + recientes ── */}
      <div className="row">

        {/* Sidebar dominios */}
        {showDominios && (
          <div className="sidebar-dominios-wrapper col-md-3">
            <DominiosSidebar
              dominiosMap={glosario.dominios}
              activeDominio={activeDominio}
              onSelect={seleccionarDominio}
              onClose={toggleDominios}
            />
          </div>
        )}

        {/* Área de resultados */}
        <div className="col" id="glosario-body">

          {loading && <Spinner />}

          {!loading && error && (
            <div className="alert alert-danger" role="alert">
              <strong>Error al cargar los datos:</strong> {error}
              <br />
              <small className="text-muted">Verifica la conexión con la API ({'{'}http://gobinfoana01-2:8510{'}'}).</small>
            </div>
          )}

          {!loading && !error && (
            <>
              {/* Sin resultados */}
              {itemsRender.length === 0 && (
                <div className="card text-center p-4 my-3 shadow-sm" style={{ border: '1px solid #D0D0D0', background: '#fff' }}>
                  <h5 className="mt-2 mb-1" style={{ fontWeight: 600 }}>No se encontraron resultados</h5>
                  {searchQuery && (
                    <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                      Búsqueda: "<em>{searchQuery}</em>"
                    </p>
                  )}
                </div>
              )}

              {/* Vista CARD */}
              {viewMode === 'card' && itemsRender.length > 0 && (
                <div id="resultados" className="glosario-grid">
                  {itemsRender.map((item) => (
                    <GlosarioCard
                      key={item.id}
                      item={item}
                      dominiosMapa={dominiosMapa}
                      dicCasosUso={dicCasosUso}
                      mapaCUDominio={mapaCUDominio}
                      mapaTermCU={mapaTermCU}
                      dictRef={dictRef}
                      isOgaUser={isOgaUser}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onCrossLink={onCrossLink}
                    />
                  ))}
                </div>
              )}

              {/* Vista LISTA */}
              {viewMode === 'list' && itemsRender.length > 0 && (
                <div id="resultados">
                  {itemsRender.map((item, idx) => (
                    <GlosarioListItem
                      key={item.id}
                      item={item}
                      dominiosMapa={dominiosMapa}
                      dicCasosUso={dicCasosUso}
                      mapaCUDominio={mapaCUDominio}
                      mapaTermCU={mapaTermCU}
                      dictRef={dictRef}
                      isOgaUser={isOgaUser}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onCrossLink={onCrossLink}
                      showSeparator={idx < itemsRender.length - 1}
                    />
                  ))}
                </div>
              )}

              {/* Paginación */}
              <Paginacion
                currentPage={currentPage}
                totalPages={totalPages}
                onChange={(p) => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              />
            </>
          )}
        </div>

        {/* Sidebar recientes */}
        {showRecientes && (
          <div className="col-md-3" id="wrapper-recientes">
            <RecientesSidebar
              recientes={recientes}
              onSelect={(nombre) => { setSearchQuery(nombre); setCurrentPage(1); }}
              onClose={toggleRecientes}
            />
          </div>
        )}
      </div>

      {/* ── Modales ── */}
      <ModalNuevoTermino
        show={modalNuevo}
        onClose={() => setModalNuevo(false)}
        dominiosMapa={dominiosMapa}
        dicCasosUso={dicCasosUso}
        onCreated={handleCreated}
      />

      <ModalEliminar
        show={modalElim.open}
        id={modalElim.id}
        nombre={modalElim.nombre}
        onClose={() => setModalElim({ open: false, id: null, nombre: '' })}
        onDeleted={handleDeleted}
      />
    </div>
  );
}
