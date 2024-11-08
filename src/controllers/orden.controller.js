import Orden from "../models/Orden";
import Producto from "../models/Producto";
import Stock from "../models/Stock";
import Empleado from "../models/Empleado";
import Fabricacion from "../models/Fabricacion";
import { crearFabricacion } from './fabricacion.controller';
import { verificarStockBajo } from "../utils/stockUtils";

// Obtener todas las órdenes
export const getOrdenes = async (req, res) => {
  try {
    const ordenes = await Orden.find()
    .populate({
      path: 'productos.producto',  // Poblar productos y piezas sin el material
      populate: {
        path: 'piezas.pieza'  // Solo populamos la pieza sin material
      }
    })
    .populate('empleado');
    res.status(200).json(ordenes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las órdenes' });
  }
};

// Crear una nueva orden (y descontar del stock)
export const createOrden = async (req, res) => {
  try {
    const { productos, fechaEntrega, empleado } = req.body;

    if (!productos || productos.length === 0 || !fechaEntrega) {
      return res.status(400).json({ message: "Productos, empleado y fecha de entrega son obligatorios" });
    }

    // Verificar si el empleado existe
    const empleadoExistente = await Empleado.findById(empleado);
    if (!empleadoExistente) {
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }

    for (const item of productos) {
      const producto = await Producto.findById(item.producto).populate('piezas.pieza');

      // Verificar si hay piezas suficientes en stock
      for (const piezaItem of producto.piezas) {
        const stockPieza = await Stock.findOne({ pieza: piezaItem.pieza._id, tipo: 'Pieza' });
        const cantidadNecesaria = piezaItem.cantidad * item.cantidad;

        if (!stockPieza || stockPieza.cantidad < cantidadNecesaria) {
          console.log(`Faltan piezas para la orden: ${piezaItem.pieza.nombre}. Cantidad necesaria: ${cantidadNecesaria}`);
          return res.status(400).json({ message: `Faltan piezas para completar la orden: ${piezaItem.pieza.nombre}` });
        }
      }
    }

    // Crear la nueva orden
    const nuevaOrden = new Orden({
      productos,
      fechaEntrega,
      estado: 'pendiente',  
      empleado 
    });
    await nuevaOrden.save();

    /* // Verificar si hay piezas suficientes en stock para cada producto
    for (const item of productos) {
      const producto = await Producto.findById(item.producto).populate('piezas.pieza');

      for (const piezaItem of producto.piezas) {
        const stockPieza = await Stock.findOne({ pieza: piezaItem.pieza._id, tipo: 'Pieza' });
        const cantidadNecesaria = piezaItem.cantidad * item.cantidad;

        // Si no hay suficiente stock de piezas, iniciar fabricación
        if (!stockPieza || stockPieza.cantidad < cantidadNecesaria) {
          // Aquí decides si fabricar internamente o externamente dependiendo de tus reglas
          await fabricarInternamente({ materialId: piezaItem.pieza.material, cantidadFabricar: item.cantidad }, res);
        }
      }
    } */

    res.status(201).json(nuevaOrden);
  } catch (error) {
    console.error("Error al crear la orden:", error);
    res.status(500).json({ message: "Error al crear la orden" });
  }
};

//Actualizar el estado de una orden
export const actualizarEstadoOrden = async (req, res) => {
  try {
    const { ordenId } = req.params;
    const { estado } = req.body;

    const orden = await Orden.findById(ordenId).populate('productos.producto').populate('empleado');
    if (!orden) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }

    // Si el estado es "en progreso", verificar si hay suficientes piezas
    if (estado === 'en progreso') {
      const faltantes = [];

      // Iterar sobre los productos en la orden
      for (const item of orden.productos) {
        const producto = await Producto.findById(item.producto).populate('piezas.pieza');

        // Verificar stock de piezas necesarias para fabricar el producto
        for (const piezaItem of producto.piezas) {
          const stockPieza = await Stock.findOne({ pieza: piezaItem.pieza._id, tipo: 'Pieza' });
          const cantidadNecesaria = piezaItem.cantidad * item.cantidad;

          if (!stockPieza || stockPieza.cantidad < cantidadNecesaria) {
            const faltantePiezas = cantidadNecesaria - (stockPieza?.cantidad || 0);
            faltantes.push({
              tipo: 'Pieza',
              nombre: piezaItem.pieza.nombre,
              cantidadFaltante: faltantePiezas
            });

            console.log(`Alerta: La pieza ${piezaItem.pieza.nombre} está faltando en cantidad de ${faltantePiezas}`);

            // Verificar si la pieza se fabrica y cómo se debe fabricar (interna o externa)
            if (piezaItem.pieza.seFabrica) {
              const tipoFabricacion = piezaItem.pieza.seFabrica; // 'interna' o 'externa'

              // Iniciar la fabricación de las piezas faltantes
              await crearFabricacion({
                tipo: tipoFabricacion,  // Fabricación interna o externa
                recetaId: piezaItem.pieza.receta,  // Asume que la pieza tiene una receta asociada
                cantidadFabricar: faltantePiezas,
                fechaEntrega: new Date()  // Definir una fecha de entrega según tu lógica
              }, res);
            } else {
              console.log(`La pieza ${piezaItem.pieza.nombre} no se fabrica, faltante: ${faltantePiezas}`);
            }
          }
        }
      }

      // Si hay faltantes, devolver los detalles y no cambiar el estado a 'en progreso'
      if (faltantes.length > 0) {
        return res.status(400).json({ message: 'Faltan piezas para iniciar la orden', faltantes });
      }
    }

    // Actualizar el estado de la orden
    orden.estado = estado;
    await orden.save();

    if (estado === 'completada') {
      // Disminuir el stock de piezas utilizadas para cada producto
      for (const item of orden.productos) {
        const producto = await Producto.findById(item.producto).populate('piezas.pieza');

        for (const piezaItem of producto.piezas) {
          const stockPieza = await Stock.findOne({ pieza: piezaItem.pieza._id, tipo: 'Pieza' });
          const cantidadNecesaria = piezaItem.cantidad * item.cantidad;

          // Verificar si hay suficiente stock antes de descontar
          if (stockPieza && stockPieza.cantidad >= cantidadNecesaria) {
            stockPieza.cantidad -= cantidadNecesaria;
            await stockPieza.save();

            // Verificar si el stock está por debajo del mínimo
            await verificarStockBajo('Pieza', piezaItem.pieza._id, stockPieza.cantidad);
          } else {
            return res.status(400).json({ message: `Stock insuficiente de la pieza: ${piezaItem.pieza.nombre}` });
          }
        }
      }
      // Actualizar el stock de productos terminados
      for (const item of orden.productos) {
        let stockProducto = await Stock.findOne({ producto: item.producto._id, tipo: 'Producto Terminado' });
        if (stockProducto) {
          stockProducto.cantidad += item.cantidad;
        } else {
          stockProducto = new Stock({
            producto: item.producto._id,
            cantidad: item.cantidad,
            tipo: 'Producto Terminado'
          });
        }
        await stockProducto.save();
      }
    }

    res.status(200).json(orden);
  } catch (error) {
    console.error("Error al actualizar el estado de la orden:", error);
    res.status(500).json({ message: "Error al actualizar el estado de la orden" });
  }
};

// Eliminar una orden
export const deleteOrden = async (req, res) => {
  try {
    const { ordenId } = req.params;
    const deletedOrden = await Orden.findByIdAndDelete(ordenId);
    if (!deletedOrden) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }
    res.status(200).json({ message: 'Orden eliminada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar la orden' });
  }
};