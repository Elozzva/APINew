import Producto from "../models/Producto";

// Obtener todos los productos
export const getProductos = async (req, res) => {
  try {
    const productos = await Producto.find().populate('piezas.pieza');  
    res.status(200).json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los productos' });
  }
};

// Obtener productos terminados
export const getProductosTerminados = async (req, res) => {
  try {
    const productosTerminados = await Producto.find({ estado: 'Terminado' });
    res.status(200).json(productosTerminados);
  } catch (error) {
    console.error('Error al obtener productos terminados:', error);
    res.status(500).json({ message: 'Error al obtener productos terminados' });
  }
};

// Crear un producto
export const createProducto = async (req, res) => {
  try {
    const { name, description, piezas } = req.body;

    const nuevoProducto = new Producto({ name, description, piezas });
    const savedProducto = await nuevoProducto.save();

    res.status(201).json(savedProducto);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Error al crear el producto' });
  }
};

// Eliminar un producto
export const deleteProducto = async (req, res) => {
  try {
    const { productoId } = req.params;
    const deletedProducto = await Producto.findByIdAndDelete(productoId);
    if (!deletedProducto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.status(200).json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el producto' });
  }
};