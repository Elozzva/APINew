import { Schema, model } from "mongoose";

const recetaSchema = new Schema({
  material: {
    type: Schema.Types.ObjectId,
    ref: "Material",
    required: true
  },
  pieza: {
    type: Schema.Types.ObjectId,
    ref: "Pieza",
    required: true
  },
  piezasPorUnidad: {
    type: Number,
    required: true,
    min: 1
  },
  seFabrica: { 
    type: String, 
    enum: ['interna', 'externa'],  // Define si la pieza se fabrica internamente o externamente
    required: true 
  }
}, {
  timestamps: true,
  versionKey: false
});

export default model('Receta', recetaSchema);