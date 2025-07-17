import { useState } from "react";
import API from "../services/api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [credenciales, setCredenciales] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setCredenciales({ ...credenciales, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", credenciales);
      const { token, nombre, tipoUsuario } = res.data;
      login({ token, nombre, tipoUsuario });

      Swal.fire({
        title: `Bienvenido, ${nombre}`,
        text: "Autenticación exitosa",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      navigate("/dashboard");
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Credenciales incorrectas",
        icon: "error",
      });
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ background: "#e6e7e5" }}>
      <form
        onSubmit={handleLogin}
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
          Iniciar Sesión
        </h2>
        <div className="mb-3">
          <input
            name="email"
            type="email"
            className="form-control"
            placeholder="Email"
            value={credenciales.email}
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
          <input
            name="password"
            type="password"
            className="form-control"
            placeholder="Contraseña"
            value={credenciales.password}
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
        <div className="d-flex flex-column gap-2">
          <button type="submit" className="btn btn-success rounded-pill fw-semibold" style={{ background: "#b7c7a3", color: "#6c7a5c", border: "none" }}>
            Entrar
          </button>
          <button
            type="button"
            className="btn btn-outline-success rounded-pill fw-semibold"
            style={{ borderColor: "#b7c7a3", color: "#6c7a5c" }}
            onClick={() => navigate("/register")}
          >
            Registrar
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
