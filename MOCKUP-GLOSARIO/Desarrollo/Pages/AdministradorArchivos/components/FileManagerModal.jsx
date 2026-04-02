import { useEffect, useRef, useState } from 'react';

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error ?? 'No se pudo completar la solicitud.');
  }

  return data;
}

function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result ?? '');
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64);
    };
    reader.onerror = () => reject(new Error(`No se pudo leer ${file.name}.`));
    reader.readAsDataURL(file);
  });
}

export default function FileManagerModal({ isOpen, onClose }) {
  const [path, setPath] = useState([]);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  async function loadEntries(nextPath = path) {
    try {
      setLoading(true);
      setError('');
      const query = encodeURIComponent(nextPath.join('/'));
      const data = await requestJson(`/api/docs/list?path=${query}`, { method: 'GET', headers: {} });
      setEntries(data.entries ?? []);
    } catch (err) {
      setError(err?.message ?? 'No se pudo leer la carpeta actual.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!isOpen) return;
    loadEntries(path);
  }, [isOpen, path]);

  async function handleCreateFolder() {
    const name = window.prompt('Nombre de la nueva carpeta');
    if (!name?.trim()) return;

    try {
      setLoading(true);
      setError('');
      await requestJson('/api/docs/folder', {
        method: 'POST',
        body: JSON.stringify({ path: path.join('/'), name: name.trim() }),
      });
      await loadEntries(path);
    } catch (err) {
      setError(err?.message ?? 'No se pudo crear la carpeta.');
      setLoading(false);
    }
  }

  async function handleUploadFiles(event) {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    try {
      setLoading(true);
      setError('');
      const payloadFiles = await Promise.all(
        files.map(async (file) => ({
          name: file.name,
          contentBase64: await fileToBase64(file),
        })),
      );

      await requestJson('/api/docs/upload', {
        method: 'POST',
        body: JSON.stringify({
          path: path.join('/'),
          files: payloadFiles,
        }),
      });

      await loadEntries(path);
    } catch (err) {
      setError(err?.message ?? 'No se pudieron subir los archivos.');
      setLoading(false);
    } finally {
      event.target.value = '';
    }
  }

  async function handleDelete(entry) {
    const confirmed = window.confirm(`Eliminar ${entry.kind === 'directory' ? 'la carpeta' : 'el archivo'} "${entry.name}"?`);
    if (!confirmed) return;

    try {
      setLoading(true);
      setError('');
      await requestJson('/api/docs/delete', {
        method: 'POST',
        body: JSON.stringify({
          path: path.join('/'),
          name: entry.name,
          recursive: entry.kind === 'directory',
        }),
      });
      await loadEntries(path);
    } catch (err) {
      setError(err?.message ?? 'No se pudo eliminar el elemento.');
      setLoading(false);
    }
  }

  async function handleRename(entry) {
    const nextName = window.prompt('Nuevo nombre', entry.name);
    if (!nextName?.trim() || nextName === entry.name) return;

    try {
      setLoading(true);
      setError('');
      await requestJson('/api/docs/rename', {
        method: 'POST',
        body: JSON.stringify({
          path: path.join('/'),
          oldName: entry.name,
          newName: nextName.trim(),
        }),
      });
      await loadEntries(path);
    } catch (err) {
      setError(err?.message ?? 'No se pudo renombrar el elemento.');
      setLoading(false);
    }
  }

  function openDirectory(name) {
    setPath((current) => [...current, name]);
  }

  function goToBreadcrumb(index) {
    if (index === 0) {
      setPath([]);
      return;
    }

    setPath((current) => current.slice(0, index));
  }

  function handlePreview(entry) {
    if (entry.kind !== 'file') return;
    const currentPath = [...path, entry.name].join('/');
    const query = encodeURIComponent(currentPath);
    window.open(`/api/docs/file?path=${query}`, '_blank', 'noopener,noreferrer');
  }

  if (!isOpen) return null;

  const breadcrumbs = ['docs', ...path];
  const currentDirName = breadcrumbs[breadcrumbs.length - 1];

  return (
    <div className="pp-file-manager-overlay" role="dialog" aria-modal="true" aria-label="Administrador de archivos">
      <div className="pp-file-manager-modal">
        <div className="pp-file-manager-header">
          <div className='Header-title'>
            <h2>Administrador de docs</h2>
            <p>Gestiona solo el contenido dentro de `public/docs` y sus subcarpetas.</p>
          </div>
          <button type="button" className="pp-file-manager-close" onClick={onClose}>
            Cerrar
          </button>
        </div>

        <div className="pp-file-manager-toolbar">
          <button type="button" className="pp-file-manager-action" onClick={handleCreateFolder} disabled={loading}>
            Nueva carpeta
          </button>
          <button
            type="button"
            className="pp-file-manager-action"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
          >
            Subir archivos
          </button>
          <input ref={fileInputRef} type="file" multiple hidden onChange={handleUploadFiles} />
        </div>

        <div className="pp-file-manager-breadcrumbs">
          {breadcrumbs.map((crumb, index) => (
            <button
              key={`${crumb}-${index}`}
              type="button"
              className={`pp-file-manager-crumb${index === breadcrumbs.length - 1 ? ' active' : ''}`}
              onClick={() => goToBreadcrumb(index)}
            >
              {crumb}
            </button>
          ))}
        </div>

        <div className="pp-file-manager-current">
          <span>Carpeta actual: {currentDirName}</span>
          {loading && <span>Cargando...</span>}
        </div>

        {error && <div className="pp-file-manager-alert error">{error}</div>}

        <div className="pp-file-manager-list">
          {!loading && !entries.length && (
            <div className="pp-file-manager-empty">Esta carpeta no tiene elementos.</div>
          )}

          {entries.map((entry) => (
            <div key={`${entry.kind}-${entry.name}`} className="pp-file-manager-row">
              <button
                type="button"
                className="pp-file-manager-entry"
                onClick={() => (entry.kind === 'directory' ? openDirectory(entry.name) : handlePreview(entry))}
              >
                <span className={`pp-file-manager-badge ${entry.kind}`}>{entry.kind === 'directory' ? 'DIR' : 'FILE'}</span>
                <span className="pp-file-manager-name">{entry.name}</span>
                <span className="pp-file-manager-size">{entry.kind === 'file' ? formatBytes(entry.size) : ''}</span>
              </button>

              <div className="pp-file-manager-row-actions">
                {entry.kind === 'file' && (
                  <button type="button" className="pp-file-manager-mini" onClick={() => handlePreview(entry)}>
                    Abrir
                  </button>
                )}
                <button type="button" className="pp-file-manager-mini" onClick={() => handleRename(entry)}>
                  Renombrar
                </button>
                <button type="button" className="pp-file-manager-mini danger" onClick={() => handleDelete(entry)}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
