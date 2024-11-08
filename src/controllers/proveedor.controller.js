import Proveedor from "../models/proveedor";

// Obtener todos los proveedores
export const getProveedores = async (req, res) => {
  try {
    const proveedores = await Proveedor.find();
    res.status(200).json(proveedores);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los proveedores' });
  }
};

// Crear un nuevo proveedor
export const createProveedor = async (req, res) => {
  try {
    const newProveedor = new Proveedor(req.body);
    const savedProveedor = await newProveedor.save();
    res.status(201).json(savedProveedor);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear el proveedor' });
  }
};

// Obtener un proveedor por ID
export const getProveedorById = async (req, res) => {
  try {
    const proveedor = await Proveedor.findById(req.params.proveedorId);
    if (!proveedor) {
      return res.status(404).json({ message: 'Proveedor no encontrado' });
    }
    res.status(200).json(proveedor);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el proveedor' });
  }
};

// Actualizar un proveedor
export const updateProveedor = async (req, res) => {
  try {
    const updatedProveedor = await Proveedor.findByIdAndUpdate(
      req.params.proveedorId,
      req.body,
      { new: true }
    );
    if (!updatedProveedor) {
      return res.status(404).json({ message: 'Proveedor no encontrado' });
    }
    res.status(200).json(updatedProveedor);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar el proveedor' });
  }
};

// Eliminar un proveedor
export const deleteProveedor = async (req, res) => {
  try {
    const deletedProveedor = await Proveedor.findByIdAndDelete(req.params.proveedorId);
    if (!deletedProveedor) {
      return res.status(404).json({ message: 'Proveedor no encontrado' });
    }
    res.status(200).json({ message: 'Proveedor eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el proveedor' });
  }
};