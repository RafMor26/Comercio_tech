import Usuario from '../models/Usuario.js'; // 👈 asegúrate de que esta línea esté
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
  const { email, password } = req.body;
  console.log("👉 Recibido login:", email, password); // 👈 Nuevo

  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      console.log("❌ Usuario no encontrado");
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    console.log("✅ Usuario encontrado:", usuario.email);

    const passwordValida = await bcrypt.compare(password, usuario.passwordHash);
    if (!passwordValida) {
      console.log("❌ Contraseña incorrecta");
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: usuario.id, tipoUsuario: usuario.tipoUsuario },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    console.log("✅ Login exitoso");

    res.json({ token, nombre: usuario.nombre, tipoUsuario: usuario.tipoUsuario });
  } catch (error) {
    console.error("💥 Error en login:", error); // 👈 IMPORTANTE
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};
