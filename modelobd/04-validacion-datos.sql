-- Active: 1729829201905@@127.0.0.1@3307@PlantopiaDB
-- trae los maceteros junto a sus imagenes guardadas
SELECT
  p.id AS idProducto,
  p.nombreProducto,
  p.descripcionProducto,
  ip.urlImagen
FROM
  Macetero m
INNER JOIN
  Producto p ON m.idProducto = p.id
INNER JOIN
  ImagenProducto ip ON p.id = ip.idProducto
WHERE
  p.idCategoria = 3;


-- trae los fertilizantes junto a sus imagenes guardadas
SELECT
  p.id AS idProducto,
  p.nombreProducto,
  p.descripcionProducto,
  ip.urlImagen
FROM
  Fertilizante f
INNER JOIN
  Producto p ON f.idProducto = p.id
INNER JOIN
  ImagenProducto ip ON p.id = ip.idProducto
WHERE
  p.idCategoria = 5;

-- trae los sustratos junto a sus imagenes guardadas
SELECT
  p.id AS idProducto,
  p.nombreProducto,
  p.descripcionProducto,
  ip.urlImagen
FROM
  Sustrato s
INNER JOIN
  Producto p ON s.idProducto = p.id
INNER JOIN
  ImagenProducto ip ON p.id = ip.idProducto
WHERE
  p.idCategoria = 4;

  -- trae la inforamcion de control de plagas junto a sus imagenes guardadas
  SELECT
    p.id AS idProducto,
    p.nombreProducto,
    p.descripcionProducto,
    ip.urlImagen
  FROM
    ControlPlagas cp
  INNER JOIN
    Producto p ON cp.idProducto = p.id
  INNER JOIN
    ImagenProducto ip ON p.id = ip.idProducto
  WHERE
    p.idCategoria = 2;


s