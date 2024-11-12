# 📚 Plantopia - API

Somos un e-commerce dedicado a la venta de plantas, productos para jardinería y servicios especializados en el cuidado de plantas. Nuestra API permite gestionar y acceder a una amplia variedad de plantas, insumos y accesorios, así como a la información y recomendaciones para su correcto cuidado. Con ella, puedes explorar nuestro catálogo, realizar compras, y recibir consejos personalizados para mantener tus plantas en óptimas condiciones.

## 📝 Tabla de Contenidos

- [📚 Plantopia - API](#-plantopia---api)
  - [📝 Tabla de Contenidos](#-tabla-de-contenidos)
  - [🔗 Links](#-links)
  - [👨🏻‍💻 Autores](#-autores)
  - [💻 Requisitos Previos (Para Desarrollo)](#-requisitos-previos-para-desarrollo)
  - [🚀 Levantar la Imagen de Docker](#-levantar-la-imagen-de-docker)
  - [💻 Instalacion del proyecto](#-instalacion-del-proyecto)
  - [🏃‍♂️ Ejecutar la APP](#️-ejecutar-la-app)
  - [📖 Documentacion API 🌎](#-documentacion-api-)
  - [🌍 Variables de Entorno](#-variables-de-entorno)
  - [🏛️ Estructura del Proyecto](#️-estructura-del-proyecto)
  - [📈 Estado del Proyecto](#-estado-del-proyecto)
  - [📝 License](#-license)

## 🔗 Links

Christian Castillo

[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://github.com/ccasti10)

Rodrigo Cabello

[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://github.com/roancamo)

Camilo Orellana

[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://github.com/orellanasolec)

## 👨🏻‍💻 Autores

- [@Ccastillo](https://www.github.com/ccastillo)
- [@Roancamo](https://www.github.com/Roancamo)
- [@Orellanasolec](https://www.github.com/orellanasolec)

## 💻 Requisitos Previos (Para Desarrollo)

- Node.js (versión v20.15.1)
- npm (versión 10.8.3)
- Nest

  ```bash
  npm i -g @nestjs/cli
  ```

- Typescript

  ```bash
  npm install -g typescript
  ```

- Swagger

  ```bash
  npm install --save @nestjs/swagger
  ```

- Librerias NPM adicionales (Pipes/variables de entorno)

  ```bash
  npm i --save @nestjs/config
  npm install class-validator class-transformer
  ```

## 🚀 Levantar la Imagen de Docker

Para levantar la aplicación utilizando Docker, sigue los siguientes pasos:
Ejecuta el siguiente comando

```bash

docker run --name mysql-prod -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=plantopiaDB -p 3306:3306 -d mysql:8.0
docker pull cnicolas86/plantopia:1.2.0
docker run -p 4000:4000 -e AMBIENTE=produccion cnicolas86/plantopia:1.2.0

```

## 💻 Instalacion del proyecto

git clone <https://github.com/bootcamp-uchile-2024/grupo-1-backend.git>

cd grupo1-backend

## 🏃‍♂️ Ejecutar la APP

```bash
# Desarrollo
$ npm run start

# watch mode
$ npm run start:dev

# Produccion
$ npm run start:prod
```

## 📖 Documentacion API 🌎

Puedes encontrar la documentación completa de la API en el siguiente enlace:
<https://plantopia.koyeb.app/api/productos>
<http://13.51.194.39:4000/api>

## 🌍 Variables de Entorno

Asegúrate de configurar las siguientes variables de entorno antes de ejecutar la aplicación:

```textplain
# Desarrollo
PUERTO=3000
AMBIENTE=desarrollo
VERSION=1.2.0
DB_HOST=mysql
DB_PORT=3306
DB_TYPE=mysql
DB_USERNAME=user_dev
DB_PASSWORD=password_dev
DB_DATABASE=plantopiadb
```

```textplain
# Produccion
PUERTO=4000
AMBIENTE=produccion
VERSION=1.2.0
DB_HOST=mysql
DB_PORT=3306
DB_TYPE=mysql
DB_USERNAME=user_prod
DB_PASSWORD=password_prod
DB_DATABASE=plantopiadb
```

## 🏛️ Estructura del Proyecto

```plaintext
src/
├── comunes/
│   ├── pipes/
│   ├── filters/
│   └── interceptor/
├── despachos/
│   ├── controllers/
│   ├── dto/
│   ├── entities/
│   ├── services/
│   └── despachos.module.ts
├── localizaciones/
│   ├── controllers/
│   ├── dto/
│   ├── entities/
│   ├── services/
│   └── localizaciones.module.ts
├── productos/
│   ├── controllers/
│   ├── dto/
│   ├── entities/
│   ├── services/
│   └── productos.module.ts
├── servicios/
│   ├── controllers/
│   ├── dto/
│   ├── entities/
│   ├── services/
│   └── servicios.module.ts
├── usuarios/
│   ├── controllers/
│   ├── dto/
│   ├── entities/
│   ├── services/
│   └── usuarios.module.ts
├── ventas/
│   ├── controllers/
│   ├── dto/
│   ├── entities/
│   ├── services/
│   └── ventas.module.ts
├── app.module.ts
├── main.ts
```

## 📈 Estado del Proyecto

El proyecto se encuentra en fase de desarrollo y estamos abiertos a
contribuciones. Próximamente se implementarán nuevas funcionalidades como la
integración con pasarelas de pago y sistema de notificaciones.

## 📝 License

Este archivo [`README.md`] proporciona una visión general del proyecto, instrucciones de instalación y uso, ejemplos de solicitudes, y detalles sobre la estructura del proyecto y cómo contribuir.
licenciado bajo MIT

![Logo](https://raw.githubusercontent.com/bootcamp-uchile-2024/grupo-1-backend/main/Logo-Green.png)
