import { Router } from "express";
import * as materialController from "../controllers/material.controller"

const router = Router()

router.get('/', materialController.getMaterials)
router.get('/:materialId', materialController.getMaterialById)
router.post('/', materialController.createMaterials) // Crear un nuevo material
router.put('/:materialId', materialController.editMaterial) // Actualizar un material
router.delete('/:materialId', materialController.deleteMaterial) // Eliminar un material


export default router