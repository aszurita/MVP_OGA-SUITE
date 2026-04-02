export default function PdfViewer({ src }) {
  return (
    <div className="pp-pdf-wrap">
      <iframe key={src} src={src} title="Visor de documento" loading="lazy">
        <p className="pp-pdf-error">
          Tu navegador no puede mostrar el PDF.{' '}
          <a href={src} target="_blank" rel="noopener noreferrer">Abrir aqui</a>
        </p>
      </iframe>
    </div>
  );
}
