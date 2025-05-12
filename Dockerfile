# Usa una versión específica de Node.js
FROM node:22.15.0-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia package.json y package-lock.json para instalar dependencias
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia todo el código al contenedor
COPY . .

# Compila el proyecto (si estás utilizando TypeScript)
RUN npm run build

# Expone el puerto que usará tu aplicación
EXPOSE 80
EXPOSE 22
EXPOSE 27017

# Comando para iniciar la aplicación en modo producción
CMD ["npm", "run", "start:prod"]
