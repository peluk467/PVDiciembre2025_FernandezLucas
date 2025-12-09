import { createContext, useState, useEffect, useContext } from 'react';

// Contexto global para compartir el estado de autenticación
const AuthContext = createContext();

// Hook personalizado para acceder al contexto desde los componentes
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => { 
  const [user, setUser] = useState(null); //Estado del usuario logueado

  //Recupera la sesión de localStorage al recargar la página
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) setUser(JSON.parse(storedUser)); 
  }, []);

  //LOGIN: Valida credenciales contra la "base de datos" local
  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('users')) || []; //Simula una base de datos
    const foundUser = users.find(u => u.email === email && u.password === password); 
    
    if (foundUser) { 
      setUser(foundUser); //Actualiza el estado global
      localStorage.setItem('currentUser', JSON.stringify(foundUser)); //Guarda en localStorage
      return true;
    }
    return false;
  };

  //REGISTRO: Guarda el nuevo usuario si el email no existe
  const register = (userData) => {
    const users = JSON.parse(localStorage.getItem('users')) || []; //Simula una base de datos
    
    if (users.find(u => u.email === userData.email)) return false; //Revisa si el email ya existe
    
    const newUser = { ...userData, id: Date.now() }; //Crea el nuevo usuario con ID único
    users.push(newUser); //Agrega a la base
    localStorage.setItem('users', JSON.stringify(users)); //Guarda en localStorage
    return true; 
  };

  // LOGOUT-cerrar sesion: Limpia el estado y localStorage
  const logout = () => { 
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  // Provee el estado y funciones a los componentes hijos
  return (
    <AuthContext.Provider value={{ user, login, register, logout }}> 
      {children}
    </AuthContext.Provider>
  );
};