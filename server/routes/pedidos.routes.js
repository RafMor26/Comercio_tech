import express from 'express';
import {
  obtenerPedidos,
  crearPedido,
  actualizarPedido,
  eliminarPedido
} from '../controllers/pedidoController.js';

import Producto from '../models/Producto.js'; // ✅ necesario para validar stock

const router = express.Router();

// Validación de stock y creación del pedido
router.post('/', async (req, res) => {
  try {
    for (const prod of req.body.productos) {
      const producto = await Producto.findOne({ id: prod.idProducto });
      if (!producto) {
        return res.status(404).json({ mensaje: `Producto con ID ${prod.idProducto} no encontrado` });
      }

      if (producto.stock < prod.cantidad) {
        return res.status(400).json({
          mensaje: `Stock insuficiente para producto ${producto.nombre}`
        });
      }
    }

    // Si pasa la validación, se ejecuta el controlador normal
    return crearPedido(req, res);

  } catch (error) {
    console.error("❌ Error al validar stock:", error);
    res.status(500).json({ mensaje: "Error al verificar stock" });
  }
});

router.get('/', obtenerPedidos);
router.put('/:id', actualizarPedido);
router.delete('/:id', eliminarPedido);

export default router;
