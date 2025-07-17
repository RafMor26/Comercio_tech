import Producto from '../models/Producto.js';

// Obtener todos los productos
export const obtenerProductos = async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los productos', error });
  }
};

// Crear un nuevo producto con ID incremental
export const crearProducto = async (req, res) => {
  try {
    const ultimo = await Producto.findOne().sort({ id: -1 });
    const nuevoId = ultimo ? ultimo.id + 1 : 2001;

    const nuevoProducto = new Producto({
      ...req.body,
      id: nuevoId,
      creadoEn: new Date(),
    });

    const guardado = await nuevoProducto.save();
    res.json(guardado);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear producto', error });
  }
};

// Editar producto
export const actualizarProducto = async (req, res) => {
  try {
    const producto = await Producto.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.json(producto);
  } catch {
    res.status(404).json({ mensaje: 'Producto no encontrado' });
  }
};

// Eliminar producto
export const eliminarProducto = async (req, res) => {
  try {
    await Producto.findOneAndDelete({ id: req.params.id });
    res.json({ mensaje: 'Producto eliminado' });
  } catch {
    res.status(404).json({ mensaje: 'Producto no encontrado' });
  }
};
