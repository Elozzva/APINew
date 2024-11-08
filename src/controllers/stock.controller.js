import Stock from "../models/Stock";
import Receta from "../models/Receta";
import Pieza from "../models/pieza";
import Material from "../models/Material";
import Producto from "../models/Producto";

export const getStocks = async (req, res) =>{
  try {
    const stocks = await Stock.find();
    return stocks;
  } catch (error) {
    console.error('Error al obtener los stocks:', error);
    throw error;
  }
}

export const getStockById = async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.stockId);
    if (!stock) {
      return res.status(404).json({ message: 'Stock no encontrado' });
    }
    res.status(200).json(stock);
  } catch (error) {
    console.error('Error al obtener el stock:', error);
    res.status(500).json({ message: 'Error al obtener el stock' });
  }
};

export const updateStock = async (req, res) => {
  try {
    const { stockId } = req.params;
    const updatedData = req.body;

    const stock = await Stock.findByIdAndUpdate(stockId, updatedData, { new: true });
    if (!stock) {
      return res.status(404).json({ message: 'Stock no encontrado' });
    }

    res.status(200).json(stock);
  } catch (error) {
    console.error('Error al actualizar el stock:', error);
    res.status(500).json({ message: 'Error al actualizar el stock' });
  }
};


/*
async function getStocksByTipo(tipo) {
  try {
    const stocks = await Stock.find({ tipo })
    .populate(tipo === 'Material' ? 'material' : tipo === 'Pieza' ? 'pieza' : 'producto');
    return stocks;
  } catch (error) {
    console.error('Error al obtener los stocks de tipo ${tipo}:', error);
    throw error;
  }
}

 // Uso:
getStocksByTipo('Material')
  .then(stocks => {
    console.log(stocks);
  })
  .catch(error => {
    console.error(error);
  }); */

// Crear nuevo stock para un material, pieza o producto terminado
export const createStock = async (req, res) => {
  try {
    const { tipo, materialId, piezaId, productoId, cantidad } = req.body;

    // Validar que el tipo de stock sea válido
    if (!tipo || !cantidad) {
      return res.status(400).json({ message: 'El tipo y la cantidad son obligatorios' });
    }

    let stock;
    if (tipo === 'Material') {
      // Manejar stock de Materiales
      const material = await Material.findById(materialId);
      if (!material) {
        return res.status(404).json({ message: 'Material no encontrado' });
      }

      stock = await Stock.findOneAndUpdate(
        { material: materialId, tipo: 'Material' },
        { $inc: { cantidad } },
        { new: true, upsert: true }  // Crea si no existe
      );
    } else if (tipo === 'Pieza') {
      const pieza = await Pieza.findById(piezaId);
      if (!pieza) return res.status(404).json({ message: 'Pieza no encontrada' });

      stock = await Stock.findOneAndUpdate(
        { pieza: piezaId, tipo: 'Pieza' },
        { $inc: { cantidad } },
        { new: true, upsert: true }
      );
    } else if (tipo === 'Producto Terminado') {
      const producto = await Producto.findById(productoId);
      if (!producto) return res.status(404).json({ message: 'Producto no encontrado' });

      stock = await Stock.findOneAndUpdate(
        { producto: productoId, tipo: 'Producto Terminado' },
        { $inc: { cantidad } },
        { new: true, upsert: true }
      );
    } else {
      return res.status(400).json({ message: 'Tipo de stock inválido' });
    }

    res.status(201).json(stock);
  } catch (error) {
    console.error('Error al crear el stock:', error);
    res.status(500).json({ message: 'Error al crear el stock' });
  }
};

// Actualizar el stock de materiales cuando se crea una fabricación
export const actualizarStockMaterial = async (materialId, cantidadUsar) => {
  const stockMaterial = await Stock.findOne({ material: materialId, tipo: 'Material' });
  if (!stockMaterial || stockMaterial.cantidad < cantidadUsar) {
    throw new Error('Stock insuficiente de material.');
  }
  
  // Descontar el stock del material
  stockMaterial.cantidad -= cantidadUsar;
  await stockMaterial.save();
};

// Actualizar el stock de piezas cuando se completa una fabricación
export const actualizarStockPiezas = async (recetaId, cantidadPiezas) => {
  const stockPieza = await Stock.findOne({ receta: recetaId, tipo: 'Pieza' });
  if (stockPieza) {
    stockPieza.cantidad += cantidadPiezas;  // Sumar la cantidad de piezas fabricadas
  } else {
    const nuevaPiezaStock = new Stock({
      receta: recetaId,
      cantidad: cantidadPiezas,
      tipo: 'Pieza'
    });
    await nuevaPiezaStock.save();
  }
};

// Eliminar un stock
export const deleteStock = async (req, res) => {
  try {
    const { stockId } = req.params;
    const deletedStock = await Stock.findByIdAndDelete(stockId);
    if (!deletedStock) {
      return res.status(404).json({ message: 'Stock no encontrado' });
    }
    res.status(200).json({ message: 'Stock eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el stock:', error);
    res.status(500).json({ message: 'Error al eliminar el stock' });
  }
};

// Obtener el stock de un material específico
export const getStockByMaterial = async (req, res) => {
  try {
    const { materialId } = req.params;
    const stock = await Stock.findOne({ material: materialId, tipo: 'Material' });
    if (!stock) {
      return res.status(404).json({ message: 'Stock no encontrado para el material' });
    }
    res.status(200).json(stock);
  } catch (error) {
    console.error('Error al obtener el stock:', error);
    res.status(500).json({ message: 'Error al obtener el stock' });
  }
};

// Obtener stock de Materiales
export const getStockMateriales = async (req, res) => {
  try {
    const stockMateriales = await Stock.find({ tipo: 'Material' }).populate('material');
    res.status(200).json(stockMateriales);
  } catch (error) {
    console.error('Error al obtener el stock de materiales:', error);
    res.status(500).json({ message: 'Error al obtener el stock de materiales' });
  }
};

// Ruta para obtener el stock de un material específico
export const obtenerStockPorMaterial = async (req, res) => {
  try {
    const { materialId } = req.params;

    console.log(`Obteniendo stock para materialId: ${materialId}`);
    
    // Asegúrate de poblar el material relacionado con el stock
    const stock = await Stock.findOne({ material: materialId }).populate('material');
    
    if (!stock) {
      return res.status(404).json({ message: 'Stock no encontrado para este material' });
    }

    res.status(200).json(stock);
  } catch (error) {
    console.error('Error al obtener el stock:', error);
    res.status(500).json({ message: 'Error al obtener el stock del material' });
  }
};

// Obtener stock de Piezas
export const getStockPiezas = async (req, res) => {
  try {
    const stockPiezas = await Stock.find({ tipo: 'Pieza' }).populate('pieza');
    console.log("Piezas encontradas: ", stockPiezas);
    res.status(200).json(stockPiezas);
  } catch (error) {
    console.error('Error al obtener el stock de piezas:', error);
    res.status(500).json({ message: 'Error al obtener el stock de piezas' });
  }
};

export const updateStockFromReceta = async (req, res) => {
  // Lógica para actualizar el stock a partir de una receta
  try {
    // Implementar la lógica aquí
  } catch (error) {
    console.error('Error al actualizar el stock a partir de la receta:', error);
    res.status(500).json({ message: 'Error al actualizar el stock a partir de la receta' });
  }
};

// Obtener stock de Productos Terminados
export const getStockProductosTerminados = async (req, res) => {
  try {
    const stockProductos = await Stock.find({ tipo: 'Producto Terminado' }).populate('producto');
    res.status(200).json(stockProductos);
  } catch (error) {
    console.error('Error al obtener el stock de productos terminados:', error);
    res.status(500).json({ message: 'Error al obtener el stock de productos terminados' });
  }
};

// Verificar el stock de un material
/* export const verificarStock = async (req, res) => {
  try {
    const { materialId } = req.params;

    // Obtener el material y el stock asociado
    const material = await Material.findById(materialId);
    if (!material) {
      return res.status(404).json({ message: "Material no encontrado" });
    }

    // Obtener el stock del material
    const stockMaterial = await Stock.findOne({ material: materialId });
    if (!stockMaterial) {
      return res.status(404).json({ message: "Stock no encontrado para este material" });
    }

    // Verificar si el stock está por debajo del mínimo
    const stockBajo = stockMaterial.cantidad < material.stockMinimo;
    return res.status(200).json({ stockBajo, stockDisponible: stockMaterial.cantidad, stockMinimo: material.stockMinimo });

  } catch (error) {
    console.error('Error al verificar el stock:', error);
    res.status(500).json({ message: 'Error al verificar el stock' });
  }
};
 */