// src/pages/Login.jsx
import { useAuth } from '../context/AuthContext';
import { useForm } from '../hooks/useForm';
import '../css/Auth.css';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  // Usamos nuestro hook personalizado
  const [formValues, handleInputChange] = useForm({
    email: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = login(formValues.email, formValues.password);
    
    if (success) {
      navigate('/dashboard');
    } else {
      alert('Credenciales inválidas. Intente registrarse.');
    }
  };

  return (
    <div className="auth-container">
      <div className="card auth-card">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input 
              type="email" 
              name="email" 
              required
              value={formValues.email} 
              onChange={handleInputChange} 
            />
          </div>
          <div className="form-group">
            <label>Contraseña:</label>
            <input 
              type="password" 
              name="password" 
              required
              value={formValues.password} 
              onChange={handleInputChange} 
            />
          </div>
          <button type="submit" className="btn-primary">Ingresar</button>
        </form>
        <p className="redirect-text">
          ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
}