// Configurable base URL — change to production endpoint when deploying
const BASE_URL = 'http://localhost:8000';

async function apiFetch(path, params = {}) {
  const url = new URL(BASE_URL + path);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== null && v !== undefined && v !== '') url.searchParams.set(k, v);
  });
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
  return res.json();
}

export function checkHealth() {
  return apiFetch('/health');
}

export function getFilters() {
  return apiFetch('/filters');
}

export function getTableView({ plataforma, servidor, base, esquema, tabla, q, page = 1, page_size = 20 } = {}) {
  return apiFetch('/metadata/tables', { plataforma, servidor, base, esquema, tabla, q, page, page_size });
}

export function getFieldView({ plataforma, servidor, base, esquema, tabla, campo, codigo, q, page = 1, page_size = 20 } = {}) {
  return apiFetch('/metadata/fields', { plataforma, servidor, base, esquema, tabla, campo, codigo, q, page, page_size });
}

export function getRecordDetail(id) {
  return apiFetch(`/metadata/record/${id}`);
}
