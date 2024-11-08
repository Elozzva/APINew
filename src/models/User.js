import { Schema, model } from "mongoose"
import bcrypt from 'bcryptjs'

const userSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    lastname:{
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    roles: [{
        ref:"Role",
        type: Schema.Types.ObjectId
    }]
},{
    timestamps: true,
    versionKey: false
}
);

userSchema.statics.encryptPass = async (password) => {
    const salt = await bcrypt.genSalt(11)
    console.log(salt);
    return await bcrypt.hash(password, salt)
}

userSchema.statics.comparePass = async (password, recivedPass) => {
    return await bcrypt.compare(password, recivedPass)
}

export default model('user', userSchema)