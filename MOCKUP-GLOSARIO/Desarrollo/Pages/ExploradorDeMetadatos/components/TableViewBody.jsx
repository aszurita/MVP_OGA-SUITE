import TablaCell from './TablaCell.jsx';
import ClasificacionBadge from './ClasificacionBadge.jsx';
import AvanceCell from './AvanceCell.jsx';

export default function TableViewBody({ items, onRowClick, onPencilClick }) {
  return (
    <tbody>
      {items.map((row, index) => (
        <tr
          key={`${row.llave_tabla || row.tabla || 'tabla'}-${index}`}
          className="em-row-clickable"
          onClick={() => onRowClick && onRowClick(row)}
          title={`Ver campos de ${row.tabla}`}
        >
          <td>{row.plataforma || '-'}</td>
          <td>{row.servidor || '-'}</td>
          <td>{row.base || '-'}</td>
          <td>{row.esquema || '-'}</td>
          <TablaCell
            tabla={row.tabla}
            dataOwner={row.nombre_data_owner}
            dataSteward={row.nombre_data_steward}
            row={row}
            onPencilClick={onPencilClick}
          />
          <td title={row.descripcion}>{row.descripcion || '-'}</td>
          <td><ClasificacionBadge value={row.clasificacion} /></td>
          <td><AvanceCell value={row.avance} /></td>
        </tr>
      ))}
    </tbody>
  );
}
