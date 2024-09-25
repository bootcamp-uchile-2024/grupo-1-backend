FROM node:20.15.1-slim

EXPOSE 7000

WORKDIR /app


COPY package*.json /app/  
COPY ./tsconfig.build.json /app/tsconfig.build.json    
COPY ./tsconfig.json /app/tsconfig.json    
COPY ./dist /app/dist
COPY ./.env.productivo /app/.env.productivo
ENV AMBIENTE=produccion

RUN npm install

CMD ["npm", "run", "start:dev"]

