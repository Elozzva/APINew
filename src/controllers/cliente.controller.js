import Cliente from "../models/Cliente";

// Obtener todos los clientes
export const getClientes = async (req, res) => {
  try {
    const clientes = await Cliente.find();
    res.status(200).json(clientes);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los clientes' });
  }
};

// Crear un nuevo cliente
export const createCliente = async (req, res) => {
  try {
    const newCliente = new Cliente(req.body);
    const savedCliente = await newCliente.save();
    res.status(201).json(savedCliente);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear el cliente' });
  }
};

// Obtener un cliente por ID
export const getClienteById = async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.clienteId);
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    res.status(200).json(cliente);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el cliente' });
  }
};

// Actualizar un cliente
export const updateCliente = async (req, res) => {
  try {
    const updatedCliente = await Cliente.findByIdAndUpdate(
      req.params.clienteId,
      req.body,
      { new: true }
    );
    if (!updatedCliente) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    res.status(200).json(updatedCliente);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar el cliente' });
  }
};

// Eliminar un cliente
export const deleteCliente = async (req, res) => {
  try {
    const deletedCliente = await Cliente.findByIdAndDelete(req.params.clienteId);
    if (!deletedCliente) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    res.status(200).json({ message: 'Cliente eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el cliente' });
  }
};