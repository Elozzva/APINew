import Receta from "../models/Receta";
import Material from "../models/Material";
import Pieza from "../models/pieza";

export const getRecetas = async (req, res) => {
    try {
      const recetas = await Receta.find().populate('material').populate('pieza');
      res.status(200).json(recetas);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener las recetas' });
    }
  };

  export const getRecetaById = async (req, res) => {
    try {
      const receta = await Receta.findById(req.params.recetaId).populate('material').populate('pieza');
      if (!receta) {
        return res.status(404).json({ message: 'Receta no encontrada' });
      }
      res.status(200).json(receta);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener la receta' });
    }
  };

  // Obtener piezas basadas en un material
export const getPiezasByMaterial = async (req, res) => {
  try {
    const { materialId } = req.params;
    const recetas = await Receta.find({ material: materialId }).populate('pieza');
    
    const piezas = recetas.map(receta => receta.pieza);
    res.status(200).json(piezas);
  } catch (error) {
    console.error('Error al obtener piezas por material:', error);
    res.status(500).json({ message: 'Error al obtener piezas por material' });
  }
};

// Controlador para obtener piezas por material
export const getPiezasPorMaterial = async (req, res) => {
  const { materialId } = req.params;

  try {
    const piezas = await Receta.find({ material: materialId }).populate('pieza');
    if (!piezas) {
      return res.status(404).json({ message: 'No se encontraron piezas para este material' });
    }
    res.status(200).json(piezas);
  } catch (error) {
    console.error('Error al obtener piezas por material:', error);
    res.status(500).json({ message: 'Error al obtener piezas por material' });
  }
};

  export const updateReceta = async (req, res) => {
    try {
      const { recetaId } = req.params;
      const updatedReceta = await Receta.findByIdAndUpdate(recetaId, req.body, { new: true });
  
      if (!updatedReceta) {
        return res.status(404).json({ message: 'Receta no encontrada' });
      }
      res.status(200).json(updatedReceta);
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: 'Error al actualizar la receta' });
    }
  };

// Crear una receta
export const createReceta = async (req, res) => {
  try {
    const { material, pieza, piezasPorUnidad, seFabrica } = req.body;
    
    const materialDB = await Material.findById(material);
    const piezaDB = await Pieza.findById(pieza);
    
    if (!materialDB || !piezaDB) {
      return res.status(404).json({ message: 'Material o pieza no encontrados' });
    }
    
    const nuevaReceta = new Receta({
      material,
      pieza,
      piezasPorUnidad,
      seFabrica
    });
    console.log(nuevaReceta)
    
    const savedReceta = await nuevaReceta.save();
    res.status(201).json(savedReceta);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Error al crear la receta' });
  }
};

export const deleteReceta = async (req, res) => {
    try {
      const { recetaId } = req.params;
      const deletedReceta = await Receta.findByIdAndDelete(recetaId);
      if (!deletedReceta) {
        return res.status(404).json({ message: 'Receta no encontrada' });
      }
      res.status(200).json({ message: 'Receta eliminada exitosamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al eliminar la receta' });
    }
  };

  export const getRecetaByPieza = async (req, res) => {
    try {
      const { piezaId } = req.params;
      
      // Buscar la receta relacionada a la pieza y poblar el material
      const receta = await Receta.findOne({ pieza: piezaId }).populate('material');

      console.log('Receta encontrada:', receta);
      
      if (!receta) {
        return res.status(404).json({ message: 'Receta no encontrada' });
      }
      
      res.status(200).json(receta);
    } catch (error) {
      console.error('Error al obtener receta por pieza:', error);
      res.status(500).json({ message: 'Error al obtener la receta' });
    }
  };