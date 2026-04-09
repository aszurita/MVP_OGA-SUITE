import { SlPencil } from 'react-icons/sl';

export default function FieldViewBody({ items, onEditField }) {
  return (
    <tbody>
      {items.map((row, index) => (
        <tr key={row.id || `${row.llave_unica || row.campo || 'campo'}-${index}`}>
          <td className="em-cell-emphasis">
            <span className="em-field-pencil-wrap">
              <button
                type="button"
                className="do-pencil-btn em-field-pencil-btn"
                title={`Documentar campo ${row.campo}`}
                onClick={(e) => { e.stopPropagation(); onEditField && onEditField(row); }}
              >
                <SlPencil size={14} />
              </button>
              {row.campo || '-'}
            </span>
          </td>
          <td>{row.codigo || ''}</td>
          <td title={row.atributo}>{row.atributo || ''}</td>
          <td title={row.definicion}>{row.definicion || ''}</td>
          <td>{row.plataforma || '-'}</td>
          <td>{row.servidor || '-'}</td>
          <td>{row.base || '-'}</td>
          <td>{row.esquema || '-'}</td>
          <td>{row.tabla || '-'}</td>
          <td>{row.tipo || '-'}</td>
          <td>{row.largo || '-'}</td>
          <td>{row.permite_null || '-'}</td>
        </tr>
      ))}
    </tbody>
  );
}
