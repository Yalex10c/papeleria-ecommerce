# Imagen base oficial de Node
FROM node:18

# Crear directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar archivos del proyecto
COPY . .

# Instalar dependencias del frontend
WORKDIR /app/src
RUN npm install
RUN npm run build

# Instalar servidor HTTP estático para servir la app de React
RUN npm install -g serve

# Establecer el directorio de salida del build
WORKDIR /app/src
EXPOSE 3000

# Comando para servir la app
CMD ["serve", "-s", "dist", "-l", "3000"]
