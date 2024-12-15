-- Crear la tabla preferencias
CREATE TABLE preferencias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  respuesta1 VARCHAR(255) NOT NULL,
  respuesta2 VARCHAR(255) NOT NULL,
  respuesta3 VARCHAR(255) NOT NULL,
  respuesta4 VARCHAR(255) NOT NULL,
  respuesta5 VARCHAR(255) NOT NULL,
  respuesta6 VARCHAR(255) NOT NULL,
  respuesta7 VARCHAR(255) NOT NULL,
  respuesta8 VARCHAR(255) NOT NULL,
  respuesta9 VARCHAR(255) NOT NULL,
  usuarioId INT,
  CONSTRAINT FK_usuario_preferencias FOREIGN KEY (usuarioId) REFERENCES Usuario(id)
);

-- Alterar la tabla Usuario para agregar la relación con la tabla preferencias
ALTER TABLE Usuario
ADD COLUMN preferenciasId INT,
ADD CONSTRAINT FK_preferencias_usuario FOREIGN KEY (preferenciasId) REFERENCES preferencias(id);