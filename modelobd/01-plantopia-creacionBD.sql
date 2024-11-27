
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
