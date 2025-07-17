import mongoose from 'mongoose';

const usuarioSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
  },
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  direccion: { type: String },
  tipoUsuario: { type: String, enum: ['cliente', 'administrador'], default: 'cliente' },
  telefono: { type: String },
  rut: { type: String },
  passwordHash: { type: String, required: true },
  creadoEn: { type: Date, default: Date.now }
});

export default mongoose.model('Usuario', usuarioSchema);
