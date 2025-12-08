import { useAuth } from '../context/AuthContext';
import { useForm } from '../hooks/useForm';
import { useNavigate, Link } from 'react-router-dom';
import '../css/Auth.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [formValues, handleInputChange] = useForm({
    email: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = login(formValues.email, formValues.password);
    
    if (success) {
      // --- CAMBIO AQUÍ ---
      // Antes decía: navigate('/dashboard');
      // Ahora ponemos '/' para que vaya al Inicio
      navigate('/'); 
    } else {
      alert('Credenciales inválidas. Verifique su usuario o regístrese.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input 
              type="email" 
              name="email" 
              required
              placeholder="Ej: usuario@mail.com"
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
              placeholder="********"
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