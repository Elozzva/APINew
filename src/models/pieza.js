import { Schema, model, models } from "mongoose";

const piezaSchema = new Schema({
  nombre: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    required: false
  },
  stockMinimo: {
    type: Number,
    required: true,  
    default: 10      
  }
}, {
  timestamps: true,
  versionKey: false
});

// Usa `models.Pieza` si ya está definido, de lo contrario, crea el modelo
const Pieza = models.Pieza || model('Pieza', piezaSchema);

export default Pieza;