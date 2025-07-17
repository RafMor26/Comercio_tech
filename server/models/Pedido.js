import mongoose from 'mongoose';

const pedidoSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
    required: true,
  },
  idCliente: {
    type: Number,
    required: true,
  },
  productos: [
    {
      idProducto: Number,
      cantidad: Number,
      precioUnitario: Number,
    }
  ],
  total: {
    type: Number,
    required: true,
  },
  fechaPedido: {
    type: Date,
    default: Date.now,
  },
  estado: {
    type: String,
    enum: ['registrado', 'procesado', 'enviado', 'entregado'],
    default: 'registrado',
  },
});

const Pedido = mongoose.model('Pedido', pedidoSchema);

export default Pedido;
