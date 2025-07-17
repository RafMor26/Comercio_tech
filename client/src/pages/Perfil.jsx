import { useEffect, useState } from 'react';
import API from '../services/api';
import Swal from 'sweetalert2';

const Perfil = () => {
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    const obtenerPerfil = async () => {
      try {
        const res = await API.get('/usuarios/perfil'); // Token se envía automáticamente
        setPerfil(res.data);
      } catch (err) {
        Swal.fire('Error', 'No se pudo cargar el perfil', 'error');
      }
    };

    obtenerPerfil();
  }, []);

  if (!perfil) return <p>Cargando perfil...</p>;

  return (
    <div>
      <h2>Mi Perfil</h2>
      <ul>
        <li><strong>ID:</strong> {perfil.id}</li>
        <li><strong>Nombre:</strong> {perfil.nombre}</li>
        <li><strong>Email:</strong> {perfil.email}</li>
        <li><strong>Dirección:</strong> {perfil.direccion}</li>
        <li><strong>Teléfono:</strong> {perfil.telefono}</li>
        <li><strong>RUT:</strong> {perfil.rut}</li>
        <li><strong>Tipo de Usuario:</strong> {perfil.tipoUsuario}</li>
        <li><strong>Creado en:</strong> {new Date(perfil.creadoEn).toLocaleString()}</li>
      </ul>
    </div>
  );
};

export default Perfil;
