/**
 * DominioCarta.jsx
 * Tarjeta visual de un dominio en el Libro de Dominios.
 * Replica exactamente el comportamiento del ASPX original (suite.js cargarDominios).
 *
 * Props:
 *   dominio  — objeto con id_dominio, nombre_dominio, tipo_dominio,
 *               porcentaje_avance, color_dominio
 *   onClick  — función(id_dominio, nombre_dominio)
 */

// Colores fijos por tipo — idénticos a los del ASPX
const COLOR_POR_TIPO = {
  maestro: '#D2006E',  // rosa banco
  transaccional: '#160F41',  // azul oscuro
  derivado: '#9FDCEE',  // celeste
};

function colorPorTipo(tipo_dominio) {
  const t = (tipo_dominio || '').toLowerCase();
  if (t.includes('maestro')) return COLOR_POR_TIPO.maestro;
  if (t.includes('transaccional')) return COLOR_POR_TIPO.transaccional;
  if (t.includes('derivado')) return COLOR_POR_TIPO.derivado;
  return '#D2006E';
}

// CSS class equivalente al ASPX: "Dominio-Maestro", "Dominio-Transaccional", "Dominio-Derivado"
function getTipoClass(tipo_dominio) {
  const t = (tipo_dominio || '').toLowerCase();
  if (t.includes('maestro')) return 'Dominio-Maestro';
  if (t.includes('transaccional')) return 'Dominio-Transaccional';
  if (t.includes('derivado')) return 'Dominio-Derivado';
  return '';
}

export default function DominioCarta({ dominio, onClick }) {
  const {
    id_dominio,
    nombre_dominio,
    porcentaje_avance = 0,
    color_dominio,
    tipo_dominio,
  } = dominio;

  const color = color_dominio || colorPorTipo(tipo_dominio);
  const avance = parseFloat(porcentaje_avance) || 0;
  const tieneAvance = avance > 0;
  const tipoClass = getTipoClass(tipo_dominio);
  const esDerivado = tipoClass === 'Dominio-Derivado';

  // Sin avance: fondo sólido con color del tipo
  // Con avance: fondo blanco, borde coloreado (= class "activo" en el ASPX)
  const cardStyle = tieneAvance
    ? { backgroundColor: '#fff', borderColor: color }
    : { backgroundColor: color };

  // Texto: derivado sin avance usa texto oscuro (igual que .box.Dominio-Derivado en style.css)
  const nombreColor = tieneAvance ? (esDerivado ? '#160F41' : color) : (esDerivado ? '#160F41' : '#fff');

  // Tooltip solo cuando tiene avance, igual que el ASPX
  const tooltipText = tieneAvance
    ? `Avance: ${avance.toFixed(0)}%`
    : undefined;

  function handleClick() {
    if (onClick) onClick(id_dominio, nombre_dominio);
  }

  return (
    <div
      className={`dominio-carta ${tipoClass}${tieneAvance ? ' activo' : ''}`}
      style={cardStyle}
      data-tooltip={tooltipText}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
      aria-label={`Dominio ${nombre_dominio}${tooltipText ? ', ' + tooltipText : ''}`}
    >
      <span className="nombre" style={{ color: nombreColor }}>
        {nombre_dominio}
      </span>
    </div>
  );
}
