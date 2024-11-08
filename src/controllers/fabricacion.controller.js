import Material from "../models/Material";
import Receta from "../models/Receta";
import Stock from "../models/Stock";
import Pieza from "../models/pieza";
import Proveedor from "../models/proveedor";
import Empleado from "../models/Empleado";
import Fabricacion from "../models/Fabricacion";
import { verificarStockBajo } from "../utils/stockUtils";

// Crear fabricación (interna o externa)
export const crearFabricacion = async (req, res) => {
  try {
    const { recetaId, materialId, empleadoId, proveedorId, cantidadFabricar, materialUsar, fechaEntrega } = req.body;

    // Validar datos obligatorios
    if (!recetaId || !cantidadFabricar) {
      return res.status(400).json({ message: "Receta y cantidad a fabricar son obligatorios." });
    }

    // Encontrar la receta asociada
    const receta = await Receta.findById(recetaId).populate('pieza');
    if (!receta) {
      return res.status(404).json({ message: "Receta no encontrada" });
    }

    const pieza = await Pieza.findById(receta.pieza._id);
    if (!pieza) {
      return res.status(404).json({ message: "Pieza no encontrada" });
    }

    // Determinar si la fabricación es interna o externa (a partir de la receta)
    const tipoFabricacion = receta.seFabrica;  // 'interna' o 'externa'

    const material = await Material.findById(materialId);
    if (!material) {
      return res.status(404).json({ message: "Material no encontrado" });
    }

    // Verificar el stock de material
    const stockMaterial = await Stock.findOne({ material: materialId, tipo: 'Material' });
    if (!stockMaterial || stockMaterial.cantidad < materialUsar) {
      return res.status(400).json({ message: "Stock insuficiente de material." });
    }

    // Crear el objeto de fabricación
    const fabricacion = new Fabricacion({
      tipo: receta.seFabrica,
      estado: 'pendiente',  // Inicialmente pendiente
      material: materialId,
      receta: recetaId,
      cantidad: cantidadFabricar,
      fechaEntrega,
      empleado: empleadoId || undefined,
      proveedor: proveedorId || undefined,
    });

    // Guardar fabricación
    await fabricacion.save();

    // Actualizar el stock del material
    stockMaterial.cantidad -= materialUsar;
    await stockMaterial.save();

    // Verificar si el stock de material está por debajo del mínimo
    await verificarStockBajo('Material', materialId, stockMaterial.cantidad);

    res.status(201).json({ message: `Fabricación ${tipoFabricacion} creada exitosamente.`, fabricacion });
  } catch (error) {
    console.error("Error al crear la fabricación:", error);
    res.status(500).json({ message: "Error al crear la fabricación." });
  }
};

export const completarFabricacion = async (req, res) => {
  try {
    const { fabricacionId } = req.params;

    // Buscar la fabricación
    const fabricacion = await Fabricacion.findById(fabricacionId)
      .populate({
        path: 'receta',
        populate: { path: 'pieza' }
      })
      .populate('material');

    if (!fabricacion) {
      return res.status(404).json({ message: 'Fabricación no encontrada.' });
    }

    // Verificar si la fabricación ya está completada
    if (fabricacion.estado === 'completada') {
      return res.status(400).json({ message: 'La fabricación ya ha sido completada.' });
    }

    // Verificar si la fabricación está en progreso para poder completarla
    if (fabricacion.estado !== 'en progreso') {
      return res.status(400).json({ message: 'La fabricación no está lista para completarse.' });
    }

    // Actualizar el stock de piezas fabricadas
    let stockPieza = await Stock.findOne({ pieza: fabricacion.receta.pieza._id, tipo: 'Pieza' });
    if (stockPieza) {
      stockPieza.cantidad += fabricacion.cantidad;
    } else {
      stockPieza = new Stock({
        pieza: fabricacion.receta.pieza._id,
        cantidad: fabricacion.cantidad,
        tipo: 'Pieza'
      });
    }
    await stockPieza.save();

    // Verificar si el stock de piezas está por debajo del mínimo
    await verificarStockBajo('Pieza', fabricacion.receta.pieza._id, stockPieza.cantidad);

    // Cambiar el estado de la fabricación a 'completada'
    fabricacion.estado = 'completada';
    await fabricacion.save();

    res.status(200).json({ message: 'Fabricación completada y stock actualizado' });
  } catch (error) {
    console.error('Error al completar la fabricación:', error);
    res.status(500).json({ message: 'Error al completar la fabricación.' });
  }
};

// Obtener todas las fabricaciones
export const getFabricaciones = async (req, res) => {
  console.log('Obtener todas las fabricaciones:');
  try {
    // Poblar material, receta, empleado y proveedor
    const fabricaciones = await Fabricacion.find()
      .populate('material')
      .populate({
        path: 'receta',
        populate: {
          path: 'pieza',  // Obtener la pieza a través de la receta
          model: 'Pieza'
        }
      })
      .populate('empleado')
      .populate('proveedor');
      const stocks = await Stock.find()
        .populate('material')
        .populate('pieza')
        .populate('producto');
    res.status(200).json({fabricaciones, stocks});
  } catch (error) {
    console.error('Error al obtener las fabricaciones:', error);
    res.status(500).json({ message: 'Error al obtener las fabricaciones' });
  }
};


// Actualizar el estado de fabricación
export const actualizarEstadoFabricacion = async (req, res) => {
  try {
    const { fabricacionId } = req.params;
    const { estado } = req.body;

    // Buscar la fabricación
    const fabricacion = await Fabricacion.findById(fabricacionId)
    .populate('proveedor empleado')
      .populate({
        path: 'receta',
        populate: {
          path: 'pieza',  // Poblar pieza dentro de receta
          model: 'Pieza'
        }
      });
    if (!fabricacion) {
      return res.status(404).json({ message: 'Fabricación no encontrada.' });
    }

    // Actualizar el estado basado en el tipo de fabricación
    fabricacion.estado = estado;
    await fabricacion.save();

    res.status(200).json(fabricacion);
  } catch (error) {
    console.error('Error al actualizar el estado de la fabricación:', error);
    res.status(500).json({ message: 'Error al actualizar el estado de la fabricación.' });
  }
};


// Obtener una fabricacion por ID
export const getFabricacionById = async (req, res) => {
  try {
    const fabricacion = await Fabricacion.findById(req.params.fabricacionId);
    if (!fabricacion) {
      return res.status(404).json({ message: 'Fabricacion no encontrada' });
    }
    res.status(200).json(fabricacion);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la fabricacion' });
  }
};

// Actualizar una fabricacion existente
export const updateFabricacion = async (req, res) => {
  try {
    const updatedFabricacion = await Fabricacion.findByIdAndUpdate(req.params.fabricacionId, req.body, { new: true });
    if (!updatedFabricacion) {
      return res.status(404).json({ message: 'Fabricacion no encontrada' });
    }
    res.status(200).json(updatedFabricacion);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar la Fabricacion' });
  }
};

// Eliminar una fabricacion
export const deleteFabricacion = async (req, res) => {
  try {
    const deletedFabricacion = await Fabricacion.findByIdAndDelete(req.params.fabricacionId);
    if (!deletedFabricacion) {
      return res.status(404).json({ message: 'Fabricacion no encontrada' });
    }
    res.status(200).json({ message: 'Fabricacion eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la fabricacion' });
  }
};