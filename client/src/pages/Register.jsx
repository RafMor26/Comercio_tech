import { useState } from 'react';
import API from '../services/api';

const Register = () => {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
    tipoUsuario: 'cliente',
    rut: '',
    direccion: '',
    telefono: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/usuarios', form);
      alert('Usuario creado con éxito');
    } catch (error) {
      alert('Error: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ background: "#e6e7e5" }}>
      <form
        onSubmit={handleSubmit}
        className="p-5 rounded-4 shadow-lg"
        style={{
          background: "#fff",
          minWidth: 350,
          maxWidth: 400,
          width: "100%",
          border: "1px solid #d3d5d1",
          color: "#6c7a5c",
        }}
      >
        <h2 className="mb-4 text-center fw-bold" style={{ color: "#6c7a5c" }}>
          Registro
        </h2>
        <div className="mb-3">
          <input
            name="nombre"
            className="form-control"
            placeholder="Nombre"
            onChange={handleChange}
            required
            style={{
              background: "#f8faf7",
              color: "#6c7a5c",
              border: "1px solid #d3d5d1",
              borderRadius: "12px",
            }}
          />
        </div>
        <div className="mb-3">
          <input
            name="email"
            type="email"
            className="form-control"
            placeholder="Email"
            onChange={handleChange}
            required
            style={{
              background: "#f8faf7",
              color: "#6c7a5c",
              border: "1px solid #d3d5d1",
              borderRadius: "12px",
            }}
          />
        </div>
        <div className="mb-3">
          <input
            name="password"
            type="password"
            className="form-control"
            placeholder="Contraseña"
            onChange={handleChange}
            required
            style={{
              background: "#f8faf7",
              color: "#6c7a5c",
              border: "1px solid #d3d5d1",
              borderRadius: "12px",
            }}
          />
        </div>
        <div className="mb-3">
          <input
            name="rut"
            className="form-control"
            placeholder="RUT"
            onChange={handleChange}
            required
            style={{
              background: "#f8faf7",
              color: "#6c7a5c",
              border: "1px solid #d3d5d1",
              borderRadius: "12px",
            }}
          />
        </div>
        <div className="mb-3">
          <input
            name="direccion"
            className="form-control"
            placeholder="Dirección"
            onChange={handleChange}
            required
            style={{
              background: "#f8faf7",
              color: "#6c7a5c",
              border: "1px solid #d3d5d1",
              borderRadius: "12px",
            }}
          />
        </div>
        <div className="mb-3">
          <input
            name="telefono"
            className="form-control"
            placeholder="Teléfono"
            onChange={handleChange}
            required
            style={{
              background: "#f8faf7",
              color: "#6c7a5c",
              border: "1px solid #d3d5d1",
              borderRadius: "12px",
            }}
          />
        </div>
        <div className="mb-4">
          <select
            name="tipoUsuario"
            className="form-control"
            onChange={handleChange}
            required
            style={{
              background: "#f8faf7",
              color: "#6c7a5c",
              border: "1px solid #d3d5d1",
              borderRadius: "12px",
            }}
          >
            <option value="cliente">Cliente</option>
            <option value="administrador">Administrador</option>
          </select>
        </div>
        <button
          type="submit"
          className="btn btn-success rounded-pill fw-semibold w-100"
          style={{ background: "#b7c7a3", color: "#6c7a5c", border: "none" }}
        >
          Registrar
        </button>
      </form>
    </div>
  );
};

export default Register;
