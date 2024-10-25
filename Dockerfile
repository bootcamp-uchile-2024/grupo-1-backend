FROM node:20.15.1-slim
# Instalar dependencias necesarias
RUN apt-get update && apt-get install -y \
    curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Descargar dockerize
RUN curl -L https://github.com/jwilder/dockerize/releases/download/v0.6.1/dockerize-linux-amd64-v0.6.1.tar.gz | tar -xz -C /usr/local/bin

EXPOSE 7000

WORKDIR /app


COPY ./package.json /app/package.json    
COPY ./dist /app/dist
COPY ./.env.productivo /app/.env.productivo
COPY ./tsconfig.json /app/tsconfig.json 
COPY ./README.md /app/README.md


RUN npm install --production
ENV NODE_ENV=production

# Definir el comando de inicio
CMD ["dockerize", "-wait", "tcp://mysql:3306", "-timeout", "60s", "npm", "run", "start:prod"]