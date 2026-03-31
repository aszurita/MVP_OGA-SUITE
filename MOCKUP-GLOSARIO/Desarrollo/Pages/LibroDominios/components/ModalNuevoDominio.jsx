/**
 * ModalNuevoDominio.jsx
 * Modal wizard de 4 pasos para registrar un nuevo dominio.
 * Replica exactamente el modal del ASPX (modalNuevoDominio).
 *
 * Props:
 *   open    — boolean, controla visibilidad
 *   onClose — función llamada al cerrar
 *   onSaved — función llamada tras guardar exitosamente
 */
import { useState, useRef, useEffect } from 'react';
import apiService from '../../../services/apiService.js';

const ROLES = [
  { value: 'Lider de Dominio',                       label: 'Líder de Dominio',           key: 'lider'    },
  { value: 'Custodio de Datos',                       label: 'Custodio de Datos',          key: 'custodio' },
  { value: 'Oficial de Seguridad de la Informacion',  label: 'Oficial de Seguridad',       key: 'seguridad'},
  { value: 'Administradores de Dominio',              label: 'Administrador de Dominio',   key: 'admins'   },
];

const INITIAL_FORM = {
  codigo: '', nombre: '', tipo: '', familia: '',
  com: '', impact: '', liderSugerido: '',
  conceptos: '', descripcion: '', atributos: '',
  avanceFecha: '', avanceOleada: '', avanceEstado: '',
  avancePaso: '', avancePorcentaje: '',
};

const INITIAL_ESTRUCTURA = { lider: [], custodio: [], seguridad: [], admins: [] };

const STEPS = ['1. Identificación', '2. Estructura', '3. Descripción', '4. Avance'];

export default function ModalNuevoDominio({ open, onClose, onSaved }) {
  const [step, setStep]               = useState(1);
  const [form, setForm]               = useState(INITIAL_FORM);
  const [estructura, setEstructura]   = useState(INITIAL_ESTRUCTURA);
  const [empInput, setEmpInput]       = useState('');
  const [empCodigo, setEmpCodigo]     = useState('');
  const [rolSel, setRolSel]           = useState('');
  const [sugerencias, setSugerencias] = useState([]);
  const [saving, setSaving]           = useState(false);
  const [errors, setErrors]           = useState({});
  const debounceRef                   = useRef(null);

  useEffect(() => {
    if (open) {
      setStep(1);
      setForm(INITIAL_FORM);
      setEstructura(INITIAL_ESTRUCTURA);
      setEmpInput(''); setEmpCodigo(''); setRolSel('');
      setSugerencias([]); setErrors({});
    }
  }, [open]);

  // ── Typeahead colaboradores ──────────────────────────────────
  function handleEmpInputChange(e) {
    const val = e.target.value;
    setEmpInput(val);
    setEmpCodigo('');
    clearTimeout(debounceRef.current);
    if (val.length < 2) { setSugerencias([]); return; }
    debounceRef.current = setTimeout(async () => {
      try {
        const rows = await apiService.query({
          campos: 'nombre_empleado, codigo_empleado',
          origen: 'PROCESOS_BI.DBO.T_COLABORADORES',
          condicion: `nombre_empleado LIKE '%${val}%' OR codigo_empleado LIKE '%${val}%'`,
        });
        setSugerencias((rows || []).slice(0, 10));
      } catch {
        setSugerencias([]);
      }
    }, 350);
  }

  function selectEmpleado(emp) {
    const nombre = emp.nombre_empleado || emp.NOMBRE_EMPLEADO || '';
    const codigo = emp.codigo_empleado || emp.CODIGO_EMPLEADO || '';
    setEmpInput(nombre);
    setEmpCodigo(codigo);
    setSugerencias([]);
  }

  // ── Estructura ───────────────────────────────────────────────
  function agregarIntegrante() {
    if (!empInput.trim() || !rolSel) return;
    const rolInfo = ROLES.find(r => r.value === rolSel);
    if (!rolInfo) return;
    setEstructura(prev => ({
      ...prev,
      [rolInfo.key]: [...prev[rolInfo.key], { nombre: empInput, codigo: empCodigo, rol: rolSel }],
    }));
    setEmpInput(''); setEmpCodigo(''); setRolSel('');
  }

  function removerIntegrante(key, idx) {
    setEstructura(prev => ({ ...prev, [key]: prev[key].filter((_, i) => i !== idx) }));
  }

  // ── Validación ───────────────────────────────────────────────
  function validateStep1() {
    const errs = {};
    if (!form.codigo.trim()) errs.codigo = true;
    if (!form.nombre.trim()) errs.nombre = true;
    if (!form.tipo)          errs.tipo   = true;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleNext() {
    if (step === 1 && !validateStep1()) return;
    setStep(s => Math.min(s + 1, 4));
  }

  // ── Guardar ──────────────────────────────────────────────────
  async function handleGuardar(e) {
    e.preventDefault();
    if (!validateStep1()) { setStep(1); return; }
    setSaving(true);
    try {
      const result = await apiService.insert('PROCESOS_BI.DBO.t_mapa_dominios', {
        cod_dominio:        form.codigo,
        descripcion_dominio: form.nombre,
        tipo_dominio:       form.tipo,
        familia:            form.familia,
        concepto:           form.conceptos,
        descripcion:        form.descripcion,
        subdominios:        form.atributos,
        sn_activo:          1,
      });

      const id_dominio = result?.id_dominio || result?.id || null;

      if (id_dominio) {
        const allMembers = [
          ...estructura.lider,
          ...estructura.custodio,
          ...estructura.seguridad,
          ...estructura.admins,
        ];
        for (const m of allMembers) {
          await apiService.insert('PROCESOS_BI.DBO.T_ESTRUCTURA_DOMINIO', {
            id_dominio,
            nombre_empleado: m.nombre,
            codigo_empleado: m.codigo,
            rol: m.rol,
          });
        }
        if (form.avancePaso || form.avancePorcentaje) {
          await apiService.insert('PROCESOS_BI.DBO.T_DOMINIO_AVANCES', {
            id_dominio,
            tarea:       form.avancePaso,
            estado:      form.avanceEstado,
            porcentaje:  form.avancePorcentaje || 0,
            ola:         form.avanceOleada,
            fecha_carga: form.avanceFecha,
          });
        }
      }

      onSaved && onSaved();
      onClose();
    } catch (err) {
      console.error('[ModalNuevoDominio] guardar:', err);
      alert('Error al guardar el dominio. Verifique los datos e intente nuevamente.');
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex={-1}
      role="dialog"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered modal-nuevo-dominio" role="document">
        <div className="modal-content domain-modal">
          <form onSubmit={handleGuardar} noValidate>

            {/* Header */}
            <div className="modal-header domain-modal__header">
              <h5 className="modal-title">
                <i className="iconsminds-library mr-2" />
                Registrar un nuevo dominio
              </h5>
              <button type="button" className="close" onClick={onClose} aria-label="Cerrar">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            {/* Stepper */}
            <div className="domain-stepper">
              <ul className="nav nav-pills justify-content-between domain-wizard-steps">
                {STEPS.map((label, i) => {
                  const n = i + 1;
                  let cls = 'nav-link';
                  if (step === n)  cls += ' active';
                  if (step > n)    cls += ' done';
                  return (
                    <li key={n} className="nav-item">
                      <span
                        className={cls}
                        style={{ cursor: step > n ? 'pointer' : 'default' }}
                        onClick={() => { if (step > n) setStep(n); }}
                      >
                        {label}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Body */}
            <div className="modal-body domain-modal__body">

              {/* ── Paso 1: Identificación ── */}
              {step === 1 && (
                <div className="domain-form-section">
                  <span className="domain-form-section__title">Identificación</span>
                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <label>Código</label>
                      <input
                        className={`form-control${errors.codigo ? ' is-invalid' : ''}`}
                        maxLength={50} placeholder="Ej. DOM-001"
                        value={form.codigo}
                        onChange={e => setForm(f => ({ ...f, codigo: e.target.value }))}
                      />
                      {errors.codigo && <div className="invalid-feedback">Requerido. Debe ser único y sin espacios.</div>}
                    </div>
                    <div className="form-group col-md-6">
                      <label>Nombre del dominio</label>
                      <input
                        className={`form-control${errors.nombre ? ' is-invalid' : ''}`}
                        maxLength={255} placeholder="Nombre visible en la suite"
                        value={form.nombre}
                        onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                      />
                      {errors.nombre && <div className="invalid-feedback">Requerido.</div>}
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <label>Tipo de dominio</label>
                      <select
                        className={`form-control custom-select${errors.tipo ? ' is-invalid' : ''}`}
                        value={form.tipo}
                        onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}
                      >
                        <option value="">Seleccione</option>
                        <option value="Dominio Maestro">Dominio Maestro</option>
                        <option value="Dominio Transaccional">Dominio Transaccional</option>
                        <option value="Dominio Derivado">Dominio Derivado</option>
                      </select>
                      {errors.tipo && <div className="invalid-feedback">Requerido.</div>}
                    </div>
                    <div className="form-group col-md-6">
                      <label>Familia</label>
                      <input
                        className="form-control" maxLength={255} placeholder="Segmento o unidad de negocio"
                        value={form.familia}
                        onChange={e => setForm(f => ({ ...f, familia: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="border-top pt-3 mt-2">
                    <span className="domain-form-section__title">Métricas y estado</span>
                    <div className="form-row align-items-end">
                      <div className="form-group col-md-4">
                        <label>COM</label>
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text"><i className="iconsminds-dashboard" /></span>
                          </div>
                          <input type="number" className="form-control" min={0} step={0.1} placeholder="0"
                            value={form.com} onChange={e => setForm(f => ({ ...f, com: e.target.value }))} />
                        </div>
                      </div>
                      <div className="form-group col-md-4">
                        <label>IMPACT</label>
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text"><i className="iconsminds-line-chart-1" /></span>
                          </div>
                          <input type="number" className="form-control" min={0} step={0.1} placeholder="0"
                            value={form.impact} onChange={e => setForm(f => ({ ...f, impact: e.target.value }))} />
                        </div>
                      </div>
                      <div className="form-group col-md-4">
                        <label>Líder sugerido</label>
                        <input className="form-control" maxLength={255} placeholder="Nombre o rol"
                          value={form.liderSugerido} onChange={e => setForm(f => ({ ...f, liderSugerido: e.target.value }))} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Paso 2: Estructura ── */}
              {step === 2 && (
                <div className="domain-form-section">
                  <span className="domain-form-section__title">Estructura inicial</span>
                  <div className="form-row align-items-end mb-2">
                    <div className="form-group col-12 col-md-7 position-relative mb-2 mb-md-0">
                      <input
                        className="form-control"
                        placeholder="Escribe para filtrar colaborador"
                        value={empInput}
                        onChange={handleEmpInputChange}
                        autoComplete="off"
                      />
                      {sugerencias.length > 0 && (
                        <div className="typeahead-menu">
                          {sugerencias.map((emp, i) => (
                            <div key={i} className="item" onClick={() => selectEmpleado(emp)}>
                              {emp.nombre_empleado || emp.NOMBRE_EMPLEADO}
                              {(emp.codigo_empleado || emp.CODIGO_EMPLEADO) && (
                                <small className="text-muted ml-2">
                                  ({emp.codigo_empleado || emp.CODIGO_EMPLEADO})
                                </small>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      <small className="text-muted d-block mt-1">
                        Escribe para buscar por nombre, usuario o código.
                      </small>
                    </div>
                    <div className="form-group col-12 col-md-3 mb-2 mb-md-0" style={{ paddingBottom: '19px' }}>
                      <select className="form-control" value={rolSel} onChange={e => setRolSel(e.target.value)}>
                        <option value="">Selecciona un rol</option>
                        {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                      </select>
                    </div>
                    <div className="form-group col-12 col-md-2 d-flex align-items-end">
                      <button type="button" className="btn btn-primary btn-block w-100" onClick={agregarIntegrante}>
                        Agregar
                      </button>
                    </div>
                  </div>

                  <div className="domain-structure-grid">
                    {[
                      { key: 'lider',    label: 'Líder de Dominio',               icon: 'simple-icon-user',   cls: 'structure-card--lider'    },
                      { key: 'custodio', label: 'Custodio de Datos',              icon: 'simple-icon-layers', cls: 'structure-card--custodio' },
                      { key: 'seguridad',label: 'Oficial de Seguridad',           icon: 'simple-icon-shield', cls: 'structure-card--seguridad'},
                      { key: 'admins',   label: 'Administradores de Dominio',     icon: 'simple-icon-menu',   cls: 'structure-card--admins'   },
                    ].map(({ key, label, icon, cls }) => (
                      <div key={key} className={`structure-card ${cls}`}>
                        <div className="structure-card__header">
                          <h6>{label}</h6>
                          <i className={`${icon} structure-card__icon`} />
                        </div>
                        {estructura[key].length === 0
                          ? <small className="text-muted d-block mt-1">Sin asignar</small>
                          : (
                            <ul className="structure-list">
                              {estructura[key].map((m, i) => (
                                <li key={i}>
                                  <span className="structure-pill">{i + 1}</span>
                                  <div className="structure-meta">
                                    <strong>{m.nombre}</strong>
                                    {m.codigo && <small>{m.codigo}</small>}
                                  </div>
                                  <button
                                    type="button"
                                    className="structure-remove"
                                    onClick={() => removerIntegrante(key, i)}
                                    aria-label="Eliminar"
                                  >
                                    &times;
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )
                        }
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Paso 3: Descripción ── */}
              {step === 3 && (
                <div className="domain-form-section">
                  <span className="domain-form-section__title">Descripción</span>
                  <div className="form-group">
                    <label>Conceptos clave</label>
                    <textarea className="form-control" rows={2} placeholder="Palabras clave o componentes principales"
                      value={form.conceptos} onChange={e => setForm(f => ({ ...f, conceptos: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label>Descripción</label>
                    <textarea className="form-control" rows={3} placeholder="Explica el alcance y los objetivos del dominio"
                      value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} />
                  </div>
                  <div className="form-group mb-0">
                    <label>Atributos básicos</label>
                    <textarea className="form-control" rows={2} placeholder="Separados por coma o salto de línea"
                      value={form.atributos} onChange={e => setForm(f => ({ ...f, atributos: e.target.value }))} />
                  </div>
                </div>
              )}

              {/* ── Paso 4: Avance ── */}
              {step === 4 && (
                <div className="domain-form-section">
                  <span className="domain-form-section__title">Avance inicial</span>
                  <p className="domain-form-section__helper">
                    Registra el estado inicial para que aparezca en los reportes.
                  </p>
                  <div className="form-row">
                    <div className="form-group col-md-4">
                      <label>Fecha de carga</label>
                      <input type="date" className="form-control"
                        value={form.avanceFecha} onChange={e => setForm(f => ({ ...f, avanceFecha: e.target.value }))} />
                    </div>
                    <div className="form-group col-md-4">
                      <label>Oleada</label>
                      <input className="form-control" placeholder="Ej. 2024-Q1"
                        value={form.avanceOleada} onChange={e => setForm(f => ({ ...f, avanceOleada: e.target.value }))} />
                    </div>
                    <div className="form-group col-md-4">
                      <label>Estado</label>
                      <select className="form-control"
                        value={form.avanceEstado} onChange={e => setForm(f => ({ ...f, avanceEstado: e.target.value }))}>
                        <option value="">Seleccione</option>
                        <option value="NO INICIADO">No iniciado</option>
                        <option value="EN PROCESO">En proceso</option>
                        <option value="FINALIZADO">Finalizado</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group col-md-8">
                      <label>Paso / Hito</label>
                      <input className="form-control" placeholder="Ej. Inicio de levantamiento de información"
                        value={form.avancePaso} onChange={e => setForm(f => ({ ...f, avancePaso: e.target.value }))} />
                    </div>
                    <div className="form-group col-md-4">
                      <label>Porcentaje</label>
                      <div className="input-group">
                        <input type="number" className="form-control" min={0} max={100} step={1} placeholder="0"
                          value={form.avancePorcentaje} onChange={e => setForm(f => ({ ...f, avancePorcentaje: e.target.value }))} />
                        <div className="input-group-append">
                          <span className="input-group-text">%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <small className="text-muted">
                    Si lo dejas vacío, el dominio se creará sin avance inicial.
                  </small>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="modal-footer domain-modal__footer">
              <div className="domain-modal__feedback">
                <i className="simple-icon-info mr-1" />
                <small>
                  La información se registrará en T_MAPA_DOMINIOS, T_ESTRUCTURA_DOMINIO y T_DOMINIO_AVANCES.
                </small>
              </div>
              <div className="domain-modal__actions">
                <span className="domain-pagination__label">Paso {step} de 4</span>
                <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                  Cancelar
                </button>
                {step > 1 && (
                  <button type="button" className="btn btn-outline-primary" onClick={() => setStep(s => s - 1)}>
                    Anterior
                  </button>
                )}
                {step < 4 ? (
                  <button type="button" className="btn btn-primary" onClick={handleNext}>
                    Siguiente
                  </button>
                ) : (
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Guardando…' : 'Guardar dominio'}
                  </button>
                )}
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
