import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const nombre = localStorage.getItem('nombre');
    if (token && nombre) {
      setAuth({ token, nombre });
    }
  }, []);

  const login = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('nombre', data.nombre);
    setAuth(data);
  };
  

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('nombre');
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
