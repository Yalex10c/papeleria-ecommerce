# Imagen base oficial de Node
FROM node:18

# Crear directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiar los archivos de dependencias del backend
COPY backend/package*.json ./backend/

# Instalar dependencias del backend
RUN cd backend && npm install

# Copiar todo el proyecto
COPY . .

# Construir frontend (si usas React u otro build)
RUN npm install && npm run build

# Exponer el puerto en el que corre Express (ajústalo si usas otro)
EXPOSE 3000

# Comando para ejecutar el backend
CMD ["node", "backend/app.js"]
