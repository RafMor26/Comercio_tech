import Pedido from '../models/Pedido.js';

export const obtenerPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.find();
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los pedidos', error });
  }
};

export const crearPedido = async (req, res) => {
  try {
    const ultimo = await Pedido.findOne().sort({ id: -1 });
    const nuevoId = ultimo ? ultimo.id + 1 : 3001;

    const nuevoPedido = new Pedido({
      ...req.body,
      id: nuevoId,
      fechaPedido: new Date(),
    });

    const guardado = await nuevoPedido.save();
    res.json(guardado);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear el pedido', error });
  }
};

export const actualizarPedido = async (req, res) => {
  try {
    const pedido = await Pedido.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.json(pedido);
  } catch {
    res.status(404).json({ mensaje: 'Pedido no encontrado' });
  }
};

export const eliminarPedido = async (req, res) => {
  try {
    await Pedido.findOneAndDelete({ id: req.params.id });
    res.json({ mensaje: 'Pedido eliminado' });
  } catch {
    res.status(404).json({ mensaje: 'Pedido no encontrado' });
  }
};
