import { Router } from "express";
import * as fabricacionController from "../controllers/fabricacion.controller";  // Importa las funciones del controlador

const router = Router();

// Ruta para obtener todas las fabricaciones
router.get('/', fabricacionController.getFabricaciones);

// Ruta para obtener una fabricación específica por ID
router.get('/:fabricacionId', fabricacionController.getFabricacionById);

// Crear una nueva fabricación (interna o externa)
router.post('/', fabricacionController.crearFabricacion);

// Ruta para actualizar una fabricación existente (puede ser para cambiar cantidad, fechas, etc.)
router.put('/:fabricacionId', fabricacionController.updateFabricacion);

// Ruta para actualizar el estado de una fabricación (iniciar, completar, cancelar)
router.put('/:fabricacionId/estado', fabricacionController.actualizarEstadoFabricacion);

// Ruta para completar una fabricación (externa o interna) por ID
router.post('/:fabricacionId/completar', fabricacionController.completarFabricacion);

// Ruta para eliminar una fabricación por ID
router.delete('/:fabricacionId', fabricacionController.deleteFabricacion);

export default router;