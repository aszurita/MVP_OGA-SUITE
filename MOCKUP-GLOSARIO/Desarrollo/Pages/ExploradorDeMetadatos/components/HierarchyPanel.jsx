import { useState, useEffect } from 'react';
import { getArbol } from '../../../services/metadataService.js';

/* ── Icono tabla (hojas del árbol) ── */
function TableIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round" width="13" height="13" style={{ flexShrink: 0 }}>
      <path d="M3 5h18M3 10h18M3 15h18M3 20h18M8 5v15M16 5v15" />
    </svg>
  );
}

/* ── Icono chevron ── */
function Chevron({ open }) {
  return (
    <svg viewBox="0 0 12 12" fill="none" width="10" height="10" style={{ flexShrink: 0, transition: 'transform .15s', transform: open ? 'rotate(90deg)' : 'none' }}>
      <path d="M4 2.5L8 6L4 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/* ── Nodo genérico expandible ── */
function TreeNode({ label, level = 0, active, onClick, children }) {
  const [open, setOpen] = useState(false);
  const indent = level * 14;

  function handleClick(e) {
    e.stopPropagation();
    setOpen((v) => !v);
    if (onClick) onClick();
  }

  return (
    <div>
      <div
        className={`em-tree-node${active ? ' is-active' : ''}`}
        style={{ paddingLeft: 10 + indent }}
        onClick={handleClick}
      >
        <Chevron open={open} />
        <span className="em-tree-label">{label}</span>
      </div>
      {open && <div>{children}</div>}
    </div>
  );
}

/* ── Hoja tabla ── */
function TreeLeaf({ label, active, onClick }) {
  return (
    <div
      className={`em-tree-leaf${active ? ' is-active' : ''}`}
      style={{ paddingLeft: 10 + 3 * 14 }}
      onClick={(e) => { e.stopPropagation(); if (onClick) onClick(); }}
    >
      <TableIcon />
      <span className="em-tree-label">{label}</span>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   PANEL PRINCIPAL
   ════════════════════════════════════════════════════════════ */
export default function HierarchyPanel({ q, activeServidor, activeBase, activeEsquema, onSelectServidor, onSelectBase, onSelectEsquema, onSelectTabla, onClose }) {
  const [tree, setTree] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getArbol().then(setTree).catch(console.error).finally(() => setLoading(false));
  }, []);

  /* Filtra el árbol por q (nombre de tabla contiene q) */
  function filterTree(raw) {
    if (!q || !q.trim()) return raw;
    const upper = q.trim().toUpperCase();
    const result = {};
    for (const [sv, bases] of Object.entries(raw)) {
      for (const [ba, esquemas] of Object.entries(bases)) {
        for (const [es, tablas] of Object.entries(esquemas)) {
          const match = tablas.filter((t) => t.tabla.toUpperCase().includes(upper));
          if (match.length > 0) {
            result[sv] = result[sv] || {};
            result[sv][ba] = result[sv][ba] || {};
            result[sv][ba][es] = match;
          }
        }
      }
    }
    return result;
  }

  const displayed = tree ? filterTree(tree) : {};

  return (
    <div className="card mr-4">

      {/* Árbol */}
      <div className="card-body">
        {loading && (
          <div className="em-tree-loading">
            <div className="spinner-border" style={{ width: '1.2rem', height: '1.2rem', color: '#D6006D' }} role="status" />
          </div>
        )}

        {!loading && Object.keys(displayed).length === 0 && (
          <div className="em-tree-empty">Sin resultados</div>
        )}

        {!loading && Object.entries(displayed).map(([servidor, bases]) => (
          <TreeNode
            key={servidor}
            label={servidor}
            level={0}
            active={activeServidor === servidor && !activeBase}
            onClick={() => onSelectServidor(servidor)}
          >
            {Object.entries(bases).map(([base, esquemas]) => (
              <TreeNode
                key={base}
                label={base}
                level={1}
                active={activeServidor === servidor && activeBase === base && !activeEsquema}
                onClick={() => onSelectBase && onSelectBase({ servidor, base })}
              >
                {Object.entries(esquemas).map(([esquema, tablas]) => (
                  <TreeNode
                    key={esquema}
                    label={esquema}
                    level={2}
                    active={activeServidor === servidor && activeBase === base && activeEsquema === esquema}
                    onClick={() => onSelectEsquema && onSelectEsquema({ servidor, base, esquema })}
                  >
                    {tablas.map(({ tabla }) => (
                      <TreeLeaf
                        key={tabla}
                        label={tabla}
                      />
                    ))}
                  </TreeNode>
                ))}
              </TreeNode>
            ))}
          </TreeNode>
        ))}
      </div>
    </div>
  );
}
