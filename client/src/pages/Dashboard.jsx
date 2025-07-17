// ...importaciones
import { useEffect, useState } from "react";
import API from "../services/api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();

  const [vista, setVista] = useState("usuarios");

  // USUARIOS
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [formEdit, setFormEdit] = useState({});
  const [formNuevoUsuario, setFormNuevoUsuario] = useState(null);

  // PRODUCTOS
  const [productos, setProductos] = useState([]);
  const [formProducto, setFormProducto] = useState(null);

  // PEDIDOS
  const [pedidos, setPedidos] = useState([]);
  const [formPedido, setFormPedido] = useState(null);

  // Agrega estos estados para productos del pedido
  const [nuevoProducto, setNuevoProducto] = useState({
    idProducto: "",
    cantidad: "",
    precioUnitario: "",
  });
  const [productosPedido, setProductosPedido] = useState([]);

  useEffect(() => {
    if (!auth?.token) {
      navigate("/login");
      return;
    }
    cargarUsuarios();
    cargarProductos();
  }, [auth, navigate]);

  // ----- USUARIOS -----
  const cargarUsuarios = async () => {
    try {
      const res = await API.get("/usuarios");
      setUsuarios(res.data);
    } catch {
      Swal.fire("Error", "No se pudieron cargar los usuarios", "error");
    }
  };

  const eliminarUsuario = async (id) => {
    const confirmacion = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará al usuario permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirmacion.isConfirmed) {
      try {
        await API.delete(`/usuarios/${id}`);
        Swal.fire("Eliminado", "El usuario ha sido eliminado", "success");
        cargarUsuarios();
      } catch {
        Swal.fire("Error", "No se pudo eliminar el usuario", "error");
      }
    }
  };

  const abrirFormularioEdicion = (usuario) => {
    setUsuarioEditando(usuario.id);
    setFormEdit(usuario);
  };

  const handleChange = (e) => {
    setFormEdit({ ...formEdit, [e.target.name]: e.target.value });
  };

  const guardarCambios = async () => {
    try {
      await API.put(`/usuarios/${usuarioEditando}`, formEdit);
      Swal.fire(
        "Actualizado",
        "El usuario fue editado correctamente",
        "success"
      );
      setUsuarioEditando(null);
      cargarUsuarios();
    } catch {
      Swal.fire("Error", "No se pudo actualizar el usuario", "error");
    }
  };

  const handleChangeNuevoUsuario = (e) => {
    setFormNuevoUsuario({ ...formNuevoUsuario, [e.target.name]: e.target.value });
  };

  const guardarNuevoUsuario = async () => {
    try {
      await API.post("/usuarios", formNuevoUsuario);
      Swal.fire("Creado", "Usuario registrado", "success");
      setFormNuevoUsuario(null);
      cargarUsuarios();
    } catch {
      Swal.fire("Error", "No se pudo crear el usuario", "error");
    }
  };

  // ----- PRODUCTOS (nuevo) -----
  const cargarProductos = async () => {
    try {
      const res = await API.get("/productos");
      setProductos(res.data);
    } catch {
      Swal.fire("Error", "No se pudieron cargar los productos", "error");
    }
  };

  const handleChangeProducto = (e) => {
    setFormProducto({ ...formProducto, [e.target.name]: e.target.value });
  };

  const guardarProducto = async () => {
    try {
      if (formProducto.id) {
        await API.put(`/productos/${formProducto.id}`, formProducto);
        Swal.fire("Editado", "Producto actualizado", "success");
      } else {
        await API.post("/productos", formProducto);
        Swal.fire("Creado", "Producto registrado", "success");
      }
      setFormProducto(null);
      cargarProductos();
    } catch {
      Swal.fire("Error", "No se pudo guardar el producto", "error");
    }
  };

  const editarProducto = (producto) => {
    setFormProducto(producto);
  };

  const eliminarProducto = async (id) => {
    const confirmacion = await Swal.fire({
      title: "¿Eliminar producto?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirmacion.isConfirmed) {
      try {
        await API.delete(`/productos/${id}`);
        Swal.fire("Eliminado", "Producto eliminado", "success");
        cargarProductos();
      } catch {
        Swal.fire("Error", "No se pudo eliminar", "error");
      }
    }
  };

  // ----- PEDIDOS -----
  const cargarPedidos = async () => {
    try {
      const res = await API.get("/pedidos");
      setPedidos(res.data);
    } catch {
      Swal.fire("Error", "No se pudieron cargar los pedidos", "error");
    }
  };

  // Función para agregar producto al pedido
  const agregarProductoAlPedido = () => {
    if (
      nuevoProducto.idProducto &&
      nuevoProducto.cantidad &&
      nuevoProducto.precioUnitario
    ) {
      setProductosPedido([...productosPedido, nuevoProducto]);
      setNuevoProducto({ idProducto: "", cantidad: "", precioUnitario: "" });
    }
  };

  const guardarPedido = async () => {
    try {
      const pedido = {
        ...formPedido,
        productos: productosPedido,
        total: parseInt(formPedido.total),
      };
      if (formPedido.id) {
        await API.put(`/pedidos/${formPedido.id}`, pedido);
        Swal.fire("Editado", "Pedido actualizado", "success");
      } else {
        await API.post("/pedidos", pedido);
        Swal.fire("Creado", "Pedido registrado", "success");
      }
      setFormPedido(null);
      setProductosPedido([]);
      cargarPedidos();
    } catch {
      Swal.fire("Error", "No se pudo guardar el pedido", "error");
    }
  };

  // Cuando abras el modal para editar, carga los productos
  const editarPedido = (pedido) => {
    setFormPedido({
      ...pedido,
      total: pedido.total,
      estado: pedido.estado,
      idCliente: pedido.idCliente,
    });
    setProductosPedido(pedido.productos || []);
  };

  const eliminarPedido = async (id) => {
    const confirmacion = await Swal.fire({
      title: "¿Eliminar pedido?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirmacion.isConfirmed) {
      try {
        await API.delete(`/pedidos/${id}`);
        Swal.fire("Eliminado", "Pedido eliminado", "success");
        cargarPedidos();
      } catch {
        Swal.fire("Error", "No se pudo eliminar", "error");
      }
    }
  };

  // Cuando entres a la vista productos, carga los datos
  useEffect(() => {
    if (vista === "productos") {
      cargarProductos();
    }
    if (vista === "pedidos") cargarPedidos();
  }, [vista]);

  return (
    <div
      className="min-vh-100 d-flex justify-content-center align-items-center"
      style={{ background: "#e6e7e5" }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          className="shadow-lg rounded-4 p-5"
          style={{
            background: "#fff",
            minWidth: 350,
            maxWidth: 900,
            width: "100%",
            border: "1px solid #d3d5d1",
            margin: "0 auto",
            boxSizing: "border-box",
          }}
        >
          <h1
            className="mb-4 text-center fw-bold"
            style={{ color: "#6c7a5c", fontSize: "2.2rem" }}
          >
            Bienvenido, {auth?.nombre || "Usuario"}
          </h1>

          <nav className="mb-4 d-flex justify-content-center gap-3">
            <button
              className={`btn px-4 py-2 rounded-pill fw-semibold ${
                vista === "usuarios"
                  ? "btn-success"
                  : "btn-outline-success"
              }`}
              style={{
                background: vista === "usuarios" ? "#b7c7a3" : "",
                borderColor: "#b7c7a3",
                color: "#6c7a5c",
              }}
              onClick={() => setVista("usuarios")}
            >
              👥 Usuarios
            </button>
            <button
              className={`btn px-4 py-2 rounded-pill fw-semibold ${
                vista === "productos"
                  ? "btn-success"
                  : "btn-outline-success"
              }`}
              style={{
                background: vista === "productos" ? "#b7c7a3" : "",
                borderColor: "#b7c7a3",
                color: "#6c7a5c",
              }}
              onClick={() => setVista("productos")}
            >
              🛒 Productos
            </button>
            <button
              className={`btn px-4 py-2 rounded-pill fw-semibold ${
                vista === "pedidos"
                  ? "btn-success"
                  : "btn-outline-success"
              }`}
              style={{
                background: vista === "pedidos" ? "#b7c7a3" : "",
                borderColor: "#b7c7a3",
                color: "#6c7a5c",
              }}
              onClick={() => setVista("pedidos")}
            >
              📦 Pedidos
            </button>
          </nav>

          {/* USUARIOS */}
          {vista === "usuarios" && (
            <>
              <h2 className="mb-3 text-center" style={{ color: "#6c7a5c" }}>
                Panel de Usuarios
              </h2>
              <button
                className="btn btn-success mb-3 rounded-pill px-4"
                style={{
                  background: "#b7c7a3",
                  color: "#6c7a5c",
                  border: "none",
                }}
                onClick={() =>
                  setFormNuevoUsuario({
                    nombre: "",
                    email: "",
                    password: "",
                    tipoUsuario: "cliente",
                    rut: "",
                    direccion: "",
                    telefono: "",
                  })
                }
              >
                + Nuevo Usuario
              </button>
              <div className="table-responsive">
                <table
                  className="table align-middle"
                  style={{
                    background: "#f8faf7",
                    borderRadius: "12px",
                  }}
                >
                  <thead style={{ background: "#e6e7e5" }}>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Tipo</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((u) => (
                      <tr key={u.id}>
                        <td>{u.id}</td>
                        <td>{u.nombre}</td>
                        <td>{u.email}</td>
                        <td>{u.tipoUsuario}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-success me-1 rounded-pill"
                            onClick={() => abrirFormularioEdicion(u)}
                          >
                            Editar
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger me-1 rounded-pill"
                            onClick={() => eliminarUsuario(u.id)}
                          >
                            Eliminar
                          </button>
                          <button
                            className="btn btn-sm btn-outline-secondary rounded-pill"
                            onClick={() => navigate(`/usuario/${u.id}`)}
                          >
                            Ver Perfil
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Modal Nuevo Usuario */}
              {formNuevoUsuario && (
                <div style={modalStyle}>
                  <h4 className="mb-3" style={{ color: "#6c7a5c" }}>Nuevo Usuario</h4>
                  <input
                    className="form-control mb-2"
                    name="nombre"
                    value={formNuevoUsuario.nombre}
                    onChange={handleChangeNuevoUsuario}
                    placeholder="Nombre"
                  />
                  <input
                    className="form-control mb-2"
                    name="email"
                    type="email"
                    value={formNuevoUsuario.email}
                    onChange={handleChangeNuevoUsuario}
                    placeholder="Email"
                  />
                  <input
                    className="form-control mb-2"
                    name="password"
                    type="password"
                    value={formNuevoUsuario.password}
                    onChange={handleChangeNuevoUsuario}
                    placeholder="Contraseña"
                  />
                  <input
                    className="form-control mb-2"
                    name="rut"
                    value={formNuevoUsuario.rut}
                    onChange={handleChangeNuevoUsuario}
                    placeholder="RUT"
                  />
                  <input
                    className="form-control mb-2"
                    name="direccion"
                    value={formNuevoUsuario.direccion}
                    onChange={handleChangeNuevoUsuario}
                    placeholder="Dirección"
                  />
                  <input
                    className="form-control mb-2"
                    name="telefono"
                    value={formNuevoUsuario.telefono}
                    onChange={handleChangeNuevoUsuario}
                    placeholder="Teléfono"
                  />
                  <select
                    className="form-control mb-2"
                    name="tipoUsuario"
                    value={formNuevoUsuario.tipoUsuario}
                    onChange={handleChangeNuevoUsuario}
                  >
                    <option value="Cliente">Cliente</option>
                    <option value="Administrador">Administrador</option>
                  </select>
                  <div className="d-flex justify-content-end gap-2">
                    <button className="btn btn-success rounded-pill px-4" onClick={guardarNuevoUsuario}>Guardar</button>
                    <button className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setFormNuevoUsuario(null)}>Cancelar</button>
                  </div>
                </div>
              )}
              {/* Modal Edición Usuario */}
              {usuarioEditando && (
                <div style={modalStyle}>
                  <h4 className="mb-3" style={{ color: "#6c7a5c" }}>
                    Editar Usuario
                  </h4>
                  <input
                    className="form-control mb-2"
                    name="nombre"
                    value={formEdit.nombre}
                    onChange={handleChange}
                    placeholder="Nombre"
                  />
                  <input
                    className="form-control mb-2"
                    name="email"
                    value={formEdit.email}
                    onChange={handleChange}
                    placeholder="Email"
                  />
                  <select
                    className="form-control mb-2"
                    name="tipoUsuario"
                    value={formEdit.tipoUsuario}
                    onChange={handleChange}
                  >
                    <option value="Administrador">Administrador</option>
                    <option value="cliente">Cliente</option>
                  </select>
                  <div className="d-flex justify-content-end gap-2">
                    <button
                      className="btn btn-success rounded-pill px-4"
                      onClick={guardarCambios}
                    >
                      Guardar
                    </button>
                    <button
                      className="btn btn-outline-secondary rounded-pill px-4"
                      onClick={() => setUsuarioEditando(null)}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* PRODUCTOS */}
          {vista === "productos" && (
            <div>
              <h2 className="mb-3 text-center" style={{ color: "#6c7a5c" }}>
                Panel de Productos
              </h2>
              <button
                className="btn btn-success mb-3 rounded-pill px-4"
                style={{
                  background: "#b7c7a3",
                  color: "#6c7a5c",
                  border: "none",
                }}
                onClick={() =>
                  setFormProducto({
                    nombre: "",
                    categoria: "",
                    precio: "",
                    stock: "",
                  })
                }
              >
                + Nuevo Producto
              </button>
              <div className="table-responsive">
                <table
                  className="table align-middle"
                  style={{
                    background: "#f8faf7",
                    borderRadius: "12px",
                  }}
                >
                  <thead style={{ background: "#e6e7e5" }}>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Categoría</th>
                      <th>Precio</th>
                      <th>Stock</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productos.map((p) => (
                      <tr key={p.id}>
                        <td>{p.id}</td>
                        <td>{p.nombre}</td>
                        <td>{p.categoria}</td>
                        <td>${p.precio}</td>
                        <td>{p.stock}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-success me-1 rounded-pill"
                            onClick={() => editarProducto(p)}
                          >
                            Editar
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger rounded-pill"
                            onClick={() => eliminarProducto(p.id)}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Modal Producto */}
              {formProducto && (
                <div style={modalStyle}>
                  <h4 className="mb-3" style={{ color: "#6c7a5c" }}>
                    {formProducto.id ? "Editar" : "Nuevo"} Producto
                  </h4>
                  <input
                    className="form-control mb-2"
                    name="nombre"
                    value={formProducto.nombre}
                    onChange={handleChangeProducto}
                    placeholder="Nombre del producto"
                  />
                  <input
                    className="form-control mb-2"
                    name="categoria"
                    value={formProducto.categoria}
                    onChange={handleChangeProducto}
                    placeholder="Categoría"
                  />
                  <input
                    className="form-control mb-2"
                    name="precio"
                    type="number"
                    value={formProducto.precio}
                    onChange={handleChangeProducto}
                    placeholder="Precio"
                  />
                  <input
                    className="form-control mb-2"
                    name="stock"
                    type="number"
                    value={formProducto.stock}
                    onChange={handleChangeProducto}
                    placeholder="Stock"
                  />
                  <div className="d-flex justify-content-end gap-2">
                    <button
                      className="btn btn-success rounded-pill px-4"
                      onClick={guardarProducto}
                    >
                      Guardar
                    </button>
                    <button
                      className="btn btn-outline-secondary rounded-pill px-4"
                      onClick={() => setFormProducto(null)}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PEDIDOS */}
          {vista === "pedidos" && (
            <div>
              <h2 className="mb-3 text-center" style={{ color: "#6c7a5c" }}>
                Panel de Pedidos
              </h2>
              <button
                className="btn btn-success mb-3 rounded-pill px-4"
                style={{
                  background: "#b7c7a3",
                  color: "#6c7a5c",
                  border: "none",
                }}
                onClick={() => {
                  setFormPedido({
                    idCliente: "",
                    productos: "",
                    total: "",
                    estado: "registrado",
                  });
                  setProductosPedido([]); // <-- Reinicia la lista de productos
                  setNuevoProducto({ idProducto: "", cantidad: "", precioUnitario: "" }); // Opcional: reinicia el producto temporal
                }}
              >
                + Nuevo Pedido
              </button>
              <div className="table-responsive">
                <table
                  className="table align-middle"
                  style={{
                    background: "#f8faf7",
                    borderRadius: "12px",
                  }}
                >
                  <thead style={{ background: "#e6e7e5" }}>
                    <tr>
                      <th>ID</th>
                      <th>Cliente</th>
                      <th>Productos</th>
                      <th>Total</th>
                      <th>Fecha</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedidos.map((p) => (
                      <tr key={p.id}>
                        <td>{p.id}</td>
                        <td>{p.idCliente}</td>
                        <td>
                          {p.productos.map((prod, i) => (
                            <div key={i}>
                              idProducto: {prod.idProducto}| Cantidad: {prod.cantidad}| Precio.Unitario{" "}
                              {prod.precioUnitario}
                            </div>
                          ))}
                        </td>
                        <td>${p.total}</td>
                        <td>{new Date(p.fechaPedido).toLocaleString()}</td>
                        <td>{p.estado}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-success me-1 rounded-pill"
                            onClick={() => editarPedido(p)}
                          >
                            Editar
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger rounded-pill"
                            onClick={() => eliminarPedido(p.id)}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Modal Pedido */}
              {formPedido && (
                <div style={modalStyle}>
                  <h4 className="mb-3" style={{ color: "#6c7a5c" }}>
                    {formPedido.id ? "Editar" : "Nuevo"} Pedido
                  </h4>
                  <input
                    className="form-control mb-2"
                    name="idCliente"
                    value={formPedido.idCliente}
                    onChange={(e) =>
                      setFormPedido({ ...formPedido, idCliente: e.target.value })
                    }
                    placeholder="ID Cliente"
                  />
                  <div className="mb-2">
                    <label
                      className="fw-semibold mb-1"
                      style={{ color: "#6c7a5c" }}
                    >
                      Agregar Producto
                    </label>
                    <div className="d-flex gap-2 mb-2">
                      <input
                        className="form-control"
                        placeholder="ID Producto"
                        value={nuevoProducto.idProducto}
                        onChange={(e) =>
                          setNuevoProducto({
                            ...nuevoProducto,
                            idProducto: e.target.value,
                          })
                        }
                        style={{ background: "#f8faf7", color: "#6c7a5c" }}
                      />
                      <input
                        className="form-control"
                        placeholder="Cantidad"
                        type="number"
                        value={nuevoProducto.cantidad}
                        onChange={(e) =>
                          setNuevoProducto({
                            ...nuevoProducto,
                            cantidad: e.target.value,
                          })
                        }
                        style={{ background: "#f8faf7", color: "#6c7a5c" }}
                      />
                      <input
                        className="form-control"
                        placeholder="Precio Unitario"
                        type="number"
                        value={nuevoProducto.precioUnitario}
                        onChange={(e) =>
                          setNuevoProducto({
                            ...nuevoProducto,
                            precioUnitario: e.target.value,
                          })
                        }
                        style={{ background: "#f8faf7", color: "#6c7a5c" }}
                      />
                      <button
                        type="button"
                        className="btn btn-success rounded-pill"
                        onClick={agregarProductoAlPedido}
                      >
                        +
                      </button>
                    </div>
                    {/* Lista de productos agregados */}
                    {productosPedido.length > 0 && (
                      <ul className="list-group mb-2">
                        {productosPedido.map((prod, idx) => (
                          <li
                            key={idx}
                            className="list-group-item d-flex justify-content-between align-items-center"
                            style={{
                              background: "#f8faf7",
                              color: "#6c7a5c",
                            }}
                          >
                            <span>
                              <strong>ID:</strong> {prod.idProducto} |{" "}
                              <strong>Cantidad:</strong> {prod.cantidad} |{" "}
                              <strong>Precio:</strong> ${prod.precioUnitario}
                            </span>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger rounded-pill"
                              onClick={() =>
                                setProductosPedido(
                                  productosPedido.filter((_, i) => i !== idx)
                                )
                              }
                            >
                              Quitar
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <input
                    className="form-control mb-2"
                    name="total"
                    type="number"
                    value={formPedido.total}
                    onChange={(e) =>
                      setFormPedido({ ...formPedido, total: e.target.value })
                    }
                    placeholder="Total"
                  />
                  <select
                    className="form-control mb-2"
                    name="estado"
                    value={formPedido.estado}
                    onChange={(e) =>
                      setFormPedido({ ...formPedido, estado: e.target.value })
                    }
                  >
                    <option value="registrado">registrado</option>
                    <option value="procesado">procesado</option>
                    <option value="enviado">enviado</option>
                    <option value="entregado">entregado</option>
                  </select>
                  <div className="d-flex justify-content-end gap-2">
                    <button
                      className="btn btn-success rounded-pill px-4"
                      onClick={guardarPedido}
                    >
                      Guardar
                    </button>
                    <button
                      className="btn btn-outline-secondary rounded-pill px-4"
                      onClick={() => {
                        setFormPedido(null);
                        setProductosPedido([]);
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const modalStyle = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  background: "#fff",
  color: "#6c7a5c",
  padding: "32px",
  borderRadius: "18px",
  boxShadow: "0 2px 24px rgba(108,122,92,0.15)",
  minWidth: "340px",
  zIndex: 2000,
  border: "1px solid #d3d5d1",
};

export default Dashboard;
