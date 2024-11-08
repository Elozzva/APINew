import { Schema, model } from "mongoose";

const stockSchema = new Schema({
  material: { 
    type: Schema.Types.ObjectId, 
    ref: 'Material' 
  },
  pieza: { 
    type: Schema.Types.ObjectId, 
    ref: 'Pieza' 
  },  
  receta: { 
    type: Schema.Types.ObjectId, 
    ref: 'Receta' 
  }, 
  producto: {  
    type: Schema.Types.ObjectId, 
    ref: 'Producto'  
  },
  cantidad: { 
    type: Number, 
    required: true 
  },
  tipo: { 
    type: String, 
    enum: ['Material', 'Pieza', 'Receta', 'Producto Terminado'], 
    required: true 
  },  
  fechaActualizacion: { 
    type: Date, 
    default: Date.now 
  }
});

export default model('Stock', stockSchema);