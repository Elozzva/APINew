import { Router } from "express";
import * as clienteController from "../controllers/cliente.controller"

const router = Router()

router.get('/', clienteController.getClientes)
router.get('/:clienteId', clienteController.getClienteById)
router.post('/', clienteController.createCliente) // Crear un nuevo cliente
router.put('/:clienteId', clienteController.updateCliente) // Actualizar un cliente
router.delete('/:clienteId', clienteController.deleteCliente) // Eliminar un cliente


export default router