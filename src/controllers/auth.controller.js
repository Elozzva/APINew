import User from "../models/User";
import jwt from 'jsonwebtoken';
import config from "../config";
import Role from "../models/Role";
import { json } from "express";

export const signIn = async (req, res) => {
    console.log(req.body);
    const userFound = await User.findOne({email: req.body.email}).populate("roles")

    if (!userFound) return res.status(404).json({message: 'Usuario no registrado'})

    const matchPass = await User.comparePass(req.body.password, userFound.password)

    if (!matchPass) return res.status(401).json({token:null, message: 'correo o contraseña incorrectos'})

    const token = jwt.sign({id: userFound._id}, config.SECRET,{
        expiresIn: 7200 // 2 hours
    })

    delete userFound.password;

    res.json({token, userFound})
}

export const signUp = async (req, res) => {
    const {name, lastname, email, password, roles} =req.body;
    console.log(req.body)

    const newUser = new User({
        name,
        lastname,
        email,
        password: await User.encryptPass(password)
    })

    if (roles) {
        const foundRoles = await Role.find({rol: {$in: roles}})
        newUser.roles = foundRoles.map( role => role._id)
    }else{
        const role = await Role.findOne({rol: "user"})
        newUser.roles = [role._id]
    }

    const savedUser = await newUser.save()
    if (!savedUser) {
        return res.status(500).json({message: "Error al registrar el usuario"})
    }
    console.log('user: ',savedUser);
    const token = jwt.sign({id: savedUser._id}, config.SECRET,{
        expiresIn: 7200 //2 horas
    })

    console.log( token )

    res.status(201).json( token )
}

export const userIdsByToken = async (req, res) => {
    try {
        const token = req.headers["x-access-token"]
        let idClient, idTecnico;

        if (!token) return res.status(403).json({message: "Token no proporcionado"})

        const decoded = jwt.verify(token, config.SECRET)
        req.userId = decoded.id;
        console.log('Id: ',decoded.id);

        const user = await User.findById(req.userId, {password: 0})

        if (!user) return res.status(404).json({message: "Usuario no encontrado"})
        
        return res.status(200).json({idUser: user._id})

    } catch (error) {
        console.log(error);
    }
}

export const isAdminByToken = async (req, res) => {
    try {
        const token = req.headers["x-access-token"]

        if (!token) return res.status(403).json({message: "Token no proporcionado"})
        
        const decoded = jwt.verify(token, config.SECRET)
        req.userId = decoded.id;

        const user = await User.findById(req.userId, {password: 0}).populate("roles")
        console.log('User: ',user);

        if (user.roles) {
            const isAdmin = user.roles.some(r => r.rol == 'admin')
            console.log('Es admin?: ',isAdmin);

            return res.status(200).json(isAdmin)
        } else {

            return res.status(200).json(false)
        }
    } catch (error) {
        return res.status(500).json({message: error})
    }
}