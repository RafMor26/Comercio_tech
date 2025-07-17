import express from 'express';
import {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  obtenerPerfil
} from '../controllers/usuarioController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { verifyToken } from '../middleware/verifyToken.js';
import Usuario from '../models/Usuario.js'; // ✅ necesario para validación directa

const router = express.Router();

// Rutas protegidas con authMiddleware
router.get('/', authMiddleware, obtenerUsuarios);
router.get('/perfil', authMiddleware, obtenerPerfil);
router.get('/:id', authMiddleware, obtenerUsuarioPorId);
router.put('/:id', authMiddleware, actualizarUsuario);
router.delete('/:id', authMiddleware, eliminarUsuario);

// Ruta pública modificada con validación de unicidad
router.post('/', async (req, res) => {
  try {
    const { id, email, rut } = req.body;

    const existeId = await Usuario.findOne({ id });
    const existeEmail = await Usuario.findOne({ email });
    const existeRut = await Usuario.findOne({ rut });

    if (existeId || existeEmail || existeRut) {
      return res.status(400).json({ mensaje: 'ID, Email o RUT ya existen' });
    }

    // si pasa la validación, continúa con la lógica del controlador
    return crearUsuario(req, res);
  } catch (error) {
    console.error('❌ Error al validar usuario:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
});

// Ejemplo de rutas protegidas con verifyToken (opcional)
router.get('/protegido/perfil', verifyToken, (req, res) => {
  res.json({ mensaje: 'Perfil accedido', usuario: req.user });
});

router.get('/protegido/usuarios', verifyToken, async (req, res) => {
  try {
    const usuarios = await obtenerUsuarios(req, res);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

export default router;
