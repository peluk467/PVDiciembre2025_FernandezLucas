import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ children }) {
  const { user } = useAuth();

  // Si "user" es null (no logueado), redirigir a Login.
  // Si existe, renderizar el componente hijo (Dashboard).
  return user ? children : <Navigate to="/login" />;
}