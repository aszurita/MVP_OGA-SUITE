import { useState, useEffect, useRef } from 'react';
import { X, Send } from 'lucide-react';
import '../styles/CommentsModal.css';

const STORAGE_KEY = 'oga-comments';

function renderText(text) {
  const parts = text.split(/(@\w+)/g);
  return parts.map((part, i) =>
    part.startsWith('@')
      ? <span key={i} className="cm-mention">{part}</span>
      : part
  );
}

function loadComments() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}

function saveComments(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export default function CommentsModal({ onClose }) {
  const [comments, setComments] = useState(loadComments);
  const [text, setText] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const next = [
      ...comments,
      {
        id: Date.now(),
        autor: 'Tú',
        texto: trimmed,
        hora: new Date().toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' }),
      },
    ];
    setComments(next);
    saveComments(next);
    setText('');
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div className="cm-panel">
        <div className="cm-header">
          <span className="cm-title">Comentarios</span>
          <button className="cm-close" onClick={onClose}><X size={15} /></button>
        </div>

        <div className="cm-list">
          {comments.length === 0 && (
            <p className="cm-empty">Aún no hay comentarios. ¡Sé el primero!</p>
          )}
          {comments.map((c) => (
            <div key={c.id} className="cm-item">
              <div className="cm-avatar">{c.autor[0]}</div>
              <div className="cm-bubble">
                <div className="cm-meta">
                  <span className="cm-autor">{c.autor}</span>
                  <span className="cm-hora">{c.hora}</span>
                </div>
                <p className="cm-texto">{renderText(c.texto)}</p>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="cm-input-row">
          <textarea
            className="cm-input"
            placeholder="Escribe un comentario... usa @nombre para mencionar"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKey}
            rows={2}
          />
          <button className="cm-send" onClick={handleSend}>
            <Send size={15} />
          </button>
        </div>
    </div>
  );
}
