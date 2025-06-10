# Etapa 1: construir el frontend
FROM node:18 AS build-frontend
WORKDIR /app/frontend
COPY frontend/ .
RUN npm install
RUN npm run build

# Etapa 2: configurar backend + servir frontend
FROM node:18
WORKDIR /app

# Copiar backend
COPY backend/ ./backend

# Instalar dependencias del backend
WORKDIR /app/backend
RUN npm install

# Instalar 'serve' para mostrar el frontend
RUN npm install -g serve

# Copiar el frontend ya compilado desde la etapa anterior
COPY --from=build-frontend /app/frontend/build /app/frontend-build

# Exponer puerto del frontend (3000) y backend (opcional)
EXPOSE 3000

# Iniciar backend y frontend simultáneamente
CMD concurrently \
  "cd /app/backend && node server.js" \
  "serve -s /app/frontend-build -l 3000"
