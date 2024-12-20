ALTER TABLE Venta
DROP COLUMN rutUsuario;
ALTER TABLE Venta
DROP COLUMN formaIdentificacion;

    
ALTER TABLE DetalleOrdenCompra 
ADD COLUMN cantidadVenta INT DEFAULT 0;