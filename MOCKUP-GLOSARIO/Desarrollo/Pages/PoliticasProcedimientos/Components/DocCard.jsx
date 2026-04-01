import Anexo4Card from './Anexo4Card';
import DocChip from './DocChip';

export default function DocCard({ doc, onOpen }) {
  if (doc.subcards || doc.links) return <Anexo4Card doc={doc} />;

  return (
    <div className={`pp-doc-card${doc.missing ? ' missing' : ''}`}>
      <p className="pp-doc-card-title">{doc.title}</p>
      <p className="pp-doc-card-desc">{doc.desc}</p>

      {!doc.missing && (
        <div className="pp-doc-card-actions">
          {doc.word && (
            <DocChip
              letter="W"
              label="Ver documento"
              onClick={() => onOpen({ pdf: doc.word, title: doc.title })}
            />
          )}
          {doc.slides && (
            <DocChip
              letter="P"
              label="Ver presentacion"
              onClick={() => onOpen({ pdf: doc.slides, title: doc.title })}
            />
          )}
        </div>
      )}
    </div>
  );
}
