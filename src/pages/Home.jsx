import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // <--- Importamos esto
import '../css/Home.css';

export default function Home() {
  const { user } = useAuth(); // <--- Obtenemos el usuario
  const heroImageUrl = "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  return (
    <div className="home-container">
      
      <div className="hero-banner" style={{ backgroundImage: `url(${heroImageUrl})` }}>
        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hospital-title">HOSPITAL FERNÁNDEZ</h1>
            <p className="hospital-subtitle">
              Compromiso, tecnología y calidez humana al cuidado de su salud.
            </p>
             
            {/* BOTÓN INTELIGENTE */}
            {/* Si existe 'user', va al dashboard. Si no, va al login. */}
            <Link to={user ? "/dashboard" : "/login"} className="btn-hero-cta"> 
              {user ? "Ir a Mis Turnos" : "Ir a Mi Cuenta"} 
            </Link>
          </div>
        </div>
      </div>

      <div className="quick-access-bar container">
        
        {/* MISMO LOGICA PARA EL BOTÓN DE ICONO */}
        <Link to={user ? "/dashboard" : "/login"} className="qa-item">
          <div className="qa-icon">📅</div>
          <h3>Turnos Online</h3>
          <p>Gestione sus citas médicas</p>
        </Link>

        <Link to="/especialidades" className="qa-item">
          <div className="qa-icon">🩺</div>
          <h3>Nuestros Profesionales</h3>
          <p>Conozca el cuerpo médico</p>
        </Link>

        <div className="qa-item inactive">
          <div className="qa-icon">🏥</div>
          <h3>Guardia 24hs</h3>
          <p>Atención de urgencias</p>
        </div>

        <div className="qa-item inactive">
          <div className="qa-icon">🔬</div>
          <h3>Resultados</h3>
          <p>Consulte sus estudios</p>
        </div>

      </div>

      <div className="institutional-section container">
        <h2>Bienvenidos al Hospital Fernández</h2>
        <p>
          Con más de 50 años de trayectoria, somos líderes en atención médica integral. 
          Nuestro objetivo es brindar un servicio de excelencia, apoyado en la constante 
          innovación tecnológica y la capacitación continua de nuestros profesionales.
        </p>
      </div>

    </div>
  );
}