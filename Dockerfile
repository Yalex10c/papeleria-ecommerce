# --- BACKEND ---
FROM node:18-alpine AS backend

WORKDIR /app/backend

# Copia archivos de dependencias del backend
COPY backend/package*.json ./

# Instala dependencias del backend (incluyendo devDependencies para construcción)
RUN npm install

# Copia el resto del backend
COPY backend/ .

# Variables de entorno (ajusta según tu .env)
ENV NODE_ENV=production
ENV PORT=3001

# Puerto expuesto para el backend
EXPOSE 3001

# --- FRONTEND ---
FROM node:18-alpine AS frontend

WORKDIR /app/frontend

# Copia archivos de dependencias del frontend
COPY frontend/package*.json ./

RUN npm install

# Copia el resto del frontend
COPY frontend/ .

# Construye la app React
RUN npm run build

# --- PRODUCCIÓN ---
FROM node:18-alpine

WORKDIR /app

# Copia el backend desde la etapa de backend
COPY --from=backend /app/backend ./backend

# Copia el frontend construido desde la etapa de frontend
COPY --from=frontend /app/frontend/build ./frontend/build

# Instala solo production dependencies para el backend
WORKDIR /app/backend
RUN npm install --only=production

# Expone puertos (backend:3001, frontend:3000)
EXPOSE 3001 3000

# Comando para iniciar (ajusta según tu configuración)
CMD ["node", "npm start"]