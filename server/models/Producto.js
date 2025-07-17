import mongoose from 'mongoose';

const productoSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
    required: true,
  },
  nombre: {
    type: String,
    required: true,
  },
  categoria: {
    type: String,
    required: true,
  },
  precio: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  creadoEn: {
    type: Date,
    default: Date.now,
  },
});

const Producto = mongoose.model('Producto', productoSchema);

export default Producto;
