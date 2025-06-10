# Imagen base oficial de Node
FROM node:18

# Crear directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiar todo el proyecto al directorio de trabajo
COPY . .

# Instalar dependencias del backend
WORKDIR /usr/src/app/backend
RUN npm install

# Instalar dependencias del frontend
WORKDIR /usr/src/app/src
RUN npm install

# Volver a la raíz del proyecto
WORKDIR /usr/src/app

# Instalar "concurrently" globalmente para correr ambos servidores
RUN npm install -g concurrently

# Exponer puertos necesarios
EXPOSE 3000 5173

# Ejecutar backend y frontend simultáneamente
CMD concurrently "cd backend && node server.js" "cd src && npm start"
