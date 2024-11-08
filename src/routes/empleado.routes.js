import { Router } from "express";
import * as empleadoController from "../controllers/empleado.controller"

const router = Router()

router.get('/', empleadoController.getEmpleados)
router.get('/:empleadoId', empleadoController.getEmpleadoById)
router.post('/', empleadoController.createEmpleado) // Crear un nuevo empleado
router.put('/:empleadoId', empleadoController.updateEmpleado) // Actualizar un empleado
router.delete('/:empleadoId', empleadoController.deleteEmpleado) // Eliminar un empleado


export default router