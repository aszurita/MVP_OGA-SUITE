/**
 * GlosarioCard.jsx
 * Tarjeta individual de un término del glosario — Vista "card" (grid).
 * Replica la plantilla card del template() en glosario.js original.
 * Incluye: badges, cross-links, edición inline, acciones (copiar, compartir, editar, eliminar).
 */
import React, { useState, useRef } from 'react';
import { linkifyDescription } from '../hooks/useGlosario.js';

// ─── Badges de características ─────────────────────────────────────────────────
function AtributoBadges({ caracteristicas, datoPersonal, goldenRecord }) {
  const badges = [];

  if (caracteristicas) {
    const atrs = caracteristicas.split('; ');
    atrs.forEach((atr, i) => {
      if (atr.includes('CDE') || atr.includes('cde')) {
        const etiqueta = atr.includes('(') ? atr.split(' ')[0].replace(/[()]/g, '') : atr;
        badges.push(
          <span key={`cde-${i}`} className="badge badge-pill badge-secondary atributo caracteristica" title="Critical Data Element">
            {etiqueta}
          </span>
        );
      } else if (atr.includes('(')) {
        const etiqueta = atr.split(' ')[0].replace(/[()]/g, '');
        badges.push(
          <span key={`ar-${i}`} className="badge badge-pill badge-secondary atributo caracteristica" title="Atributo de Referencia">
            {etiqueta}
          </span>
        );
      }
    });
  }

  if (parseInt(datoPersonal) > 0) {
    badges.push(
      <span key="dp" className="badge badge-pill badge-secondary atributo" title="Dato personal">
        <i className="iconsminds-business-man" />
      </span>
    );
  }

  if (goldenRecord === 1 || goldenRecord === true || goldenRecord === '1') {
    badges.push(
      <span key="gr" className="badge badge-pill badge-secondary atributo" title="Golden Record">
        <i className="simple-icon-diamond" />
      </span>
    );
  }

  return <div className="atributos d-flex gap-1 flex-wrap">{badges}</div>;
}

// ─── Formulario de edición inline ─────────────────────────────────────────────
function FormEdicionInline({ item, dominiosMapa, dicCasosUso, mapaTermCU, onSave, onCancel }) {
  const dominiosActuales = (item.dominios || '').split(';').map((d) => d.trim()).filter(Boolean);
  const casosActuales    = (mapaTermCU.get(String(item.id)) || []);

  const [nombre,     setNombre]     = useState((item.nombre || '').replace(/<br>/g, ''));
  const [tipo,       setTipo]       = useState((item.tipo || 'TERMINO').toUpperCase());
  const [descripcion,setDescripcion]= useState(item.descripcion || '');
  const [dominios,   setDominios]   = useState(dominiosActuales);
  const [casosUso,   setCasosUso]   = useState(casosActuales);

  const allDominios = Array.from(dominiosMapa.keys());
  const allCasosUso = Object.entries(dicCasosUso);

  function toggleDominio(d) {
    setDominios((prev) => prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]);
  }

  function toggleCasoUso(id) {
    setCasosUso((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }

  function handleSave() {
    onSave({
      id:          item.id,
      nombre,
      tipo,
      descripcion,
      dominios:    dominios.join('; '),
      casos_uso:   casosUso.join('; '),
    }, casosUso.map(Number));
  }

  return (
    <div className="glosario-item-edit p-3 mt-3 bg-light" style={{ border: '1px solid #d7d7d7', borderRadius: '0.5rem' }}>
      <div className="form-row">
        <div className="form-group col-md-6">
          <label className="font-weight-bold" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Nombre</label>
          <input type="text" className="form-control" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </div>
        <div className="form-group col-md-6">
          <label className="font-weight-bold" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Tipo</label>
          <select className="form-control" value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="ATRIBUTO">ATRIBUTO</option>
            <option value="TERMINO">TERMINO</option>
            <option value="ATRIBUTO/TERMINO">ATRIBUTO/TERMINO</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group col-md-6">
          <label className="font-weight-bold" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Dominio</label>
          <select className="form-control" multiple value={dominios} onChange={(e) => setDominios(Array.from(e.target.selectedOptions, (o) => o.value))} size={Math.min(5, allDominios.length)}>
            {allDominios.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div className="form-group col-md-6">
          <label className="font-weight-bold" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Caso de Uso</label>
          <select className="form-control" multiple value={casosUso} onChange={(e) => setCasosUso(Array.from(e.target.selectedOptions, (o) => o.value))} size={Math.min(5, allCasosUso.length)}>
            {allCasosUso.map(([id, nombre]) => <option key={id} value={id}>{nombre}</option>)}
          </select>
        </div>
      </div>

      <div className="form-group mb-0">
        <label className="font-weight-bold" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Descripción</label>
        <textarea className="form-control" rows={3} value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
      </div>

      <div className="d-flex gap-2 mt-3" style={{ gap: 8 }}>
        <button className="btn btn-success btn-sm" onClick={handleSave}>
          <i className="simple-icon-check mr-1" /> Guardar
        </button>
        <button className="btn btn-secondary btn-sm" onClick={onCancel}>
          <i className="simple-icon-close mr-1" /> Cancelar
        </button>
      </div>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function GlosarioCard({
  item,
  dominiosMapa,
  dicCasosUso,
  mapaCUDominio,
  mapaTermCU,
  dictRef,
  isOgaUser,
  onEdit,
  onDelete,
  onRegisterReciente,
  onCrossLink,
}) {
  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const spId        = item.id || '';
  const tipoRaw     = (item.tipo || '').toUpperCase();
  const nombreLimpio = (item.nombre || '').replace(/<br>/g, '');

  // Fecha
  const rawDate  = item.fecha_modificacion || item.fecha_creacion || '';
  const fechaAct = rawDate ? rawDate.split('T')[0].split(' ')[0] : 'No disponible';

  // Dominios + heredados de casos de uso
  const casosUsoIds      = mapaTermCU.get(String(spId)) || [];
  const dominiosDirectos = (item.dominios || '').split(';').map((d) => d.trim()).filter(Boolean);
  const dominiosHeredados = casosUsoIds
    .map((id) => mapaCUDominio[id])
    .filter(Boolean);
  const todosLosDominios = [...new Set([...dominiosDirectos, ...dominiosHeredados])];
  const domainValue = todosLosDominios.join(' | ') || 'Sin dominio';

  // Casos de uso — texto visible (truncado a 60 chars)
  const casosUsoNombres = casosUsoIds
    .map((id) => dicCasosUso[id])
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
  const cuTexto = casosUsoNombres.join(' | ');
  const cuVisible = cuTexto.length > 60 ? cuTexto.substring(0, 57) + '...' : cuTexto;

  // Descripción con cross-links
  const { dictCache, regexSeguro } = dictRef.current;
  const descHtml = linkifyDescription(item.descripcion || 'Sin descripción disponible.', nombreLimpio, dictCache, regexSeguro);

  // Copiar tarjeta al portapapeles
  function handleCopy(e) {
    e.preventDefault();
    const texto = `${nombreLimpio}\n${tipoRaw}\n${domainValue}\n${item.descripcion || ''}`;
    navigator.clipboard.writeText(texto).catch(() => {});
  }

  // Compartir (copia URL con param ?buscar=...)
  function handleShare(e) {
    e.preventDefault();
    const base = window.location.href.split('?')[0];
    const url  = `${base}?buscar=${encodeURIComponent(nombreLimpio)}`;
    navigator.clipboard.writeText(url).catch(() => {});
  }

  async function handleSaveEdit(datos, casosUsoIds) {
    setGuardando(true);
    try {
      await onEdit(datos, casosUsoIds);
      setEditando(false);
    } finally {
      setGuardando(false);
    }
  }

  // Registrar visita al hacer click en el nombre
  function handleNombreClick() {
    if (onRegisterReciente) onRegisterReciente(item);
  }

  // Click en cross-link
  function handleBodyClick(e) {
    const el = e.target.closest('.glosario-crosslink');
    if (el) {
      e.preventDefault();
      const termino = el.getAttribute('data-termino');
      if (termino && onCrossLink) onCrossLink(termino);
    }
  }

  return (
    <div
      className="card glosario-item shadow-sm"
      data-item-id={spId}
      style={{ borderRadius: 10, border: '1px solid #e3e3e3', width: '100%' }}
    >
      <div className="card-body position-relative">
        {/* ── Acciones (top-right) ── */}
        <div
          className="position-absolute d-flex align-items-center glosario-item-actions-react"
          style={{ top: 15, right: 15, zIndex: 10, gap: 8 }}
        >
          <button
            className="btn btn-empty p-0 glosario-btn-copy"
            title="Copiar Tarjeta"
            onClick={handleCopy}
          >
            <i className="simple-icon-docs" style={{ color: '#6c757d', fontSize: '0.75rem' }} />
          </button>
          <button
            className="btn btn-empty p-0 glosario-btn-share"
            title="Compartir Enlace"
            onClick={handleShare}
          >
            <i className="simple-icon-share" style={{ color: '#6c757d', fontSize: '0.75rem' }} />
          </button>

          {isOgaUser && (
            <div className="dropdown">
              <button
                className="btn btn-empty p-0"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                type="button"
              >
                <i className="simple-icon-options-vertical" style={{ color: '#6c757d' }} />
              </button>
              <div className="dropdown-menu dropdown-menu-right">
                <button
                  className="dropdown-item"
                  type="button"
                  onClick={() => setEditando(true)}
                  disabled={editando}
                >
                  <i className="simple-icon-pencil mr-2" /> Editar término
                </button>
                <div className="dropdown-divider" />
                <button
                  className="dropdown-item text-danger"
                  type="button"
                  onClick={() => onDelete(spId, nombreLimpio)}
                >
                  <i className="simple-icon-trash mr-2" /> Eliminar registro
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Cabecera: nombre + badges ── */}
        <div className="resultado-head d-flex justify-content-between align-items-start flex-wrap" style={{ paddingRight: 110 }}>
          <div className="d-flex flex-column mb-2">
            <div className="d-flex align-items-center gap-2 mb-1">
              {tipoRaw === 'ATRIBUTO' ? (
                <a
                  href={`Ficha_Atributo.aspx?atributo=${spId}`}
                  className="list-item-heading color-theme-1 link_subrrayado"
                  style={{ fontSize: '1.1rem', fontWeight: 'bold' }}
                  onClick={handleNombreClick}
                >
                  {nombreLimpio}
                </a>
              ) : (
                <p
                  className="list-item-heading mb-0 mr-2"
                  style={{ fontSize: '1rem', fontWeight: 'bold', color: '#D2006E', cursor: 'default' }}
                  onClick={handleNombreClick}
                >
                  {nombreLimpio}
                </p>
              )}
            </div>
            <AtributoBadges
              caracteristicas={item.caracteristicas}
              datoPersonal={item.dato_personal}
              goldenRecord={item.golden_record}
            />
            <p
              className="mb-0 mt-2"
              style={{ fontSize: '0.75rem', color: '#6c757d' }}
            >
              <i className="simple-icon-calendar mr-1" /> Últ. act: {fechaAct}
            </p>
          </div>
        </div>

        {/* ── Formulario edición inline ── */}
        {editando && (
          <FormEdicionInline
            item={item}
            dominiosMapa={dominiosMapa}
            dicCasosUso={dicCasosUso}
            mapaTermCU={mapaTermCU}
            onSave={handleSaveEdit}
            onCancel={() => setEditando(false)}
          />
        )}

        {/* ── Cuerpo de la tarjeta ── */}
        {!editando && (
          <div>
            <p className="mb-1" style={{ fontWeight: 600, fontSize: '0.8rem', color: '#245794' }}>
              {tipoRaw}
            </p>
            <p className="mb-2" style={{ fontWeight: 500, fontSize: '0.8rem', color: '#333' }}>
              <i className="simple-icon-folder-alt mr-1" />
              {domainValue}
              {cuVisible && (
                <span
                  className="mb-0 glosario-caso-uso"
                  title={cuTexto}
                  style={{ fontSize: '0.85rem', color: '#6c757d', cursor: 'help' }}
                >
                  {' '}| {cuVisible}
                </span>
              )}
            </p>
            <p
              className="mb-0"
              style={{ textAlign: 'justify', lineHeight: 1.5 }}
              dangerouslySetInnerHTML={{ __html: descHtml }}
              onClick={handleBodyClick}
            />
          </div>
        )}

        {guardando && (
          <div className="text-center mt-2" style={{ fontSize: '0.8rem', color: '#6c757d' }}>
            <span className="spinner-border spinner-border-sm mr-1" role="status" />
            Guardando...
          </div>
        )}
      </div>
    </div>
  );
}
