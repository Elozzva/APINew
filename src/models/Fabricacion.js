import { Schema, model } from "mongoose";

const fabricacionSchema = new Schema({
  tipo: { 
    type: String, 
    enum: ['interna', 'externa'],
    default: 'interna'
  },
  estado: { 
    type: String, 
    enum: ['pendiente', 'en progreso', 'completada', 'cancelada'], 
    default: 'pendiente' 
  },
  material: { 
    type: Schema.Types.ObjectId, 
    ref: 'Material', 
    required: true 
  },
  receta: { 
    type: Schema.Types.ObjectId, 
    ref: 'Receta',  // Asegúrate de que "Receta" sea el modelo correcto en tu aplicación
    required: true 
  },
  cantidad: { 
    type: Number, 
    required: true 
  },
  empleado: { 
    type: Schema.Types.ObjectId, 
    ref: 'Empleado'
  },
  proveedor: { 
    type: Schema.Types.ObjectId, 
    ref: 'Proveedor'
  },
  fechaEntrega: { 
    type: Date, 
    required: true 
  }
});

fabricacionSchema.virtual('piezasMinimas').get(function(receta){
  console.log('dato virtual', receta);
  return receta.pieza.stockMinimo;
  });

export default model('Fabricacion', fabricacionSchema);
