import Empleado from "../models/Empleado";

// Obtener todos los empleados
export const getEmpleados = async (req, res) => {
  try {
    const empleados = await Empleado.find();
    res.status(200).json(empleados);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los empleados' });
  }
};

// Crear un nuevo empleado
export const createEmpleado = async (req, res) => {
  try {
    const newEmpleado = new Empleado(req.body);
    const savedEmpleado = await newEmpleado.save();
    res.status(201).json(savedEmpleado);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear el empleado' });
  }
};

// Obtener un empleado por ID
export const getEmpleadoById = async (req, res) => {
  try {
    const empleado = await Empleado.findById(req.params.empleadoId);
    if (!empleado) {
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }
    res.status(200).json(empleado);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el empleado' });
  }
};

// Actualizar un empleado
export const updateEmpleado = async (req, res) => {
  try {
    const updatedEmpleado = await Empleado.findByIdAndUpdate(
      req.params.empleadoId,
      req.body,
      { new: true }
    );
    if (!updatedEmpleado) {
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }
    res.status(200).json(updatedEmpleado);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar el empleado' });
  }
};

// Eliminar un empleado
export const deleteEmpleado = async (req, res) => {
  try {
    const deletedEmpleado = await Empleado.findByIdAndDelete(req.params.empleadoId);
    if (!deletedEmpleado) {
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }
    res.status(200).json({ message: 'Empleado eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el empleado' });
  }
};