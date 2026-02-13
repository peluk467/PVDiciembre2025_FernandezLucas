import { createContext, useState, useContext } from 'react';

// Contexto global para compartir el estado de autenticación
const AuthContext = createContext();

// Hook personalizado para acceder al contexto desde los componentes
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => { 
  
  // SOLUCIÓN AQUÍ: Leemos el localStorage de forma síncrona al inicializar el estado.
  // Así evitamos el parpadeo de "null" que nos expulsaba al hacer refresh.
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // LOGIN: Valida credenciales contra la "base de datos" local
  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('users')) || []; 
    const foundUser = users.find(u => u.email === email && u.password === password); 
    
    if (foundUser) { 
      setUser(foundUser); 
      localStorage.setItem('currentUser', JSON.stringify(foundUser)); 
      return true;
    }
    return false;
  };

  // REGISTRO: Guarda el nuevo usuario si el email no existe
  const register = (userData) => {
    const users = JSON.parse(localStorage.getItem('users')) || []; 
    
    if (users.find(u => u.email === userData.email)) return false; 
    
    const newUser = { ...userData, id: Date.now() }; 
    users.push(newUser); 
    localStorage.setItem('users', JSON.stringify(users)); 
    return true; 
  };

  // LOGOUT: Limpia el estado y localStorage
  const logout = () => { 
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}> 
      {children}
    </AuthContext.Provider>
  );
};