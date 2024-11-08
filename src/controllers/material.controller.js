import Material from "../models/Material";

export const getMaterials = async (req, res) => {
    try {
        const materials = await Material.find({});
        console.log("Si llego al controlador")
        console.log('Materiales obtenidos:', materials)

        res.status(200).json(materials )
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los materiales' });
    }
}
export const getMaterialById = async (req, res) => {

    if (!req.params.materialId) {
        res.status(404).json({message: 'Id inexistente'})
    }
    
    if (req.params.materialId.length<24) {
        res.status(404).json({message: 'Id invalido'})   
    }

    const material = await Material.findById(req.params.materialId );
    //console.log(material)
    if (material) {
        res.status(200).json(material )

    } else{
        res.status(404).json({message: 'Material no encontrado'})
    }

}

// Crear un nuevo material
export const createMaterials = async (req, res) => {
    try {
      const newMaterial = new Material(req.body);
      const savedMaterial = await newMaterial.save();
      res.status(201).json(savedMaterial);
    } catch (error) {
      console.error(error);
      res.status(400).json({message: 'Error al crear el material' });
    }
  }

  // Actualizar un material
export const editMaterial = async (req, res) => {
    try {
      console.log(req.params);
      const { id } = req.params.materialId;

      // Imprimir el ID en la consola
      console.log('ID del material a actualizar:', id);

      const updatedMaterial = await Material.findByIdAndUpdate(
        req.params.materialId,
        req.body,
        { new: true }
      );
      if (!updatedMaterial) {
        return res.status(404).json({ message: 'Material no encontrado' });
      }
      const response = {
        material: updatedMaterial,
        message: 'Material actualizado'
      };
      res.status(200).json(response); // Set status code to 200 for successful update
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: 'Error al actualizar el material' });
    }
  }

// Actualizar el stock de un material
export const updateMaterialStock = async (req, res) => {
  try {
      const { id } = req.params;
      const { cantidad } = req.body;

      const material = await Material.findById(id);
      if (!material) {
          return res.status(404).json({ message: 'Material no encontrado' });
      }

      // Validar la cantidad
      if (cantidad <= 0) {
          return res.status(400).json({ message: 'La cantidad debe ser menor a 0' });
      }

      // Actualizar el stock
      material.stockActual += cantidad;

      const updatedMaterial = await material.save();

      res.json(updatedMaterial);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al actualizar el stock' });
  }
};

  
// Eliminar un material
export const deleteMaterial = async (req, res) => {
  try {
    console.log(req.params);
    const { materialId } = req.params;

    // Imprimir el ID en la consola
    console.log('ID del material a eliminar:', materialId);


    const deletedMaterial = await Material.findByIdAndDelete(materialId);
    if (!deletedMaterial) {
      return res.status(404).json({ message: 'Material no encontrado' });
    }
    res.json({ message: 'Material eliminado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el material' });
  }
}

