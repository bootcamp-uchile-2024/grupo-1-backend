UPDATE Usuario SET idPerfil = 2 WHERE idPerfil NOT IN (1, 2, 3);

UPDATE Perfil
SET nombrePerfil = CASE id
    WHEN 1 THEN 'ADMIN'
    WHEN 2 THEN 'USUARIO'
    WHEN 3 THEN 'INVITADO'
END
WHERE id IN (1, 2, 3);

DELETE FROM Perfil
WHERE id > 3;