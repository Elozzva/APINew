import { Schema, model } from "mongoose";

const empleadoSchema = new Schema({
    nombre: { 
        type: String, 
        required: true 
    },
    apellido: { 
        type: String, 
        required: true 
    }
  }, {
    timestamps: true,
    versionKey: false
  
});

export default model('Empleado', empleadoSchema);