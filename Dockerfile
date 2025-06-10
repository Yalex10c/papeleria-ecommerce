# Imagen base oficial de Node
FROM node:18

# Crear directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiar e instalar dependencias del frontend (está en 'src')
COPY src/package*.json ./src/
RUN cd src && npm install && npm run build

# Copiar e instalar dependencias del backend
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Copiar todo el proyecto
COPY . .

# Exponer el puerto del backend (Express)
EXPOSE 3000

# Comando para ejecutar el backend
CMD ["node", "backend/server.js"]
