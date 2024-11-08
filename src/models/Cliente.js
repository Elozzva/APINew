import { Schema, model } from "mongoose";

const clienteSchema = new Schema({
    nombre: { 
        type: String, 
        required: true 
    },
    apellido: { 
        type: String, 
        required: false 
    }
  }, {
    timestamps: true,
    versionKey: false
  
});

export default model('Cliente', clienteSchema);