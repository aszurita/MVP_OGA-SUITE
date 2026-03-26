# ─────────────────────────────────────────────────────────────────────────────
# STAGE 1 — Build de React con Vite
# ─────────────────────────────────────────────────────────────────────────────
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar solo package files primero (aprovecha cache de capas Docker)
COPY package.json package-lock.json* ./

# Instalar dependencias exactas del lockfile
RUN npm ci

# Copiar el código fuente (el .dockerignore excluye assets legacy js/, img/, etc.)
COPY . .

# Variable de entorno para el build de Vite
# En prod Docker la API se expone como /api (Nginx hace el proxy)
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

# Compilar la aplicación React
RUN npm run build

# ─────────────────────────────────────────────────────────────────────────────
# STAGE 2 — Servir el dist/ con Nginx (imagen mínima ~10 MB)
# ─────────────────────────────────────────────────────────────────────────────
FROM nginx:alpine AS runner

# Copiar SOLO el resultado compilado del stage anterior
COPY --from=builder /app/dist /usr/share/nginx/html

# Configuración de Nginx para SPA (React Router)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
