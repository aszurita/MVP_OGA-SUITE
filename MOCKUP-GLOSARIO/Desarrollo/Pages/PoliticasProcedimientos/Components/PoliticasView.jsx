import { useState } from 'react';
import DocChip from './DocChip';
import PdfViewer from './PdfViewer';

export default function PoliticasView({ section }) {
  const [mode, setMode] = useState('word');
  const doc = section.docs[0];
  const src = mode === 'word' ? doc.word : doc.slides;

  return (
    <>
      <div className="pp-doc-card-actions left" style={{ marginBottom: 12 }}>
        <DocChip letter="W" label="Ver documento" onClick={() => setMode('word')} />
        <DocChip letter="P" label="Ver presentacion" onClick={() => setMode('slides')} />
      </div>
      <PdfViewer src={src} />
    </>
  );
}
