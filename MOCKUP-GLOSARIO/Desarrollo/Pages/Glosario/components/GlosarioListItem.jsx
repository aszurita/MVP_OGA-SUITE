/**
 * GlosarioListItem.jsx
 * Fila individual de un término en vista de lista.
 * Replica la plantilla "list" del template() en glosario.js original.
 */
import React, { useState } from 'react';
import { linkifyDescription } from '../hooks/useGlosario.js';

function AtributoBadges({ caracteristicas, datoPersonal, goldenRecord }) {
  const badges = [];
  if (caracteristicas) {
    caracteristicas.split('; ').forEach((atr, i) => {
      if (atr.includes('CDE') || atr.includes('cde')) {
        const etq = atr.includes('(') ? atr.split(' ')[0].replace(/[()]/g, '') : atr;
        badges.push(<span key={`cde-${i}`} className="badge badge-pill badge-secondary atributo caracteristica" title="CDE">{etq}</span>);
      } else if (atr.includes('(')) {
        const etq = atr.split(' ')[0].replace(/[()]/g, '');
        badges.push(<span key={`ar-${i}`} className="badge badge-pill badge-secondary atributo caracteristica" title="AR">{etq}</span>);
      }
    });
  }
  if (parseInt(datoPersonal) > 0)
    badges.push(<span key="dp" className="badge badge-pill badge-secondary atributo" title="Dato personal"><i className="iconsminds-business-man" /></span>);
  if (goldenRecord === 1 || goldenRecord === true || goldenRecord === '1')
    badges.push(<span key="gr" className="badge badge-pill badge-secondary atributo" title="Golden Record"><i className="simple-icon-diamond" /></span>);
  return <div className="atributos d-flex gap-1 flex-wrap" style={{ gap: 4 }}>{badges}</div>;
}

export default function GlosarioListItem({
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
  showSeparator,
}) {
  const [editando,  setEditando]  = useState(false);
  const [guardando, setGuardando] = useState(false);

  const spId         = item.id || '';
  const tipoRaw      = (item.tipo || '').toUpperCase();
  const nombreLimpio = (item.nombre || '').replace(/<br>/g, '');
  const rawDate      = item.fecha_modificacion || item.fecha_creacion || '';
  const fechaAct     = rawDate ? rawDate.split('T')[0].split(' ')[0] : 'No disponible';

  const casosUsoIds       = mapaTermCU.get(String(spId)) || [];
  const dominiosDirectos  = (item.dominios || '').split(';').map((d) => d.trim()).filter(Boolean);
  const dominiosHeredados = casosUsoIds.map((id) => mapaCUDominio[id]).filter(Boolean);
  const todosLosDominios  = [...new Set([...dominiosDirectos, ...dominiosHeredados])];
  const domainValue = todosLosDominios.join(' | ') || 'Sin dominio';

  const cuNombres = casosUsoIds.map((id) => dicCasosUso[id]).filter(Boolean).sort((a, b) => a.localeCompare(b));
  const cuTexto   = cuNombres.join(' | ');
  const cuVisible = cuTexto.length > 60 ? cuTexto.substring(0, 57) + '...' : cuTexto;

  const { dictCache, regexSeguro } = dictRef.current;
  const descHtml = linkifyDescription(item.descripcion || 'Sin descripción disponible.', nombreLimpio, dictCache, regexSeguro);

  function handleCopy(e) {
    e.preventDefault();
    navigator.clipboard.writeText(`${nombreLimpio}\n${tipoRaw}\n${domainValue}\n${item.descripcion || ''}`).catch(() => {});
  }

  function handleShare(e) {
    e.preventDefault();
    const url = `${window.location.href.split('?')[0]}?buscar=${encodeURIComponent(nombreLimpio)}`;
    navigator.clipboard.writeText(url).catch(() => {});
  }

  async function handleSaveEdit(datos, casosIds) {
    setGuardando(true);
    try { await onEdit(datos, casosIds); setEditando(false); }
    finally { setGuardando(false); }
  }

  function handleBodyClick(e) {
    const el = e.target.closest('.glosario-crosslink');
    if (el) { e.preventDefault(); const t = el.getAttribute('data-termino'); if (t && onCrossLink) onCrossLink(t); }
  }

  return (
    <>
      <div className="mb-4 glosario-item position-relative" data-item-id={spId}>
        {/* Acciones */}
        <div className="position-absolute d-flex align-items-center" style={{ top: 0, right: 10, zIndex: 10, gap: 8 }}>
          <button className="btn btn-empty p-0" title="Copiar" onClick={handleCopy}>
            <i className="simple-icon-docs" style={{ color: '#6c757d', fontSize: '0.75rem' }} />
          </button>
          <button className="btn btn-empty p-0" title="Compartir" onClick={handleShare}>
            <i className="simple-icon-share" style={{ color: '#6c757d', fontSize: '0.75rem' }} />
          </button>
          {isOgaUser && (
            <div className="dropdown">
              <button className="btn btn-empty p-0" data-toggle="dropdown">
                <i className="simple-icon-options-vertical" style={{ color: '#6c757d' }} />
              </button>
              <div className="dropdown-menu dropdown-menu-right">
                <button className="dropdown-item" onClick={() => setEditando(true)} disabled={editando}>
                  <i className="simple-icon-pencil mr-2" /> Editar término
                </button>
                <div className="dropdown-divider" />
                <button className="dropdown-item text-danger" onClick={() => onDelete(spId, nombreLimpio)}>
                  <i className="simple-icon-trash mr-2" /> Eliminar registro
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Cabecera */}
        <div className="resultado-head d-flex justify-content-between align-items-center flex-wrap" style={{ paddingRight: 110 }}>
          <div className="d-flex gap-2 align-items-center flex-nowrap" style={{ gap: 8 }}>
            {tipoRaw === 'ATRIBUTO' ? (
              <a href={`Ficha_Atributo.aspx?atributo=${spId}`} className="list-item-heading color-theme-1 link_subrrayado" style={{ fontSize: '1.1rem', fontWeight: 'bold' }} onClick={() => onRegisterReciente && onRegisterReciente(item)}>
                {nombreLimpio}
              </a>
            ) : (
              <p className="list-item-heading mb-0 mr-2" style={{ fontSize: '1rem', fontWeight: 'bold', color: '#D2006E' }}>
                {nombreLimpio}
              </p>
            )}
            <AtributoBadges caracteristicas={item.caracteristicas} datoPersonal={item.dato_personal} goldenRecord={item.golden_record} />
          </div>
          <p className="mb-0 text-muted" style={{ fontSize: '0.8rem', color: '#6c757d' }}>
            <i className="simple-icon-calendar mr-1" /> Últ. act: {fechaAct}
          </p>
        </div>

        {/* Edición inline */}
        {editando && (
          <div className="glosario-item-edit p-3 mt-3 bg-light" style={{ border: '1px solid #d7d7d7', borderRadius: '0.5rem' }}>
            <p className="text-muted mb-2" style={{ fontSize: '0.8rem' }}>Usa la vista "card" para una mejor experiencia de edición.</p>
            <button className="btn btn-secondary btn-sm" onClick={() => setEditando(false)}>Cancelar</button>
          </div>
        )}

        {/* Cuerpo */}
        {!editando && (
          <>
            <p className="mb-1 mt-2" style={{ fontWeight: 600, fontSize: '0.80rem', color: '#d1007e' }}>{tipoRaw}</p>
            <p className="mb-1" style={{ fontWeight: 500, fontSize: '0.80rem', color: '#333' }}>
              <i className="simple-icon-folder-alt mr-1" />
              {domainValue}
              {cuVisible && <span className="glosario-caso-uso" title={cuTexto} style={{ fontSize: '0.85rem', color: '#6c757d', cursor: 'help' }}> | {cuVisible}</span>}
            </p>
            <p
              className="mb-2 text"
              style={{ textAlign: 'justify', lineHeight: 1.5 }}
              dangerouslySetInnerHTML={{ __html: descHtml }}
              onClick={handleBodyClick}
            />
          </>
        )}

        {guardando && <div className="text-center mt-2" style={{ fontSize: '0.8rem', color: '#6c757d' }}><span className="spinner-border spinner-border-sm mr-1" />Guardando...</div>}
      </div>

      {showSeparator && <div className="separator mb-4 mt-4" />}
    </>
  );
}
