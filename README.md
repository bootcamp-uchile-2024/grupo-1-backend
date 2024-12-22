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

4. Levanta la imagen de Docker:
   ```bash
   docker run --name mysql-prod -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=plantopiaDB -p 3306:3306 -d mysql:8.0
   docker pull cnicolas86/plantopia:1.2.0
   docker run -p 4000:4000 -e AMBIENTE=produccion cnicolas86/plantopia:1.2.0
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
[Documentación API](http://13.51.194.39:4000/api)

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

Para desplegar la aplicación en un entorno de producción, asegúrate de configurar correctamente las variables de entorno y seguir los pasos de instalación.

## Changelog

[Registro de cambios importantes]

## Soporte

Para obtener soporte, por favor contacta a [soporte@plantopia.com](mailto:soporte@plantopia.com).

## Licencia

Este proyecto está licenciado bajo MIT.

## FAQ

**¿Cómo puedo obtener acceso a la API?**
Visita nuestra [documentación](http://13.51.194.39:4000/api) para más detalles.

**¿Qué métodos de pago aceptan?**
Actualmente estamos trabajando en la integración con pasarelas de pago.

![Logo](https://raw.githubusercontent.com/bootcamp-uchile-2024/grupo-1-backend/main/Logo-Green.png)
