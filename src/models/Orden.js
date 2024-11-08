import { Schema, model } from "mongoose";

const ordenSchema = new Schema({
  productos: [{
    producto: {
      type: Schema.Types.ObjectId,
      ref: "Producto",  // Relacionamos la orden con el catálogo de productos
      required: true
    },
    cantidad: {
      type: Number,
      required: true,
      min: 1
    }
  }],
  empleado: {
    type: Schema.Types.ObjectId,
    ref: "Empleado",  // Relacionamos la orden con el empleado encargado
    required: true
  },
  estado: {
    type: String,
    enum: ['pendiente', 'en progreso', 'completada', 'cancelada'],
    default: 'pendiente'
  },
  fechaOrden: {
    type: Date,
    default: Date.now
  },
  fechaEntrega: {
    type: Date,
    required: true
  }
}, {
  timestamps: true,
  versionKey: false
});


export default model('Orden', ordenSchema);