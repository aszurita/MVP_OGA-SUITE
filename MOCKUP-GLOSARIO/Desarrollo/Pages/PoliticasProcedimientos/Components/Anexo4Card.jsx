export default function Anexo4Card({ doc }) {
  return (
    <div className="pp-doc-card pp-doc-card-anexo">
      <div className="pp-doc-title">{doc.title}</div>
      <div className="pp-doc-sub">{doc.desc}</div>

      {doc.links?.length ? (
        <div className="pp-link-list">
          {doc.links.map((lnk, i) => (
            <div key={i} className="pp-link-item">
              <span className="pp-link-label">{lnk.label}</span>
              <a className="pp-link" href={lnk.href} target="_blank" rel="noopener noreferrer">
                {lnk.linkLabel ?? 'Abrir enlace'}
              </a>
            </div>
          ))}
        </div>
      ) : null}

      {doc.subcards?.length ? (
        <div className="pp-subcards">
          {doc.subcards.map((sc, i) => (
            <div key={i} className="pp-subcard">
              <div className="pp-subcard-title">{sc.title}</div>
              <div className="pp-subcard-note">{sc.note}</div>
              {sc.href ? (
                <a className="pp-link" href={sc.href} target="_blank" rel="noopener noreferrer">
                  {sc.linkLabel ?? 'Abrir enlace'}
                </a>
              ) : (
                <span className="pp-tag">{sc.tag}</span>
              )}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
