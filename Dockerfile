FROM node:20.15.1-slim

EXPOSE 7000

WORKDIR /app


COPY ./package.json /app/package.json    
COPY ./dist /app/dist
COPY ./.env.productivo /app/.env.productivo
COPY ./tsconfig.json /app/tsconfig.json 
COPY ./README.md /app/README.md

RUN npm install --production

CMD ["npm", "run", "start:prod"]