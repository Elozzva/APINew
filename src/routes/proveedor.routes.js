import { Router } from "express";
import * as proveedorController from "../controllers/proveedor.controller"

const router = Router()

router.get('/', proveedorController.getProveedores)
router.get('/:proveedorId', proveedorController.getProveedorById)
router.post('/', proveedorController.createProveedor) // Crear un nuevo proveedor
router.put('/:proveedorId', proveedorController.updateProveedor) // Actualizar un proveedor
router.delete('/:proveedorId', proveedorController.deleteProveedor) // Eliminar un proveedor


export default router