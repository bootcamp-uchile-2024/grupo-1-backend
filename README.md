# 📚 Plantopia - API

## Introducción

Plantopia es un e-commerce dedicado a la venta de plantas, productos para jardinería y servicios especializados en el cuidado de plantas. Nuestra API permite gestionar y acceder a una amplia variedad de plantas, insumos y accesorios, así como a la información y recomendaciones para su correcto cuidado. Con ella, puedes explorar nuestro catálogo, realizar compras, y recibir consejos personalizados para mantener tus plantas en óptimas condiciones.

## Tabla de Contenidos

- [📚 Plantopia - API](#-plantopia---api)
  - [Introducción](#introducción)
  - [Tabla de Contenidos](#tabla-de-contenidos)
  - [Instalación](#instalación)
    - [Requisitos Previos](#requisitos-previos)
    - [Pasos de Instalación](#pasos-de-instalación)
  - [Uso](#uso)
    - [Ejecución de la APP](#ejecución-de-la-app)
    - [Ejemplos de Uso](#ejemplos-de-uso)
  - [Contribución](#contribución)
  - [Pruebas](#pruebas)
  - [Despliegue](#despliegue)
  - [Changelog](#changelog)
  - [Soporte](#soporte)
  - [Licencia](#licencia)
  - [FAQ](#faq)

## Instalación

### Requisitos Previos

- Node.js (versión v20.15.1)
- npm (versión 10.8.3)
- NestJS CLI
- Typescript
- Docker
- MySQL
- TypeOrm
- Class-Validator
- Multer
- JWT
- Guard
- Interceptor
- Pipes
- Logger

### Pasos de Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/bootcamp-uchile-2024/grupo-1-backend.git
   cd grupo1-backend
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura las variables de entorno:
   - Crea un archivo `.env` en la raíz del proyecto y añade las variables necesarias.
```bash
PUERTO
AMBIENTE=desarrollo
VERSION=1.4.0
DB_HOST=mysql
DB_PORT=3306
DB_USER=user_dev
DB_PASS=password_dev
DB_DATABASE=plantopiadb
DB_ROOTPASS=rootpassword
DB_TYPE=mysql
JWT_SECRET
```


4. Levanta la imagen de Docker Desarrollo - docker-compose
  En la raiz del proyecto ejecutar el comando -> docker-compose.yml
   ```bash
   docker-compose up
   ```

## Uso

### Ejecución de la APP

```bash
# Desarrollo
$ npm run start

# Modo watch
$ npm run start:dev

# Producción
$ npm run start:prod
```

### Ejemplos de Uso

Puedes encontrar la documentación completa de la API en el siguiente enlace:
[Documentación API](http://3.142.12.50:4000/api)


## Contribución

Estamos abiertos a contribuciones. Por favor, sigue estos pasos para contribuir:

1. Haz un fork del repositorio.
2. Crea una nueva rama (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios y haz commit (`git commit -m 'Añadir nueva funcionalidad'`).
4. Sube tus cambios (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.

## Pruebas

Para ejecutar las pruebas, utiliza el siguiente comando:

```bash
npm run test
```

## Despliegue

Para desplegar la aplicación en un entorno de producción, asegúrate de configurar correctamente las variables de entorno y chequear la ultima version de la imagen productiva en nuestro dockerhub
visita el siguiente link -> 
https://hub.docker.com/repository/docker/cnicolas86/plantopia/general

## Changelog

[Registro de cambios importantes]

## Soporte

Para obtener soporte, por favor contacta a [soporte@plantopia.com](mailto:soporte@plantopia.com).

## Licencia

Este proyecto está licenciado bajo MIT.

## FAQ

**¿Cómo puedo obtener acceso a la API?**
Visita nuestra [documentación](http://3.142.12.50:4000/api) para más detalles.

**¿Qué métodos de pago aceptan?**
Actualmente estamos trabajando en la integración con pasarelas de pago.

![Logo](https://raw.githubusercontent.com/bootcamp-uchile-2024/grupo-1-backend/main/Logo-Green.png)
