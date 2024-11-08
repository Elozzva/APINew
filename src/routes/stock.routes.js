import { Router } from "express";
import * as stockController from "../controllers/stock.controller";

const router = Router();

// Obtener el stock completo
router.get('/', stockController.getStocks);

// Crear nuevo stock para una receta
router.post('/', stockController.createStock);

// Actualizar stock a partir de una receta (verifica que la función esté definida y correctamente importada)
router.put('/actualizar', stockController.updateStockFromReceta);

// Eliminar un stock
router.delete('/:stockId', stockController.deleteStock);

// Ruta para obtener el stock de materiales
router.get('/materiales', stockController.getStockMateriales);

// Ruta para obtener el stock de piezas
router.get('/piezas', stockController.getStockPiezas);

// Ruta para obtener el stock de productos terminados
router.get('/productos', stockController.getStockProductosTerminados);

// Ruta para actualizar el stock de material
router.put('/material/:materialId', stockController.actualizarStockMaterial);

// Ruta para actualizar el stock de piezas (cuando se completa la fabricación)
router.put('/piezas/:recetaId', stockController.actualizarStockPiezas);

// Obtener un stock específico por ID
router.get('/:stockId', stockController.getStockById);

//router.get('/verificar-stock/:materialId', stockController.verificarStock); 

router.put('/:stockId', stockController.updateStock);

// Ruta para obtener el stock de un material específico
router.get('/material/:materialId', stockController.obtenerStockPorMaterial);



export default router;