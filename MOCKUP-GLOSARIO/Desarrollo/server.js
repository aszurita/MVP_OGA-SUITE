import fs from 'fs';
import fsp from 'fs/promises';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = Number(process.env.PORT || 80);
const host = process.env.HOST || '0.0.0.0';
const distRoot = path.resolve(__dirname, 'dist');
const docsRoot = path.resolve(process.env.DOCS_ROOT || path.join(distRoot, 'docs'));

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

function sendText(res, statusCode, text, contentType = 'text/plain; charset=utf-8') {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', contentType);
  res.end(text);
}

function isWithinRoot(rootPath, targetPath) {
  const relative = path.relative(rootPath, targetPath);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

function sanitizeRelativePath(input = '') {
  const normalized = String(input).replace(/\\/g, '/').trim();
  const parts = normalized.split('/').filter(Boolean);

  for (const part of parts) {
    if (part === '.' || part === '..') {
      throw new Error('Ruta invalida.');
    }
  }

  return parts;
}

function sanitizeEntryName(input = '') {
  const name = String(input).trim();

  if (!name || name.includes('/') || name.includes('\\') || name === '.' || name === '..') {
    throw new Error('Nombre invalido.');
  }

  return name;
}

function resolveDocsPath(relativePath = '') {
  const parts = sanitizeRelativePath(relativePath);
  const targetPath = path.resolve(docsRoot, ...parts);

  if (!isWithinRoot(docsRoot, targetPath)) {
    throw new Error('Acceso fuera de docs no permitido.');
  }

  return targetPath;
}

function resolveStaticPath(urlPathname) {
  const safePath = decodeURIComponent(urlPathname).replace(/^\/+/, '');
  const targetPath = path.resolve(distRoot, safePath);

  if (!isWithinRoot(distRoot, targetPath)) {
    return null;
  }

  return targetPath;
}

async function readJsonBody(req) {
  const chunks = [];

  for await (const chunk of req) {
    chunks.push(chunk);
  }

  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

async function listEntries(relativePath) {
  const dirPath = resolveDocsPath(relativePath);
  const entries = await fsp.readdir(dirPath, { withFileTypes: true });
  const results = [];

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    let size = null;

    if (entry.isFile()) {
      const stats = await fsp.stat(fullPath);
      size = stats.size;
    }

    results.push({
      name: entry.name,
      kind: entry.isDirectory() ? 'directory' : 'file',
      size,
    });
  }

  return results.sort((a, b) => {
    if (a.kind !== b.kind) {
      return a.kind === 'directory' ? -1 : 1;
    }

    return a.name.localeCompare(b.name);
  });
}

function contentTypeFor(filePath) {
  switch (path.extname(filePath).toLowerCase()) {
    case '.html':
      return 'text/html; charset=utf-8';
    case '.js':
      return 'application/javascript; charset=utf-8';
    case '.css':
      return 'text/css; charset=utf-8';
    case '.json':
      return 'application/json; charset=utf-8';
    case '.svg':
      return 'image/svg+xml';
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.gif':
      return 'image/gif';
    case '.pdf':
      return 'application/pdf';
    case '.txt':
      return 'text/plain; charset=utf-8';
    case '.ico':
      return 'image/x-icon';
    default:
      return 'application/octet-stream';
  }
}

async function handleDocsApi(req, res, requestUrl) {
  await fsp.mkdir(docsRoot, { recursive: true });

  if (req.method === 'GET' && requestUrl.pathname === '/api/docs/list') {
    const entries = await listEntries(requestUrl.searchParams.get('path') ?? '');
    sendJson(res, 200, { entries });
    return true;
  }

  if (req.method === 'GET' && requestUrl.pathname === '/api/docs/file') {
    const target = resolveDocsPath(requestUrl.searchParams.get('path') ?? '');
    const stats = await fsp.stat(target);

    if (!stats.isFile()) {
      sendJson(res, 400, { error: 'El recurso solicitado no es un archivo.' });
      return true;
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', contentTypeFor(target));
    fs.createReadStream(target).pipe(res);
    return true;
  }

  const body = await readJsonBody(req);

  if (req.method === 'POST' && requestUrl.pathname === '/api/docs/folder') {
    const targetDir = resolveDocsPath(body.path ?? '');
    const folderName = sanitizeEntryName(body.name ?? '');

    await fsp.mkdir(path.join(targetDir, folderName), { recursive: true });
    sendJson(res, 200, { ok: true });
    return true;
  }

  if (req.method === 'POST' && requestUrl.pathname === '/api/docs/upload') {
    const targetDir = resolveDocsPath(body.path ?? '');
    const files = Array.isArray(body.files) ? body.files : [];

    for (const file of files) {
      const fileName = sanitizeEntryName(file.name ?? '');
      const contentBase64 = String(file.contentBase64 ?? '');
      const targetFile = path.join(targetDir, fileName);

      if (!isWithinRoot(docsRoot, targetFile)) {
        throw new Error('Archivo fuera de docs no permitido.');
      }

      await fsp.writeFile(targetFile, Buffer.from(contentBase64, 'base64'));
    }

    sendJson(res, 200, { ok: true });
    return true;
  }

  if (req.method === 'POST' && requestUrl.pathname === '/api/docs/rename') {
    const currentDir = resolveDocsPath(body.path ?? '');
    const oldName = sanitizeEntryName(body.oldName ?? '');
    const newName = sanitizeEntryName(body.newName ?? '');
    const oldPath = path.join(currentDir, oldName);
    const newPath = path.join(currentDir, newName);

    if (!isWithinRoot(docsRoot, oldPath) || !isWithinRoot(docsRoot, newPath)) {
      throw new Error('Operacion fuera de docs no permitida.');
    }

    await fsp.rename(oldPath, newPath);
    sendJson(res, 200, { ok: true });
    return true;
  }

  if (req.method === 'POST' && requestUrl.pathname === '/api/docs/delete') {
    const currentDir = resolveDocsPath(body.path ?? '');
    const name = sanitizeEntryName(body.name ?? '');
    const targetPath = path.join(currentDir, name);

    if (!isWithinRoot(docsRoot, targetPath)) {
      throw new Error('Operacion fuera de docs no permitida.');
    }

    await fsp.rm(targetPath, { recursive: Boolean(body.recursive), force: false });
    sendJson(res, 200, { ok: true });
    return true;
  }

  sendJson(res, 404, { error: 'Ruta no encontrada.' });
  return true;
}

async function serveStatic(req, res, requestUrl) {
  let targetPath = resolveStaticPath(requestUrl.pathname);

  if (!targetPath) {
    sendText(res, 403, 'Forbidden');
    return;
  }

  try {
    let stats = await fsp.stat(targetPath);

    if (stats.isDirectory()) {
      targetPath = path.join(targetPath, 'index.html');
      stats = await fsp.stat(targetPath);
    }

    if (!stats.isFile()) {
      throw new Error('Not a file');
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', contentTypeFor(targetPath));
    fs.createReadStream(targetPath).pipe(res);
    return;
  } catch {
    const fallback = path.join(distRoot, 'index.html');

    try {
      await fsp.access(fallback);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      fs.createReadStream(fallback).pipe(res);
      return;
    } catch {
      sendText(res, 404, 'dist/index.html no encontrado.');
    }
  }
}

const server = http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);

  try {
    if (requestUrl.pathname.startsWith('/api/docs')) {
      await handleDocsApi(req, res, requestUrl);
      return;
    }

    await serveStatic(req, res, requestUrl);
  } catch (error) {
    sendJson(res, 500, { error: error?.message ?? 'Error interno del administrador de docs.' });
  }
});

server.listen(port, host, () => {
  console.log(`Servidor iniciado en http://${host}:${port}`);
  console.log(`Sirviendo frontend desde: ${distRoot}`);
  console.log(`Sirviendo docs desde: ${docsRoot}`);
});
