# Utilizar una imagen base de Node.js
FROM node:22-alpine3.19

# Exponer el puerto 4000
EXPOSE 4000

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos necesarios
COPY ../package.json /app/package.json
COPY ../dist /app/dist
COPY ../.env.productivo /app/.env.productivo
COPY ../tsconfig.json /app/tsconfig.json
COPY ../README.md /app/README.md

# Instalar dependencias de producción
RUN npm install --production
ENV NODE_ENV=production

# Comando para iniciar la aplicación en modo producción
CMD ["npm", "run", "start:prod"]