import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

//funciona como patovica, asegura que solo usuarios logueados accedan a ciertas rutas
export default function PrivateRoute({ children }) { 
  const { user } = useAuth(); //Obtenemos el usuario desde el context
  return user ? children : <Navigate to="/login" />; //Si hay usuario, renderiza los hijos, sino redirige al login
}