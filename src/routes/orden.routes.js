import { Router } from "express";
import * as ordenController from "../controllers/orden.controller";

const router = Router();

// Obtener todas las órdenes
router.get('/', ordenController.getOrdenes);

// Crear una orden
router.post('/', ordenController.createOrden);

// Eliminar una orden
router.delete('/:ordenId', ordenController.deleteOrden);

// Ruta para actualizar el estado de una orden
router.put('/:ordenId', ordenController.actualizarEstadoOrden);

export default router;