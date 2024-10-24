USE PlantopiaDB;

-- Desactivar las claves foráneas temporalmente
SET FOREIGN_KEY_CHECKS = 0;

-- Truncar todas las tablas
TRUNCATE TABLE DetalleOrdenCompra;
TRUNCATE TABLE ServicioUsuario;
TRUNCATE TABLE FertilizantesSugeridos;
TRUNCATE TABLE SustratosSugeridos;
TRUNCATE TABLE FertilizanteTipoPlantas;
TRUNCATE TABLE SustratoTextura;
TRUNCATE TABLE SustratoComposicion;
TRUNCATE TABLE FormaAplicaControlPlaga;
TRUNCATE TABLE PlagasControladas;
TRUNCATE TABLE PlantaTipoSuelo;
TRUNCATE TABLE PlantaEstacion;
TRUNCATE TABLE ImagenProducto;
TRUNCATE TABLE CoberturaDespachoProducto;
TRUNCATE TABLE DetalleJardinVirtual;
TRUNCATE TABLE JardinVirtual;
TRUNCATE TABLE Despacho;
TRUNCATE TABLE Venta;
TRUNCATE TABLE OrdenCompra;
TRUNCATE TABLE Servicio;
TRUNCATE TABLE Macetero;
TRUNCATE TABLE Fertilizante;
TRUNCATE TABLE Sustrato;
TRUNCATE TABLE ControlPlagas;
TRUNCATE TABLE Planta;
TRUNCATE TABLE Producto;
TRUNCATE TABLE Usuario;
TRUNCATE TABLE Perfil;
TRUNCATE TABLE TipoDespacho;
TRUNCATE TABLE FormaPago;
TRUNCATE TABLE EstadosFormaPago;
TRUNCATE TABLE EstadosVenta;
TRUNCATE TABLE Comuna;
TRUNCATE TABLE Region;
TRUNCATE TABLE Ciudad;
TRUNCATE TABLE FormaMacetero;
TRUNCATE TABLE EstadosOC;
TRUNCATE TABLE TipoPlantasRecomendadas;
TRUNCATE TABLE TipoFertilizante;
TRUNCATE TABLE TexturaSustrato;
TRUNCATE TABLE ComposicionSustrato;
TRUNCATE TABLE RetencionHumedad;
TRUNCATE TABLE FormaAplicacion;
TRUNCATE TABLE Plaga;
TRUNCATE TABLE Eficacia;
TRUNCATE TABLE TipoDeSuelo;
TRUNCATE TABLE NivelDeHumedad;
TRUNCATE TABLE LuzRequerida;
TRUNCATE TABLE Habitat;
TRUNCATE TABLE FrecuenciaDeRiego;
TRUNCATE TABLE Estacion;
TRUNCATE TABLE DificultadDeCuidado;
TRUNCATE TABLE Categoria;

-- Reactivar las claves foráneas
SET FOREIGN_KEY_CHECKS = 1;