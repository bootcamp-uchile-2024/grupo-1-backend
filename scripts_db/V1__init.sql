CREATE TABLE Categoria (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombreCategoria VARCHAR(255) NOT NULL
);

CREATE TABLE DificultadDeCuidado (
  id INT AUTO_INCREMENT PRIMARY KEY,
  descripcion VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE Estacion (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE FrecuenciaDeRiego (
  id INT AUTO_INCREMENT PRIMARY KEY,
  descripcion VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE Habitat (
  id INT AUTO_INCREMENT PRIMARY KEY,
  descripcion VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE LuzRequerida (
  id INT AUTO_INCREMENT PRIMARY KEY,
  descripcion VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE NivelDeHumedad (
  id INT AUTO_INCREMENT PRIMARY KEY,
  descripcion VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE TipoDeSuelo (
  id INT AUTO_INCREMENT PRIMARY KEY,
  descripcion VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE Eficacia (
  id INT AUTO_INCREMENT PRIMARY KEY,
  descripcion VARCHAR(255)
);

CREATE TABLE Plaga (
  id INT AUTO_INCREMENT PRIMARY KEY,
  descripcion VARCHAR(255)
);

CREATE TABLE FormaAplicacion (
  id INT AUTO_INCREMENT PRIMARY KEY,
  descripcion VARCHAR(255)
);

CREATE TABLE RetencionHumedad (
  id INT AUTO_INCREMENT PRIMARY KEY,
  descripcion VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE ComposicionSustrato (
  id INT AUTO_INCREMENT PRIMARY KEY,
  descripcion VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE TexturaSustrato (
  id INT AUTO_INCREMENT PRIMARY KEY,
  descripcion VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE TipoFertilizante (
  id INT AUTO_INCREMENT PRIMARY KEY,
  descripcion VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE TipoPlantasRecomendadas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  descripcion VARCHAR(100) UNIQUE NOT NULL
);
/*
CREATE TABLE EstadosOC (
  id INT AUTO_INCREMENT PRIMARY KEY,
  descripcion VARCHAR(255)
);*/

CREATE TABLE FormaMacetero (
  id INT AUTO_INCREMENT PRIMARY KEY,
  descripcion VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE Perfil (
  id INT AUTO_INCREMENT PRIMARY KEY,
  descripcion VARCHAR(255),
  accesoSistema BOOLEAN
);

CREATE TABLE Region (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255)
);

CREATE TABLE Comuna (
  id INT AUTO_INCREMENT PRIMARY KEY,
  idRegion INT NOT NULL,
  nombre VARCHAR(255),
  FOREIGN KEY (idRegion) REFERENCES Region(id)
);

CREATE TABLE Ciudad (
  id INT AUTO_INCREMENT PRIMARY KEY,
  idComuna INT NOT NULL,
  nombre VARCHAR(255),
  FOREIGN KEY (idComuna) REFERENCES Comuna(id)
);


CREATE TABLE EstadosVenta (
  id INT AUTO_INCREMENT PRIMARY KEY,
  descripcion VARCHAR(255)
);

CREATE TABLE FormaPago (
  id INT AUTO_INCREMENT PRIMARY KEY,
  descripcion VARCHAR(255),
  idEstadoFormaPago INT NOT NULL
);

CREATE TABLE EstadosFormaPago (
  id INT AUTO_INCREMENT PRIMARY KEY,
  descripcion VARCHAR(255)
);

CREATE TABLE TipoDespacho (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombreMetodo VARCHAR(255),
  descripcion VARCHAR(255)
);


CREATE TABLE Producto (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombreProducto VARCHAR(255) NOT NULL,
  descuento INT,
  precioNormal INT NOT NULL,
  stock INT NOT NULL,
  descripcionProducto VARCHAR(255),
  valoracion INT,
  cantidadVentas INT,
  idCategoria INT NOT NULL,
  FOREIGN KEY (idCategoria) REFERENCES Categoria(id)
);

CREATE TABLE Planta (
  id INT AUTO_INCREMENT PRIMARY KEY,
  idProducto INT UNIQUE NOT NULL,
  nombrePlanta VARCHAR(255) NOT NULL,
  nombreCientifico VARCHAR(255),
  idHabitat INT NOT NULL,
  idLuz INT NOT NULL,
  idHumedad INT NOT NULL,
  temperaturaIdeal DECIMAL(5,2),
  toxicidadMascotas INT,
  tamanoMaximo INT,
  peso INT,
  idDificultad INT NOT NULL,
  idFrecuencia INT NOT NULL,
  FOREIGN KEY (idProducto) REFERENCES Producto(id),
  FOREIGN KEY (idHabitat) REFERENCES Habitat(id),
  FOREIGN KEY (idLuz) REFERENCES LuzRequerida(id),
  FOREIGN KEY (idHumedad) REFERENCES NivelDeHumedad(id),
  FOREIGN KEY (idDificultad) REFERENCES DificultadDeCuidado(id),
  FOREIGN KEY (idFrecuencia) REFERENCES FrecuenciaDeRiego(id)
);

CREATE TABLE ControlPlagas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  idProducto INT UNIQUE NOT NULL,
  idEficacia INT NOT NULL,
  composicion VARCHAR(255),
  duracionProteccion VARCHAR(100),
  peso INT,
  FOREIGN KEY (idProducto) REFERENCES Producto(id),
  FOREIGN KEY (idEficacia) REFERENCES Eficacia(id)
);

CREATE TABLE Sustrato (
  id INT AUTO_INCREMENT PRIMARY KEY,
  idProducto INT UNIQUE NOT NULL,
  idRetencionHumedad INT NOT NULL,
  peso VARCHAR(255),
  FOREIGN KEY (idProducto) REFERENCES Producto(id),
  FOREIGN KEY (idRetencionHumedad) REFERENCES RetencionHumedad(id)
);

CREATE TABLE Fertilizante (
  id INT AUTO_INCREMENT PRIMARY KEY,
  idProducto INT UNIQUE NOT NULL,
  composicion VARCHAR(255),
  idTipoFertilizante INT NOT NULL,
  presentacion VARCHAR(255),
  frecuenciaAplicacion VARCHAR(100),
  peso INT,
  FOREIGN KEY (idProducto) REFERENCES Producto(id),
  FOREIGN KEY (idTipoFertilizante) REFERENCES TipoFertilizante(id)
);

CREATE TABLE Macetero (
  id INT AUTO_INCREMENT PRIMARY KEY,
  idProducto INT UNIQUE NOT NULL,
  material VARCHAR(100),
  altura INT,
  ancho INT,
  color VARCHAR(50),
  peso INT,
  idForma INT NOT NULL,
  FOREIGN KEY (idProducto) REFERENCES Producto(id),
  FOREIGN KEY (idForma) REFERENCES FormaMacetero(id)
);

CREATE TABLE Servicio (
  id INT AUTO_INCREMENT PRIMARY KEY,
  idProducto INT UNIQUE,
  nombre VARCHAR(255),
  descripcion VARCHAR(255),
  FOREIGN KEY (idProducto) REFERENCES Producto(id)
);
CREATE TABLE Usuario (
  id INT AUTO_INCREMENT PRIMARY KEY,
  rutUsuario VARCHAR(10),
  nombres VARCHAR(255),
  apellidos VARCHAR(255),
  email VARCHAR(255),
  clave VARCHAR(10),
  telefono INT,
  direccion VARCHAR(255),
  idComuna INT NOT NULL,
  codigoPostal VARCHAR(255),
  idPerfil INT NOT NULL,
  FOREIGN KEY (idPerfil) REFERENCES Perfil(id)
);
CREATE TABLE OrdenCompra (
  id INT AUTO_INCREMENT PRIMARY KEY,
  emailComprador VARCHAR(255) DEFAULT NULL,
  fechaOrden DATE,
  estado varchar(100) NOT NULL,
  idUsuario INT DEFAULT NULL,
  FOREIGN KEY (idUsuario) REFERENCES Usuario(id)
);


CREATE TABLE Venta (
  id INT AUTO_INCREMENT PRIMARY KEY,
  idOrdenCompra INT UNIQUE NOT NULL,
  rutUsuario VARCHAR(10),
  formaIdentificacion VARCHAR(255),
  totalBruto INT,
  totalDescuento INT,
  iva INT,
  totalPago INT,
  idFormaPago INT,
  nroComprobantePago VARCHAR(255),
  idEstadoVenta INT NOT NULL,
  FOREIGN KEY (idOrdenCompra) REFERENCES OrdenCompra(id),
  FOREIGN KEY (idFormaPago) REFERENCES FormaPago(id),
  FOREIGN KEY (idEstadoVenta) REFERENCES EstadosVenta(id)
);

CREATE TABLE Despacho (
  id INT AUTO_INCREMENT PRIMARY KEY,
  idVenta INT UNIQUE NOT NULL,
  fechaDespacho DATE,
  fechaLlegada DATE,
  rutReceptor VARCHAR(10),
  nombreReceptor VARCHAR(255),
  estado VARCHAR(50),
  idTipoDespacho INT,
  direccion VARCHAR(255),
  idComuna INT NOT NULL,
  FOREIGN KEY (idVenta) REFERENCES Venta(id),
  FOREIGN KEY (idComuna) REFERENCES Comuna(id),
  FOREIGN KEY (idTipoDespacho) REFERENCES TipoDespacho(id)
);

CREATE TABLE JardinVirtual (
  id INT AUTO_INCREMENT PRIMARY KEY,
  idUsuario INT UNIQUE NOT NULL,
  FOREIGN KEY (idUsuario) REFERENCES Usuario(id)
);

CREATE TABLE DetalleJardinVirtual (
  idJardin INT NOT NULL,
  idPlanta INT NOT NULL,
  fechaIngreso DATE,
  PRIMARY KEY (idJardin, idPlanta),
  FOREIGN KEY (idJardin) REFERENCES JardinVirtual(id),
  FOREIGN KEY (idPlanta) REFERENCES Planta(id)
);

CREATE TABLE CoberturaDespachoProducto (
  idProducto INT NOT NULL,
  idComuna INT NOT NULL,
  PRIMARY KEY (idProducto, idComuna),
  FOREIGN KEY (idProducto) REFERENCES Producto(id),
  FOREIGN KEY (idComuna) REFERENCES Comuna(id)
);

CREATE TABLE ImagenProducto (
  id INT AUTO_INCREMENT PRIMARY KEY,
  idProducto INT,
  urlImagen VARCHAR(500),
  FOREIGN KEY (idProducto) REFERENCES Producto(id)
);

CREATE TABLE PlantaEstacion (
  idPlanta INT NOT NULL,
  idEstacion INT NOT NULL,
  PRIMARY KEY (idPlanta, idEstacion),
  FOREIGN KEY (idPlanta) REFERENCES Planta(id),
  FOREIGN KEY (idEstacion) REFERENCES Estacion(id)
);

CREATE TABLE PlantaTipoSuelo (
  idPlanta INT NOT NULL,
  idSuelo INT NOT NULL,
  PRIMARY KEY (idPlanta, idSuelo),
  FOREIGN KEY (idPlanta) REFERENCES Planta(id),
  FOREIGN KEY (idSuelo) REFERENCES TipoDeSuelo(id)
);

CREATE TABLE PlagasControladas (
  idControlPlaga INT NOT NULL,
  idPlaga INT NOT NULL,
  PRIMARY KEY (idControlPlaga, idPlaga),
  FOREIGN KEY (idControlPlaga) REFERENCES ControlPlagas(id),
  FOREIGN KEY (idPlaga) REFERENCES Plaga(id)
);

CREATE TABLE FormaAplicaControlPlaga (
  idControlPlaga INT NOT NULL,
  idFormaAplica INT NOT NULL,
  PRIMARY KEY (idControlPlaga, idFormaAplica),
  FOREIGN KEY (idControlPlaga) REFERENCES ControlPlagas(id),
  FOREIGN KEY (idFormaAplica) REFERENCES FormaAplicacion(id)
);

CREATE TABLE SustratoComposicion (
  idSustrato INT NOT NULL,
  idComposicion INT NOT NULL,
  PRIMARY KEY (idSustrato, idComposicion),
  FOREIGN KEY (idSustrato) REFERENCES Sustrato(id),
  FOREIGN KEY (idComposicion) REFERENCES ComposicionSustrato(id)
);

CREATE TABLE SustratoTextura (
  idSustrato INT NOT NULL,
  idTextura INT NOT NULL,
  PRIMARY KEY (idSustrato, idTextura),
  FOREIGN KEY (idSustrato) REFERENCES Sustrato(id),
  FOREIGN KEY (idTextura) REFERENCES TexturaSustrato(id)
);

CREATE TABLE FertilizanteTipoPlantas (
  idFertilizante INT NOT NULL,
  idTipoPlanta INT NOT NULL,
  PRIMARY KEY (idFertilizante, idTipoPlanta),
  FOREIGN KEY (idFertilizante) REFERENCES Fertilizante(id),
  FOREIGN KEY (idTipoPlanta) REFERENCES TipoPlantasRecomendadas(id)
);

CREATE TABLE SustratosSugeridos (
  idPlanta INT NOT NULL,
  idSustrato INT NOT NULL,
  PRIMARY KEY (idPlanta, idSustrato),
  FOREIGN KEY (idPlanta) REFERENCES Planta(id),
  FOREIGN KEY (idSustrato) REFERENCES Sustrato(id)
);

CREATE TABLE FertilizantesSugeridos (
  idPlanta INT NOT NULL,
  idFertilizante INT NOT NULL,
  PRIMARY KEY (idPlanta, idFertilizante),
  FOREIGN KEY (idPlanta) REFERENCES Planta(id),
  FOREIGN KEY (idFertilizante) REFERENCES Fertilizante(id)
);

CREATE TABLE ServicioUsuario (
  idServicio INT NOT NULL,
  idUsuario INT NOT NULL,
  PRIMARY KEY (idServicio, idUsuario),
  FOREIGN KEY (idServicio) REFERENCES Servicio(id),
  FOREIGN KEY (idUsuario) REFERENCES Usuario(id)
);

CREATE TABLE DetalleOrdenCompra (
  idOrdenCompra INT NOT NULL,
  idProducto INT NOT NULL,
  cantidad INT,
  precio INT,
  descuento INT,
  totalProducto INT,
  PRIMARY KEY (idOrdenCompra, idProducto),
  FOREIGN KEY (idOrdenCompra) REFERENCES OrdenCompra(id),
  FOREIGN KEY (idProducto) REFERENCES Producto(id)
);
-- Active: 1729829201905@@127.0.0.1@3307@PlantopiaDB


-- Insert a categoria
INSERT INTO Categoria (nombreCategoria)
VALUES
('Plantas'),
('Control de Plagas'),
('Maceteros'),
('Sustratos'),
('Fertilizantes'),
('Servicio'),
('Decoración'),
('Accesorios'),
('Semillas'),
('Otros');

-- insert DificultadDeCuidado
INSERT INTO DificultadDeCuidado (descripcion) VALUES
('Fácil'),
('Moderado'),
('Difícil'),
('Muy Difícil'),
('Experto'),
('Principiante'),
('Intermedio'),
('Avanzado'),
('Profesional'),
('Maestro');


-- insert Estacion
INSERT INTO Estacion (nombre) VALUES
('Primavera'),
('Verano'),
('Otoño'),
('Invierno'),
('Todo el año'),
('Estación lluviosa'),
('Estación seca'),
('Estación de crecimiento'),
('Estación de floración'),
('Estación de cosecha');

-- insert FrecuenciaDeRiego
INSERT INTO FrecuenciaDeRiego (descripcion) VALUES
('Diario'),
('Semanal'),
('Quincenal'),
('Mensual'),
('Cada dos días'),
('Cada tres días'),
('Cada cuatro días'),
('Cada cinco días'),
('Cada seis días'),
('Cada siete días');

-- insert Habitat
INSERT INTO Habitat (descripcion) VALUES
('Interior'),
('Exterior'),
('Todo Habitat'),
('Bosque'),
('Pradera'),
('Pantano'),
('Tundra'),
('Sabana'),
('Manglar'),
('Río');

-- insert LuzRequerida
INSERT INTO LuzRequerida (descripcion) VALUES
('Pleno sol'),
('Sombra parcial'),
('Sombra completa'),
('Luz indirecta'),
('Luz filtrada'),
('Luz brillante'),
('Luz moderada'),
('Luz baja'),
('Luz artificial'),
('Luz natural');

-- insert NivelDeHumedad
INSERT INTO NivelDeHumedad (descripcion) VALUES
('Alta'),
('Media'),
('Baja'),
('Muy alta'),
('Muy baja'),
('Moderada'),
('Seca'),
('Húmeda'),
('Mojada'),
('Empapada');

-- insert TipoDeSuelo
INSERT INTO TipoDeSuelo (descripcion) VALUES
('Arenoso'),
('Arcilloso'),
('Limoso'),
('Pedregoso'),
('Franco'),
('Turboso'),
('Calcáreo'),
('Salino'),
('Volcánico'),
('Orgánico');

-- insert Eficacia
INSERT INTO Eficacia (descripcion) VALUES
('Alta'),
('Media'),
('Baja'),
('Muy alta'),
('Muy baja'),
('Moderada'),
('Eficaz'),
('Ineficaz'),
('Parcialmente eficaz'),
('Totalmente eficaz');

-- insert Plaga
INSERT INTO Plaga (descripcion) VALUES
('Pulgones'),
('Cochinillas'),
('Ácaros'),
('Mosca blanca'),
('Trips'),
('Babosas'),
('Caracoles'),
('Orugas'),
('Nematodos'),
('Gorgojos');

-- insert FormaAplicacion
INSERT INTO FormaAplicacion (descripcion) VALUES
('Spray'),
('Polvo'),
('Granulado'),
('Líquido'),
('Gel'),
('Pasta'),
('Tableta'),
('Inyección'),
('Difusión'),
('Aplicación directa');

-- insert RetencionHumedad
INSERT INTO RetencionHumedad (descripcion) VALUES
('Alta'),
('Media'),
('Baja'),
('Muy alta'),
('Muy baja'),
('Moderada'),
('Seca'),
('Húmeda'),
('Mojada'),
('Empapada');

-- insert ComposicionSustrato
INSERT INTO ComposicionSustrato (descripcion) VALUES
('Turba'),
('Arena'),
('Arcilla'),
('Humus'),
('Perlita'),
('Vermiculita'),
('Fibra de coco'),
('Compost'),
('Grava'),
('Musgo');

-- insert TexturaSustrato
INSERT INTO TexturaSustrato (descripcion) VALUES
('Fina'),
('Media'),
('Gruesa'),
('Muy fina'),
('Muy gruesa'),
('Arenosa'),
('Arcillosa'),
('Limoso'),
('Pedregoso'),
('Orgánica');

-- insert TipoFertilizante
INSERT INTO TipoFertilizante (descripcion) VALUES
('Orgánico'),
('Inorgánico'),
('Líquido'),
('Granulado'),
('Soluble'),
('Lento liberación'),
('Rápido liberación'),
('Foliar'),
('Raíz'),
('Compost');

-- insert TipoPlantasRecomendadas
INSERT INTO TipoPlantasRecomendadas (descripcion) VALUES
('Interior'),
('Exterior'),
('Frutales'),
('Ornamentales'),
('Medicinales'),
('Aromáticas'),
('Cactus'),
('Suculentas'),
('Trepadoras'),
('Acuáticas');



-- insert FormaMacetero
INSERT INTO FormaMacetero (descripcion) VALUES
('Redondo'),
('Cuadrado'),
('Rectangular'),
('Ovalado'),
('Triangular'),
('Hexagonal'),
('Octagonal'),
('Cónico'),
('Pirámide'),
('Irregular');

-- insert perfil

INSERT INTO Perfil (descripcion, accesoSistema) VALUES
('Administrador', TRUE),
('Usuario', TRUE),
('Invitado', FALSE),
('Moderador', TRUE),
('Editor', TRUE),
('Supervisor', TRUE),
('Gerente', TRUE),
('Analista', TRUE),
('Desarrollador', TRUE),
('Tester', TRUE);

-- insert region
INSERT INTO Region (nombre) VALUES
('Región Metropolitana'),
('Región de Valparaíso'),
('Región del Biobío'),
('Región de La Araucanía'),
('Región de Los Lagos');

-- Insert Comuna
INSERT INTO Comuna (idRegion, nombre) VALUES
(1, 'Santiago'),
(1, 'Providencia'),
(2, 'Valparaíso'),
(2, 'Viña del Mar'),
(3, 'Concepción'),
(3, 'Talcahuano'),
(4, 'Temuco'),
(4, 'Villarrica'),
(5, 'Puerto Montt'),
(5, 'Osorno');

-- insert usuario
INSERT INTO Usuario (idPerfil, rutUsuario, nombres, apellidos, email, clave, telefono, direccion, idComuna, codigoPostal) VALUES
(1, '12345678-9', 'Cliente1', 'Prueba', 'cliente1@emaildeprueba.cl', 'clave123', 12345678, 'Direccion de Prueba 1', 1, '1234567'),
(2, '98765432-1', 'Cliente2', 'Prueba', 'cliente2@emaildeprueba.cl', 'clave456', 12345679, 'Direccion de Prueba 2', 2, '7654321'),
(3, '11223344-5', 'Cliente3', 'Prueba', 'cliente3@emaildeprueba.cl', 'clave789', 12345680, 'Direccion de Prueba 3', 3, '2345678'),
(4, '55667788-9', 'Cliente4', 'Prueba', 'cliente4@emaildeprueba.cl', 'clave012', 12345681, 'Direccion de Prueba 4', 4, '8765432'),
(5, '99887766-5', 'Cliente5', 'Prueba', 'cliente5@emaildeprueba.cl', 'clave345', 12345682, 'Direccion de Prueba 5', 5, '3456789'),
(6, '22334455-6', 'Cliente6', 'Prueba', 'cliente6@emaildeprueba.cl', 'clave678', 12345683, 'Direccion de Prueba 6', 6, '9876543'),
(7, '66778899-0', 'Cliente7', 'Prueba', 'cliente7@emaildeprueba.cl', 'clave901', 12345684, 'Direccion de Prueba 7', 7, '4567890'),
(8, '33445566-7', 'Cliente8', 'Prueba', 'cliente8@emaildeprueba.cl', 'clave234', 12345685, 'Direccion de Prueba 8', 8, '0987654'),
(9, '77889900-1', 'Cliente9', 'Prueba', 'cliente9@emaildeprueba.cl', 'clave567', 12345686, 'Direccion de Prueba 9', 9, '5678901'),
(10, '44556677-8', 'Cliente10', 'Prueba', 'cliente10@emaildeprueba.cl', 'clave890', 12345687, 'Direccion de Prueba 10', 10, '6789012');

-- Insertar EstadosVenta
INSERT INTO EstadosVenta (descripcion) VALUES
('Pendiente'),
('Procesando'),
('Enviado'),
('Entregado'),
('Cancelado'),
('Devuelto'),
('Reembolsado'),
('En espera'),
('Completado'),
('Fallido');

-- Insertar EstadosFormaPago
INSERT INTO EstadosFormaPago (descripcion) VALUES
('Activo'),
('Inactivo'),
('Pendiente'),
('Procesando'),
('Completado'),
('Fallido'),
('Cancelado'),
('Reembolsado'),
('En espera'),
('Rechazado');

-- Inserta FormaPago
INSERT INTO FormaPago (descripcion, idEstadoFormaPago) VALUES
('Tarjeta de Crédito', 1),
('Tarjeta de Débito', 2),
('Transferencia Bancaria', 3),
('Pago en Efectivo', 4),
('Cheque', 5),
('PayPal', 6),
('Criptomonedas', 7),
('Pago Móvil', 8),
('Pago en Tienda', 9),
('Pago Contra Entrega', 10);

-- Insertar TipoDespacho
INSERT INTO TipoDespacho (nombreMetodo, descripcion) VALUES
('Envío Estándar', 'Entrega en 3-5 días hábiles'),
('Envío Exprés', 'Entrega en 1-2 días hábiles'),
('Envío Internacional', 'Entrega en 7-14 días hábiles'),
('Recogida en Tienda', 'Recogida en tienda física'),
('Envío Gratuito', 'Entrega gratuita en 5-7 días hábiles'),
('Envío Prioritario', 'Entrega en el mismo día'),
('Envío Económico', 'Entrega en 5-10 días hábiles'),
('Envío Programado', 'Entrega en fecha programada'),
('Envío Nocturno', 'Entrega durante la noche'),
('Envío en Fin de Semana', 'Entrega durante el fin de semana');

-- INYECCION DE CASOS DEL CATALOGO DE PRODUCTOS (PLANTAS)

-- Insertar datos en la tabla Producto (Planta)
INSERT INTO Producto (nombreProducto, descuento, precioNormal, stock, descripcionProducto, valoracion, cantidadVentas, idCategoria)
VALUES
('Cactus Opuntia', 10, 8360, 10, 'Es un cactus firme y decorativo.', 4, 150, 1),
('Lengua de Suegra', 12, 12900, 55, 'Es una planta de interior popular.', 1, 100, 1),
('Lirio de Agua', 20, 8360, 12, 'Es una planta acuática decorativa.', 4, 120, 1),
('Monstera deliciosa', 17, 7456, 10, 'Es una planta tropical ideal para interiores.', 3, 130, 1),
('Helecho', 18, 9000, 32, 'Es una planta común en ambientes húmedos.', 2, 180, 1),
('Ficus lyrata', 22, 5779, 20, 'Es una planta popular de gran tamaño.', 5, 300, 1),
('Filodendro Longipetiolatum', 30, 5320, 100, 'Es una planta tropical común.', 1, 90, 1),
('Peperomia obtusifolia', 25, 9425, 34, 'Es una planta compacta y popular en interiores.', 2, 120, 1),
('Pilea peperomioides', 40, 7530, 25, 'Es una planta compacta y decorativa.', 1, 100, 1),
('Begonia Rex', 10, 6100, 60, 'Es una begonia decorativa con hojas de colores vivos.', 2, 110, 1);

-- Insertar datos en la tabla Planta
INSERT INTO Planta (idProducto, nombrePlanta, nombreCientifico, idHabitat, idLuz, idHumedad, temperaturaIdeal, toxicidadMascotas, tamanoMaximo, peso, idDificultad, idFrecuencia)
VALUES
(1, 'Cactus Opuntia', 'Opuntia', 1, 1, 1, 20.00, 0, 150, 150, 1, 1),
(2, 'Lengua de Suegra', 'Sansevieria trifasciata', 1, 1, 1, 18.00, 1, 150, 100, 1, 1),
(3, 'Lirio de Agua', 'Spathiphyllum', 2, 2, 2, 22.00, 0, 200, 120, 2, 1),
(4, 'Monstera deliciosa', 'Monstera deliciosa', 3, 2, 3, 25.00, 1, 180, 130, 2, 2),
(5, 'Helecho', 'Nephrolepis exaltata', 4, 2, 3, 23.00, 0, 300, 180, 2, 2),
(6, 'Ficus lyrata', 'Ficus lyrata', 5, 2, 2, 20.00, 0, 400, 300, 2, 2),
(7, 'Filodendro Longipetiolatum', 'Philodendron longipetiolatum', 6, 1, 2, 22.00, 0, 180, 90, 2, 2),
(8, 'Peperomia obtusifolia', 'Peperomia obtusifolia', 7, 2, 2, 18.00, 1, 200, 120, 2, 2),
(9, 'Pilea peperomioides', 'Pilea peperomioides', 8, 1, 2, 22.00, 0, 300, 100, 2, 2),
(10, 'Begonia Rex', 'Begonia rex', 9, 2, 3, 18.00, 1, 100, 110, 3, 2);

-- Insertar datos en la tabla ImagenProducto (Planta)
INSERT INTO ImagenProducto (idProducto, urlImagen)
VALUES
(1, 'https://acdn.mitiendanube.com/stores/001/202/679/products/opuntia-microdasys-amarilla11-f96f80e136ac2b347816196560098082-1024-1024.webp'),
(2, 'https://lepotit.cl/cdn/shop/products/SansevieriaMAutorreganteSblanco_860x.jpg?v=1633118960'),
(3, 'https://acdn.mitiendanube.com/stores/001/202/679/products/231-ad700e1f90d14e71ed16246336798562-1024-1024.webp'),
(4, 'https://www.kenaz.cl/cdn/shop/products/monstera-946603.jpg?v=1718161088&width=600'),
(5, 'https://cdnx.jumpseller.com/mentaconcept/image/41835179/resize/480/480?1699388964'),
(6, 'https://viverolosaromos.com/wp-content/uploads/2023/11/EXALTATA-HELECHO-510x510.webp'),
(7, 'https://www.kenaz.cl/cdn/shop/products/peperomia-cucharita-561186.jpg?v=1701109062&width=600'),
(8, 'https://d17jkdlzll9byv.cloudfront.net/wp-content/uploads/2023/06/ficus-lyrata-0002-900x900.jpg'),
(9, 'https://www.aprilplants.com/cdn/shop/products/Eucalipto_silver_dollar_copa_22o_cocoblanca_planta-de-exterior-aromatica_1024x.jpg?v=1679046875'),
(10, 'https://d17jkdlzll9byv.cloudfront.net/wp-content/uploads/2024/02/philodendron-longifolio-00001.jpg');


-- INYECCION DE CASOS PARA MACETEROS

-- Insertar datos en la tabla Producto (Macetero)
INSERT INTO Producto (nombreProducto, descuento, precioNormal, stock, descripcionProducto, valoracion, cantidadVentas, idCategoria)
VALUES
('Macetero de plástico redondo 40 cm', 10, 14990, 20, 'Macetero redondo de plástico, ideal para interiores y exteriores.', 4.5, 150, 3),
('Macetero cerámica grande', 15, 24990, 10, 'Macetero de cerámica de diseño moderno.', 4.7, 80, 3),
('Macetero colgante fibra natural', 5, 9990, 30, 'Macetero colgante de fibra natural.', 4.2, 120, 3),
('Macetero metálico con soporte', 20, 29990, 5, 'Macetero de metal con soporte de madera.', 4.8, 50, 3),
('Macetero cuadrado de cemento', 12, 18990, 15, 'Macetero de cemento con acabado rústico.', 4.6, 60, 3),
('Macetero de madera rústico', 8, 15990, 25, 'Macetero de madera con acabado rústico.', 4.3, 90, 3),
('Macetero de vidrio transparente', 10, 19990, 12, 'Macetero de vidrio transparente, ideal para interiores.', 4.9, 70, 3),
('Macetero de barro cocido', 7, 12990, 18, 'Macetero de barro cocido, ideal para exteriores.', 4.4, 110, 3),
('Macetero de metal galvanizado', 9, 17990, 20, 'Macetero de metal galvanizado, resistente a la intemperie.', 4.7, 100, 3),
('Macetero de piedra natural', 6, 21990, 8, 'Macetero de piedra natural, ideal para jardines.', 4.8, 50, 3);

-- Insertar datos en la tabla Macetero
INSERT INTO Macetero (idProducto, material, altura, ancho, color, peso, idForma)
VALUES
(11, 'Plástico', 40, 40, 'Gris', 1.5, 1),
(12, 'Cerámica', 45, 35, 'Blanco', 7, 2),
(13, 'Fibra natural', 30, 25, 'Beige', 0.5, 3),
(14, 'Metal', 50, 40, 'Negro', 3, 4),
(15, 'Cemento', 30, 30, 'Gris', 4, 5),
(16, 'Madera', 25, 25, 'Madera natural', 2, 1),
(17, 'Vidrio', 20, 20, 'Transparente', 1, 2),
(18, 'Barro', 30, 30, 'Terracota', 2.5, 3),
(19, 'Metal galvanizado', 35, 30, 'Plata', 2.8, 4),
(10, 'Piedra', 40, 40, 'Gris', 6, 5);

-- Insertar datos en la tabla ImagenProducto (Macetero)
INSERT INTO ImagenProducto (idProducto, urlImagen)
VALUES
(11, 'https://www.hogarmania.com/imagenes/noticias/2020/06/macetero-de-plastico-grande-con-planta.jpg'),
(12, 'https://www.hogarmania.com/imagenes/noticias/2020/06/macetero-ceramico-grande-con-planta.jpg'),
(13, 'https://www.hogarmania.com/imagenes/noticias/2020/06/macetero-colgante-fibra-natural-con-planta.jpg'),
(14, 'https://www.hogarmania.com/imagenes/noticias/2020/06/macetero-metalico-soporte-con-planta.jpg'),
(15, 'https://www.hogarmania.com/imagenes/noticias/2020/06/macetero-cemento-con-planta.jpg'),
(16, 'https://www.hogarmania.com/imagenes/noticias/2020/06/macetero-madera-rustico-con-planta.jpg'),
(17, 'https://www.hogarmania.com/imagenes/noticias/2020/06/macetero-vidrio-transparente-con-planta.jpg'),
(18, 'https://www.hogarmania.com/imagenes/noticias/2020/06/macetero-barro-cocido-con-planta.jpg'),
(19, 'https://www.hogarmania.com/imagenes/noticias/2020/06/macetero-metal-galvanizado-con-planta.jpg'),
(20, 'https://www.hogarmania.com/imagenes/noticias/2020/06/macetero-piedra-natural-con-planta.jpg');


-- INYECCION DE CASOS PARA FERTILIZANTES

-- Insertar datos en la tabla Producto
INSERT INTO Producto (id, nombreProducto, descuento, precioNormal, stock, descripcionProducto, valoracion, cantidadVentas, idCategoria)
VALUES
(21, 'Fertilizante Mix Full Jardín', 0, 5000, 100, 'Fertilizante para todo tipo de plantas.', 4, 50, 5),
(22, 'Fertilizante Follaje y Floración', 0, 7000, 200, 'Fertilizante para follaje y floración listo para usar.', 5, 75, 5),
(23, 'Fertilizante NPK Granulado', 0, 8000, 150, 'Fertilizante NPK en formato granular.', 3, 30, 5),
(24, 'Fertilizante Orgánico Mix Full', 0, 6000, 120, 'Fertilizante orgánico para jardinería.', 4, 40, 5),
(25, 'Fertilizante para Cactus y Suculentas', 0, 4000, 80, 'Fertilizante específico para cactus y suculentas.', 5, 60, 5);

-- Insertar datos en la tabla Fertilizante
INSERT INTO Fertilizante (idProducto, composicion, idTipoFertilizante, presentacion, frecuenciaAplicacion, peso)
VALUES
(21, 'Fertilizante completo con macro y micronutrientes.', 1, '1 LT', 'Cada 15 días', 1000),
(22, 'Fertilizante líquido con alto contenido de fósforo.', 2, '1 LT', 'Cada semana', 1000),
(23, 'Fertilizante granular con proporciones balanceadas de N-P-K.', 3, '1 KG', 'Cada mes', 1000),
(24, 'Fertilizante orgánico a base de compost.', 1, '1 KG', 'Cada 15 días', 1000),
(25, 'Fertilizante específico para cactáceas y suculentas.', 2, '200 GR', 'Cada mes', 200);


-- Insertar datos en la tabla ImagenProducto
INSERT INTO ImagenProducto (idProducto, urlImagen)
VALUES
(21,'https://whenua.cl/products/mix-full-jardin?variant=44250285670678'),
(22, 'https://bestgarden.cl/fertilizantes/23-fertilizante-follaje-y-floracion-listo-para-usar-1lt-7804630000903.html'),
(23, 'https://www.plantin.cl/product-page/npk-granulado'),
(24, 'https://tiendachagual.cl/producto/fertilizante-organico-mix-full/?utm_source=Google%20Shopping&utm_campaign=Productos%20Chagual%202022&utm_medium=cpc&utm_term=35101&gad_source=1&gclid=Cj0KCQjww5u2BhDeARIsALBuLnOcY7WGdjzwd0qg5DGf-FTyDIK34eUea2IXNJST8pYpKmmw0UbSpCYaArCQEALw_wcB'),
(25, 'https://www.sodimac.cl/sodimac-cl/articulo/110132792/Fertilizante-para-cactus-y-suculentas-200-gr-bolsa/110132793?kid=goosho_373415&shop=googleShopping&gad_source=1&gclid=Cj0KCQjww5u2BhDeARIsALBuLnPwkZa67TWdg8rQbU0e6r2ncQaou4VHDaBCt0LpyXiCNPLS-NHCFtUaAi7vEALw_wcB');

-- insertar datos en la tabla controldeplagas


-- Insertar datos en la tabla Producto para Control de Plagas (idCategoria = 2)
INSERT INTO Producto (nombreProducto, descuento, precioNormal, stock, descripcionProducto, valoracion, cantidadVentas, idCategoria)
VALUES
('Insecticida Orgánico', 10, 12990, 50, 'Insecticida orgánico para el control de plagas.', 4.5, 200, 2),
('Fungicida para Plantas', 15, 14990, 30, 'Fungicida efectivo contra hongos.', 4.7, 150, 2),
('Repelente Natural', 5, 9990, 40, 'Repelente natural para insectos.', 4.2, 100, 2),
('Acaricida Biológico', 20, 19990, 20, 'Acaricida biológico para el control de ácaros.', 4.8, 80, 2),
('Nematicida Ecológico', 12, 17990, 25, 'Nematicida ecológico para el control de nematodos.', 4.6, 90, 2);

-- Insertar datos en la tabla ControlDePlagas
INSERT INTO ControlPlagas (idProducto, composicion, idEficacia, duracionProteccion, peso)
VALUES
(26, 'Insecticida a base de piretrinas naturales.', 1, '1 mes', 500),
(27, 'Fungicida con cobre y azufre.', 2, '2 meses', 600),
(28, 'Repelente con extracto de neem.', 3, '3 semanas', 300),
(29, 'Acaricida con aceite de neem.', 1, '1 mes', 400),
(30, 'Nematicida con extracto de ajo.', 2, '2 meses', 700);

-- Insertar datos en la tabla ImagenProducto para Control de Plagas
INSERT INTO ImagenProducto (idProducto, urlImagen)
VALUES
(26, 'https://www.plantica.com.mx/images/104/3-2.jpg'),  -- Insecticida Orgánico
(27, 'https://www.plantica.com.mx/images/134/1-2.jpg'),  -- Fungicida para Plantas
(28, 'https://www.plantica.com.mx/images/120/1-2.jpg'),  -- Repelente Natural
(29, 'https://www.plantica.com.mx/images/102/4-2.jpg'),  -- Acaricida Biológico
(30, 'https://www.plantica.com.mx/images/123/1-2.jpg');  -- Nematicida Ecológico


-- insertar datos en la tabla sustratos

-- Insertar datos en la tabla Producto para Sustratos (idCategoria = 4)
INSERT INTO Producto (nombreProducto, descuento, precioNormal, stock, descripcionProducto, valoracion, cantidadVentas, idCategoria)
VALUES
('Sustrato Universal', 10, 5990, 100, 'Sustrato universal para todo tipo de plantas.', 4.5, 200, 4),
('Sustrato para Cactus', 15, 6990, 80, 'Sustrato especial para cactus y suculentas.', 4.7, 150, 4),
('Sustrato para Orquídeas', 5, 7990, 60, 'Sustrato específico para orquídeas.', 4.2, 100, 4),
('Sustrato para Bonsáis', 20, 8990, 50, 'Sustrato ideal para bonsáis.', 4.8, 80, 4),
('Sustrato para Plantas Ácidas', 12, 9990, 70, 'Sustrato para plantas que prefieren suelos ácidos.', 4.6, 90, 4);

-- Insertar datos en la tabla Sustrato
INSERT INTO Sustrato (idProducto,idRetencionHumedad,peso)
VALUES
(31, 1, 5000),
(32, 2, 4000),
(33, 3, 3000),
(34, 4, 3500),
(35, 5, 4500);

-- Insertar datos en la tabla ImagenProducto para Sustratos
INSERT INTO ImagenProducto (idProducto, urlImagen)
VALUES
(31, 'https://www.gardena.com/US/images/products/26820/zoom/26820-20.jpg'),  -- Sustrato Universal
(32, 'https://www.aaronsplants.com.au/wp-content/uploads/2022/09/cactus-soil.jpg'),  -- Sustrato para Cactus
(33, 'https://cdn.shopify.com/s/files/1/1745/8343/products/OrchidSoil.jpg'),  -- Sustrato para Orquídeas
(34, 'https://www.bonsaiempire.com/img/sustrato-bonsai.jpg'),  -- Sustrato para Bonsáis
(35, 'https://www.jardineriaon.com/wp-content/uploads/2020/09/sustrato-plantas-acidas.jpg');  -- Sustrato para Plantas Ácidas

-- Insertar datos en la tabla Estacion
INSERT INTO PlantaEstacion (idPlanta,idEstacion) VALUES
(1,1),
(1,2),
(2,1),
(2,2),
(3,3),
(4,4),
(5,1),
(6,3),
(7,3),
(8,3),
(8,1),
(9,1),
(10,1);

ALTER TABLE Producto
ADD COLUMN activo INT DEFAULT 1;