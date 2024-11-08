import { Schema, model } from 'mongoose';

const proveedorSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
  versionKey: false
});

export default model('Proveedor', proveedorSchema);