import { Schema, model } from "mongoose"

const materialSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    stockMinimo: {
      type: Number,
      required: true,  
      default: 10      
    },
    description:{
        type: String,
        required: false
    
    }
}
, {
    timestamps: true,
    versionKey: false
  }
)

export default model('Material', materialSchema);

