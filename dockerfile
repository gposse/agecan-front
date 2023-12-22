# Usa una imagen base con Node.js
FROM node:18

# Establece el directorio de trabajo
WORKDIR /usr/src/app

# Copia los archivos de la aplicación
COPY . .

# Instala las dependencias
RUN npm install

# Expone el puerto en el que se ejecutará la aplicación
EXPOSE 8100

# Comando para iniciar la aplicación
CMD ["npm", "start"]
