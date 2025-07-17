import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import API from '../services/api';
import Swal from 'sweetalert2';

const UsuarioDetalle = () => {
  const { id } = useParams();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const res = await API.get(`/usuarios/${id}`);
        setUsuario(res.data);
      } catch (err) {
        Swal.fire('Error', 'No se pudo cargar el usuario', 'error');
      }
    };

    fetchUsuario();
  }, [id]);

  if (!usuario) return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ background: "#e6e7e5" }}>
      <div className="p-5 rounded-4 shadow-lg" style={{ background: "#fff", minWidth: 350, maxWidth: 400, width: "100%", border: "1px solid #d3d5d1", color: "#6c7a5c" }}>
        <p className="text-center">Cargando usuario...</p>
      </div>
    </div>
  );

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ background: "#e6e7e5" }}>
      <div className="p-5 rounded-4 shadow-lg" style={{ background: "#fff", minWidth: 350, maxWidth: 400, width: "100%", border: "1px solid #d3d5d1", color: "#6c7a5c" }}>
        <h2 className="mb-4 text-center fw-bold" style={{ color: "#6c7a5c" }}>
          Perfil de Usuario #{usuario.id}
        </h2>
        <ul className="list-unstyled">
          <li className="mb-2"><strong>Nombre:</strong> {usuario.nombre}</li>
          <li className="mb-2"><strong>Email:</strong> {usuario.email}</li>
          <li className="mb-2"><strong>Dirección:</strong> {usuario.direccion}</li>
          <li className="mb-2"><strong>Teléfono:</strong> {usuario.telefono}</li>
          <li className="mb-2"><strong>Tipo:</strong> {usuario.tipoUsuario}</li>
          <li className="mb-2"><strong>RUT:</strong> {usuario.rut}</li>
          <li className="mb-2"><strong>Creado en:</strong> {new Date(usuario.creadoEn).toLocaleString()}</li>
        </ul>
      </div>
    </div>
  );
};

export default UsuarioDetalle;
