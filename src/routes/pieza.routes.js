import { Router } from "express";
import * as piezaController from "../controllers/pieza.controller";  // Importa las funciones del controlador

const router = Router();

// Ruta para obtener todas las piezas
router.get('/', piezaController.getPiezas);

// Ruta para obtener una pieza específica por ID
router.get('/:piezaId', piezaController.getPiezaById);

// Ruta para crear una nueva pieza
router.post('/', piezaController.createPieza);

// Ruta para actualizar una pieza existente por ID
router.put('/:piezaId', piezaController.updatePieza);

// Ruta para eliminar una pieza por ID
router.delete('/:piezaId', piezaController.deletePieza);

export default router;