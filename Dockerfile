FROM node:20.15.1-slim

EXPOSE 7000

WORKDIR /app


COPY package*.json /app/
COPY  ./.eslintrc.js /app/.eslintrc.js    
COPY ./.gitignore /app/.gitignore    
COPY ./.prettierrc /app/.prettierrc    
COPY ./Logo-Green.png /app/Logo-Green.png    
COPY ./nest-cli.json /app/nest-cli.json    
COPY ./README.md /app/README.md    
COPY ./tsconfig.build.json /app/tsconfig.build.json    
COPY ./tsconfig.json /app/tsconfig.json    
COPY ./src /app/src
COPY ./test /app/test
COPY ./.env.productivo /app/.env.productivo
ENV AMBIENTE=produccion

RUN npm install

CMD ["npm", "run", "start:dev"]

