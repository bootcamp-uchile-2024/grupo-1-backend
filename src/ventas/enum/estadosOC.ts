export enum EstadoOrden {
  CREADA = 'Creada',
  ANULADA = 'Anulada',
  PROCESANDO = 'Procesamdo',
  ESPERA_PAGO = 'Espera_Pago',
  VENTA_ANULADA = 'Venta Anulada',
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
