import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname);
const docsRoot = path.resolve(projectRoot, 'public/docs');

function json(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

function isWithinDocs(targetPath) {
  const relative = path.relative(docsRoot, targetPath);
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

function resolveDocsPath(relativePath = '') {
  const parts = sanitizeRelativePath(relativePath);
  const target = path.resolve(docsRoot, ...parts);

  if (!isWithinDocs(target)) {
    throw new Error('Acceso fuera de docs no permitido.');
  }

  return target;
}

function sanitizeEntryName(input = '') {
  const name = String(input).trim();

  if (!name || name.includes('/') || name.includes('\\') || name === '.' || name === '..') {
    throw new Error('Nombre invalido.');
  }

  return name;
}

async function readBody(req) {
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
    if (a.kind !== b.kind) return a.kind === 'directory' ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}

function contentTypeFor(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  switch (ext) {
    case '.pdf':
      return 'application/pdf';
    case '.json':
      return 'application/json; charset=utf-8';
    case '.txt':
      return 'text/plain; charset=utf-8';
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    default:
      return 'application/octet-stream';
  }
}

function docsAdminPlugin() {
  const handler = async (req, res, next) => {
    if (!req.url?.startsWith('/api/docs')) {
      next();
      return;
    }

    try {
      await fsp.mkdir(docsRoot, { recursive: true });

      const requestUrl = new URL(req.url, 'http://localhost');
      const pathname = requestUrl.pathname;

      if (req.method === 'GET' && pathname === '/api/docs/list') {
        const entries = await listEntries(requestUrl.searchParams.get('path') ?? '');
        json(res, 200, { entries });
        return;
      }

      if (req.method === 'GET' && pathname === '/api/docs/file') {
        const target = resolveDocsPath(requestUrl.searchParams.get('path') ?? '');
        const stats = await fsp.stat(target);

        if (!stats.isFile()) {
          json(res, 400, { error: 'El recurso solicitado no es un archivo.' });
          return;
        }

        res.statusCode = 200;
        res.setHeader('Content-Type', contentTypeFor(target));
        fs.createReadStream(target).pipe(res);
        return;
      }

      const body = await readBody(req);

      if (req.method === 'POST' && pathname === '/api/docs/folder') {
        const targetDir = resolveDocsPath(body.path ?? '');
        const folderName = sanitizeEntryName(body.name ?? '');

        await fsp.mkdir(path.join(targetDir, folderName), { recursive: true });
        json(res, 200, { ok: true });
        return;
      }

      if (req.method === 'POST' && pathname === '/api/docs/upload') {
        const targetDir = resolveDocsPath(body.path ?? '');
        const files = Array.isArray(body.files) ? body.files : [];

        for (const file of files) {
          const fileName = sanitizeEntryName(file.name ?? '');
          const contentBase64 = String(file.contentBase64 ?? '');

          const targetFile = path.join(targetDir, fileName);
          if (!isWithinDocs(targetFile)) {
            throw new Error('Archivo fuera de docs no permitido.');
          }

          const buffer = Buffer.from(contentBase64, 'base64');
          await fsp.writeFile(targetFile, buffer);
        }

        json(res, 200, { ok: true });
        return;
      }

      if (req.method === 'POST' && pathname === '/api/docs/rename') {
        const currentDir = resolveDocsPath(body.path ?? '');
        const oldName = sanitizeEntryName(body.oldName ?? '');
        const newName = sanitizeEntryName(body.newName ?? '');

        const oldPath = path.join(currentDir, oldName);
        const newPath = path.join(currentDir, newName);

        if (!isWithinDocs(oldPath) || !isWithinDocs(newPath)) {
          throw new Error('Operacion fuera de docs no permitida.');
        }

        await fsp.rename(oldPath, newPath);
        json(res, 200, { ok: true });
        return;
      }

      if (req.method === 'POST' && pathname === '/api/docs/delete') {
        const currentDir = resolveDocsPath(body.path ?? '');
        const name = sanitizeEntryName(body.name ?? '');

        const target = path.join(currentDir, name);
        if (!isWithinDocs(target)) {
          throw new Error('Operacion fuera de docs no permitida.');
        }

        await fsp.rm(target, { recursive: Boolean(body.recursive), force: false });
        json(res, 200, { ok: true });
        return;
      }

      json(res, 404, { error: 'Ruta no encontrada.' });
    } catch (error) {
      json(res, 500, { error: error?.message ?? 'Error interno del administrador de docs.' });
    }
  };

  return {
    name: 'docs-admin-plugin',
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    },
  };
}

export default defineConfig({
  plugins: [react(), docsAdminPlugin()],
  root: '.',
  cacheDir: '.vite',
  server: {
    port: 5175,
    open: true,
  },
  build: {
    outDir: 'dist',
  },
  css: {
    devSourcemap: false,
  },
});
