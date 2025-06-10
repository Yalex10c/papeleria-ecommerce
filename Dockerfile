# Etapa 1: Construcción del frontend
FROM node:20 AS build-frontend

WORKDIR /app

# Copiar archivos de dependencias primero para aprovechar cache
COPY package*.json ./

RUN npm install

# Copiar todo el código fuente después
COPY src/ ./src
# Si tienes otros archivos (config, public, etc), cópialos también
# COPY public ./public
# COPY .babelrc ./

RUN npm run build

# Etapa 2: Backend + frontend listo para producción
FROM node:20

WORKDIR /app

# Copiar archivos del backend
COPY backend/server.js ./
COPY backend/routes ./routes
COPY backend/middleware ./middleware  
COPY package*.json ./

RUN npm install

# Copiar build del frontend generado (ajusta si tu build genera en 'build' en vez de 'dist')
COPY --from=build-frontend /app/build ./public

EXPOSE 5000

CMD ["node", "server.js"]
