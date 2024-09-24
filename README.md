# Plantopia - API

Somos un e-commerce dedicado a la venta de plantas, productos para jardinería y servicios especializados en el cuidado de plantas. Nuestra API permite gestionar y acceder a una amplia variedad de plantas, insumos y accesorios, así como a la información y recomendaciones para su correcto cuidado. Con ella, puedes explorar nuestro catálogo, realizar compras, y recibir consejos personalizados para mantener tus plantas en óptimas condiciones.

## Tabla de Contenidos

- [Plantopia - API](#plantopia---api)
  - [Tabla de Contenidos](#tabla-de-contenidos)
  - [🔗 Links](#-links)
  - [👨🏻‍💻 Autores](#-autores)
  - [💻 Requisitos Previos](#-requisitos-previos)
  - [💻 Instalacion del proyecto](#-instalacion-del-proyecto)
  - [🏃‍♂️ Ejecutar la APP](#️-ejecutar-la-app)
  - [📖 Documentacion API 🌎](#-documentacion-api-)
  - [🌍 Variables de Entorno](#-variables-de-entorno)
  - [🏛️ Estructura del Proyecto](#️-estructura-del-proyecto)
  - [📈 Estado del Proyecto](#-estado-del-proyecto)
  - [License 📝](#license-)

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

## 💻 Requisitos Previos

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

## 💻 Instalacion del proyecto

git clone <https://github.com/bootcamp-uchile-2024/grupo-1-backend.git>

cd tu-repositorio

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

## 🌍 Variables de Entorno

Asegúrate de configurar las siguientes variables de entorno antes de ejecutar la aplicación:

```plaintext
puerto=3000
ambiente=desarrollo
version=1.0.0

puerto=7000
ambiente=produccion
version=1.0.0
````

## 🏛️ Estructura del Proyecto

```plaintext
src/
├── comunes/
│   ├── pipes/
│   ├── filters/
│   └── interceptor/
├── productos/
│   ├── controllers/
│   ├── dto/
│   ├── entities/
│   ├── services/
│   └── productos.module.ts
├── plantas/
│   ├── controllers/
│   ├── dto/
│   ├── entities/
│   ├── services/
│   └── plantas.module.ts
├── usuarios/
│   ├── controllers/
│   ├── dto/
│   ├── entities/
│   ├── services/
│   └── usuarios.module.ts
├── orden-compras/
│   ├── controllers/
│   ├── dto/
│   ├── entities/
│   ├── services/
│   └── orden-compras.module.ts
├── despachos/
│   ├── controllers/
│   ├── dto/
│   ├── entities/
│   ├── services/
│   └── despachos.module.ts
├── app.module.ts
├── main.ts
```

## 📈 Estado del Proyecto

El proyecto se encuentra en fase de desarrollo y estamos abiertos a
contribuciones. Próximamente se implementarán nuevas funcionalidades como la
integración con pasarelas de pago y sistema de notificaciones.

## License 📝

Este archivo [`README.md`] proporciona una visión general del proyecto, instrucciones de instalación y uso, ejemplos de solicitudes, y detalles sobre la estructura del proyecto y cómo contribuir.
licenciado bajo MIT

![Logo](https://raw.githubusercontent.com/bootcamp-uchile-2024/grupo-1-backend/main/Logo-Green.png)
