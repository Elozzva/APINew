import Stock from "../models/Stock";
import Pieza from "../models/pieza";
import Material from "../models/Material";

// Verificar si el stock actual está por debajo del stock mínimo
export const verificarStockBajo = async (tipo, id, cantidadActual) => {
  try {
    let elemento;
    
    if (tipo === 'Pieza') {
      elemento = await Pieza.findById(id);
    } else if (tipo === 'Material') {
      elemento = await Material.findById(id);
    }

    if (!elemento) {
      console.error(`Error: ${tipo} con ID ${id} no encontrado.`);
      return;
    }

    // Verificar si la cantidad actual está por debajo del stock mínimo
    if (cantidadActual < elemento.stockMinimo) {
      console.log(`Alerta: El stock de ${tipo} (${elemento.nombre}) está por debajo del mínimo.`);
    }
  } catch (error) {
    console.error(`Error al verificar el stock bajo de ${tipo}:`, error);
  }
};
