import { Router } from "express";
import * as productoController from "../controllers/producto.controller";

const router = Router();

// Verifica que `productoController.getProductos` esté correctamente importado y definido
router.get('/', productoController.getProductos);

// Asegúrate de que todas las funciones están definidas en `productoController`
router.post('/', productoController.createProducto);
router.delete('/:productoId', productoController.deleteProducto);
router.get('/terminados', productoController.getProductosTerminados);

export default router;