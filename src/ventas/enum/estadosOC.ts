export enum EstadoOrden {
  CREADA = 'Creada',
  ANULADA = 'Anulada',
  PROCESANDO = 'Procesando',
  ESPERA_PAGO = 'Espera_Pago',
  VENTA_ANULADA = 'Venta Anulada',
  COMPLETADO = 'Completado',
}
/*
INSERT INTO EstadosOC (descripcion) VALUES
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

*/
