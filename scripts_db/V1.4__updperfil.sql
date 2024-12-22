-- Renombrar la columna 'descripcion' a 'nombrePerfil'
ALTER TABLE Perfil CHANGE COLUMN descripcion nombrePerfil VARCHAR(255);

-- Asegurarse de que la columna 'accesoSistema' sea de tipo BOOLEAN
ALTER TABLE Perfil MODIFY COLUMN accesoSistema BOOLEAN;