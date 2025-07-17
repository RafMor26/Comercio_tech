import Usuario from '../models/Usuario.js';
import bcrypt from 'bcrypt';

// Obtener todos
export const obtenerUsuarios = async (req, res) => {
  const usuarios = await Usuario.find();
  res.json(usuarios);
};

// Obtener uno
export const obtenerUsuarioPorId = async (req, res) => {
  const usuario = await Usuario.findOne({ id: req.params.id });
  if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
  res.json(usuario);
};

// Crear usuario (con ID incremental y validación de email)
export const crearUsuario = async (req, res) => {
  try {
    const { nombre, email, password, tipoUsuario, direccion, rut, telefono } = req.body;

    if (!email || !password) return res.status(400).json({ error: 'Email y contraseña requeridos' });

    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) return res.status(400).json({ error: 'El email ya está registrado' });

    const ultimoUsuario = await Usuario.findOne().sort({ id: -1 });
    const nuevoId = ultimoUsuario ? ultimoUsuario.id + 1 : 1001;

    const passwordHash = await bcrypt.hash(password, 12);

    const nuevoUsuario = new Usuario({
      id: nuevoId,
      nombre,
      email,
      passwordHash,
      tipoUsuario,
      direccion,
      rut,
      telefono,
      creadoEn: new Date(),
    });

    await nuevoUsuario.save();
    res.status(201).json({ mensaje: 'Usuario creado con éxito' });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};

// Actualizar
export const actualizarUsuario = async (req, res) => {
  const actualizado = await Usuario.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
  res.json(actualizado);
};

// Eliminar
export const eliminarUsuario = async (req, res) => {
  await Usuario.findOneAndDelete({ id: req.params.id });
  res.json({ mensaje: 'Usuario eliminado' });
};

// Obtener perfil
export const obtenerPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findOne({ id: req.usuario.id }).select('-passwordHash -__v -_id');
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el perfil' });
  }
};
