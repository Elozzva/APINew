import express from 'express';
import morgan from 'morgan';
import pkg from '../package.json';
import cors from 'cors';

//import * as materialController from "./controllers/material.controller";
import materialRoutes from './routes/material.routes';
import productoRoutes from './routes/producto.routes';
import piezaRoutes from './routes/pieza.routes';
import stockRoutes from './routes/stock.routes';
import ordenRoutes from './routes/orden.routes';
import recetaRoutes from "./routes/receta.routes";
import empleadoRoutes from "./routes/empleado.routes";
import proveedorRoutes from "./routes/proveedor.routes";
import clienteRoutes from "./routes/cliente.routes";
import fabricacionRoutes from "./routes/fabricacion.routes";


const app = express()

app.set('pkg', pkg)

app.use(cors({
    origin: 'http://localhost:4200',  // Cambia esto al dominio de tu frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }))
app.use(express.json())
app.use(morgan('dev'))

app.get('/', (req, res)=> {
    res.json({
        name: app.get('pkg').name,
        description: app.get('pkg').description,
        version: app.get('pkg').version,
        author: app.get('pkg').author,
    })
})

app.use('/api/materials', materialRoutes)
app.use('/api/productos', productoRoutes)
app.use('/api/pieza', piezaRoutes)
app.use('/api/stocks', stockRoutes)
app.use('/api/ordenes', ordenRoutes)
app.use('/api/recetas', recetaRoutes)
app.use('/api/empleados', empleadoRoutes)
app.use('/api/proveedores', proveedorRoutes)
app.use('/api/clientes', clienteRoutes)
app.use('/api/fabricaciones',fabricacionRoutes)


export default app; 