// src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../css/Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); 
  };

  return (
    <nav className="navbar">
      
      {/* Logo + Título del Hospital */}
      <Link to="/" className="nav-brand">
        <img src="/Logopage.png" alt="Logo Hospital" className="navbar-logo-img" />
        <h1>HOSPITAL FERNÁNDEZ</h1>
      </Link>

      <div className="nav-user-section">
          <Link to="/" className="nav-link">Inicio</Link>
          <Link to="/especialidades" className="nav-link">Especialidades</Link>
          
          {/* --- NUEVO APARTADO DE CONTACTO --- */}
          <Link to="/contacto" className="nav-link">Contacto</Link>
          {/* ---------------------------------- */}

          {user ? (
            <>
              {/* Texto dinámico según si es Médico o Paciente */}
              <Link to="/dashboard" className="nav-link">
                {user.role === 'medico' ? 'Turnos Vigentes' : 'Mis Turnos'}
              </Link>
              
              <span className="nav-username">| {user.name}</span>
              <button onClick={handleLogout} className="btn-logout">Salir</button>
            </>
          ) : (
            <>
                <Link to="/login" className="nav-link">Ingresar</Link>
            </>
          )}
      </div>
    </nav>
  );
}