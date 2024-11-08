import { Schema, model } from "mongoose";

const productoSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  piezas: [{
    pieza: {
      type: Schema.Types.ObjectId,
      ref: "Pieza",
      required: true
    },
    cantidad: {
      type: Number,
      required: true,
      min: 0
    }
  }]
}, {
  timestamps: true,
  versionKey: false
});

export default model('Producto', productoSchema);