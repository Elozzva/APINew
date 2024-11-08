import { Router } from "express";
import * as recetaController from "../controllers/receta.controller";

const router = Router();

// Crear una nueva receta
router.post('/', recetaController.createReceta);

// Obtener todas las recetas
router.get('/', recetaController.getRecetas);

// Obtener una receta específica por ID
router.get('/:recetaId', recetaController.getRecetaById);

// Ruta para obtener las piezas asociadas a un material
router.get('/material/:materialId', recetaController.getPiezasPorMaterial);

// Actualizar una receta
router.put('/:recetaId', recetaController.updateReceta);

// Eliminar una receta
router.delete('/:recetaId', recetaController.deleteReceta);

router.get('/pieza/:piezaId', recetaController.getRecetaByPieza);

// Obtener receta por pieza
router.get('/recetas/pieza/:piezaId', async (req, res) => {
    try {
      const receta = await Receta.findOne({ pieza: req.params.piezaId }).populate('material');
      if (!receta) return res.status(404).json({ message: 'Receta no encontrada' });
      res.status(200).json(receta);
    } catch (error) {
      console.error('Error al obtener receta por pieza:', error);
      res.status(500).json({ message: 'Error al obtener la receta' });
    }
  });

export default router;