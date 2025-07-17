import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cors from 'cors';

import usuarioRoutes from './routes/usuarios.routes.js';
import authRoutes from './routes/auth.routes.js';
import productoRoutes from './routes/productos.routes.js';
import Producto from './models/Producto.js'; //  IMPORTANTE
import pedidoRoutes from './routes/pedidos.routes.js';
import Pedido from './models/Pedido.js'; //  IMPORTANTE

// Cargar variables de entorno
dotenv.config();

// Crear instancia de la app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/pedidos', pedidoRoutes);

// Puerto desde .env o 5000 por defecto
const PORT = process.env.PORT || 5000;

//  Función para insertar productos iniciales si la colección está vacía, no esta vacia pero no se porque no se cargan los producto sin esto 
const crearProductosIniciales = async () => {
  try {
    const existentes = await Producto.find();
    if (existentes.length === 0) {
      await Producto.insertMany([
        { id: 2003, nombre: "Producto A", categoria: "Comida", precio: 1000, stock: 10 },
        { id: 2004, nombre: "Producto B", categoria: "Bebida", precio: 1500, stock: 5 },
      ]);
      console.log("📦 Productos de prueba insertados");
    }
  } catch (error) {
    console.error("❌ Error al insertar productos iniciales:", error.message);
  }
};
const crearPedidosIniciales = async () => {
  try {
    const existentes = await Pedido.find();
    if (existentes.length === 0) {
      await Pedido.insertMany([
        {
          id: 3001,
          idCliente: 1001,
          productos: [{ idProducto: 2003, cantidad: 2, precioUnitario: 1000 }],
          total: 2000,
          fechaPedido: new Date(),
          estado: 'registrado'
        },
        {
          id: 3002,
          idCliente: 1002,
          productos: [{ idProducto: 2004, cantidad: 1, precioUnitario: 1500 }],
          total: 1500,
          fechaPedido: new Date(),
          estado: 'procesado'
        }
      ]);
      console.log("🧾 Pedidos de prueba insertados");
    }
  } catch (error) {
    console.error("❌ Error al insertar pedidos iniciales:", error.message);
  }
};
//  Conectar a MongoDB y luego insertar productos
connectDB().then(() => {
  crearProductosIniciales();   // ✅ Insertar productos si no existen
  crearPedidosIniciales();     // ✅ Insertar pedidos si no existen

  // Escuchar en todas las IPs disponibles (requerido en AWS)
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Servidor corriendo en el puerto ${PORT}`);
  });
});
