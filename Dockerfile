# Imagen base oficial de Node
FROM node:18

# Crear directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiar y instalar dependencias del frontend
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install && npm run build

# Copiar y instalar dependencias del backend
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Copiar todo el proyecto
COPY . .

# Exponer el puerto en el que corre el backend (Express)
EXPOSE 3000

# Comando para ejecutar el backend
CMD ["node", "backend/server.js"]
