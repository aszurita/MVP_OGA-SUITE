/**
 * AvanceDominio.jsx
 * Panel izquierdo con el checklist de avances de un dominio.
 *
 * Props:
 *   avances — array de { tarea, estado, porcentaje }
 *             Si está vacío, muestra checklist por defecto.
 */

const AVANCES_DEFAULT = [
  { tarea: 'Definir del Líder',                                         estado: 'Completado', porcentaje: 100 },
  { tarea: 'Definir Administrador(es)',                                  estado: 'Completado', porcentaje: 100 },
  { tarea: 'Definir Custodio(s)',                                        estado: 'Completado', porcentaje: 100 },
  { tarea: 'Definición del Dominio (Alcances y Fronteras)',              estado: 'Completado', porcentaje: 100 },
  { tarea: 'Conceptos relevantes',                                       estado: 'Completado', porcentaje: 100 },
  { tarea: 'Estándares de Calidad para cada atributo o CDE',            estado: 'En Proceso', porcentaje: 90  },
  { tarea: 'Revisión de Procesos y Políticas',                          estado: 'Completado', porcentaje: 100 },
  { tarea: 'Diagnóstico y/o Evaluación de reglas de calidad',           estado: 'En Proceso', porcentaje: 60  },
  { tarea: 'Propuesta de remediación',                                  estado: 'Completado', porcentaje: 100 },
  { tarea: 'Despliegue de la remediación',                              estado: 'En Proceso', porcentaje: 50  },
];

export default function AvanceDominio({ avances }) {
  const lista = avances && avances.length > 0 ? avances : AVANCES_DEFAULT;

  return (
    <div className="avances-panel">
      <h6>
        <i className="iconsminds-check mr-2" style={{ color: '#D2006E' }} />
        Avance del Dominio
      </h6>

      {lista.map((item, idx) => {
        const estado       = item.estado || '';
        const pct          = parseFloat(item.porcentaje) || (estado === 'Completado' ? 100 : 0);
        const completado   = estado.toLowerCase() === 'completado';
        const statusClass  = completado ? 'completado' : 'en-proceso';
        const barClass     = completado ? 'completado' : 'en-proceso';

        return (
          <div key={idx} className="avance-item">
            <div className="avance-item-header">
              <span className="avance-item-label">
                {completado
                  ? <i className="simple-icon-check mr-1" style={{ color: '#2e7d32', fontSize: '0.7rem' }} />
                  : <i className="simple-icon-clock mr-1" style={{ color: '#e65100', fontSize: '0.7rem' }} />
                }
                {item.tarea}
              </span>
              <span className={`avance-status ${statusClass}`}>
                {estado}
                {!completado && pct > 0 ? ` ${pct}%` : ''}
              </span>
            </div>
            <div className="avance-progress">
              <div
                className={`avance-progress-bar ${barClass}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
