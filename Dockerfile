# Utilizar una imagen base de Node.js
FROM node:20.15.1-slim

# Exponer el puerto 7000
EXPOSE 7000

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos necesarios
COPY ./package.json /app/package.json
COPY ./dist /app/dist
COPY ./.env.productivo /app/.env.productivo
COPY ./tsconfig.json /app/tsconfig.json
COPY ./README.md /app/README.md

# Instalar dependencias de producción
RUN npm install --production

# Comando para iniciar la aplicación en modo producción
CMD ["npm", "run", "start:prod"]