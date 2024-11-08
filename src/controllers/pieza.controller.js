import Pieza from "../models/pieza";

// Obtener todas las piezas
export const getPiezas = async (req, res) => {
  try {
    const piezas = await Pieza.find();
    res.status(200).json(piezas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las piezas' });
  }
};

// Obtener una pieza por ID
export const getPiezaById = async (req, res) => {
  try {
    const pieza = await Pieza.findById(req.params.piezaId);
    if (!pieza) {
      return res.status(404).json({ message: 'Pieza no encontrada' });
    }
    res.status(200).json(pieza);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la pieza' });
  }
};

// Crear una nueva pieza
export const createPieza = async (req, res) => {
  try {
    const nuevaPieza = new Pieza(req.body);
    const savedPieza = await nuevaPieza.save();
    res.status(201).json(savedPieza);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear la pieza' });
  }
};

// Actualizar una pieza existente
export const updatePieza = async (req, res) => {
  try {
    const updatedPieza = await Pieza.findByIdAndUpdate(req.params.piezaId, req.body, { new: true });
    if (!updatedPieza) {
      return res.status(404).json({ message: 'Pieza no encontrada' });
    }
    res.status(200).json(updatedPieza);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar la pieza' });
  }
};

// Eliminar una pieza
export const deletePieza = async (req, res) => {
  try {
    const deletedPieza = await Pieza.findByIdAndDelete(req.params.piezaId);
    if (!deletedPieza) {
      return res.status(404).json({ message: 'Pieza no encontrada' });
    }
    res.status(200).json({ message: 'Pieza eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la pieza' });
  }
};


/* // Actualizar el stock de piezas o materiales
export const actualizarStock = async (req, res) => {
  try {
    const { tipo, referenciaId, cantidad } = req.body;  // referenciaId puede ser piezaId o materialId

    let stock;
    if (tipo === 'Pieza') {
      stock = await stock.findOneAndUpdate(
        { pieza: referenciaId, tipo: 'Pieza' },
        { cantidad },
        { new: true, upsert: true }
      );
    } else if (tipo === 'Material') {
      stock = await stock.findOneAndUpdate(
        { material: referenciaId, tipo: 'Material' },
        { cantidad },
        { new: true, upsert: true }
      );
    }
  }
}; */