/**
 * Detecta si el texto sobre un fondo debe ser blanco o negro
 * según la luminancia del color de fondo.
 * @param {string} hexColor - Color en formato hex (#RRGGBB)
 * @returns {string} - '#FFFFFF' o '#000000'
 */
export function getContrastColor(hexColor) {
  if (!hexColor) return '#000000';
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  // Fórmula de luminancia relativa (WCAG)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

/**
 * Parsea el texto con {palabra} y devuelve un array de segmentos.
 * @param {string} texto
 * @param {string[]} palabrasHipervinculo
 * @returns {Array<{text: string, isLink: boolean}>}
 */
export function parseTextWithLinks(texto, palabrasHipervinculo = []) {
  if (!palabrasHipervinculo.length) return [{ text: texto, isLink: false }];

  const regex = /\{([^}]+)\}/g;
  const segments = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(texto)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ text: texto.slice(lastIndex, match.index), isLink: false });
    }
    segments.push({ text: match[1], isLink: true });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < texto.length) {
    segments.push({ text: texto.slice(lastIndex), isLink: false });
  }

  return segments;
}

/**
 * Formatea fecha ISO a formato legible
 */
export function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-EC', { year: 'numeric', month: '2-digit', day: '2-digit' });
  } catch {
    return dateStr;
  }
}
