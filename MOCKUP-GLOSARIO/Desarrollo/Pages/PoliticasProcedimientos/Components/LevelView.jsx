import DocCard from './DocCard';
import PdfViewer from './PdfViewer';

export default function LevelView({ section, activeDoc, onOpen }) {
  if (activeDoc) {
    return <PdfViewer src={activeDoc.pdf} />;
  }

  return (
    <>
      <div className="pp-section-header">
        <span className="pp-section-chip">
          <span className="pp-section-chip-icon" aria-hidden="true">
            <span /><span /><span />
          </span>
          {section.sectionLabel}
        </span>
      </div>

      <div className="pp-cards-grid">
        {section.docs.map((doc) => (
          <DocCard key={doc.id} doc={doc} onOpen={onOpen} />
        ))}
      </div>
    </>
  );
}
