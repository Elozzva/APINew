import { Schema, model } from "mongoose"

export const ROLES = ["user", "lead", "admin"]

const permissionSchema = new Schema({
    description: { type: String, required: true },
    slug: { type: String, require: true }
});

const rolSchema = new Schema({
    rol: { type: String, require: true },
    permissions: { type: [permissionSchema]}
},{
    versionKey: false
});

export default model('Role', rolSchema);