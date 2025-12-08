import { useNavigate, useLocation } from 'react-router-dom';
import '../css/BackButton.css';

export default function BackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  // Opcional: Si no quieres que aparezca en el Inicio ('/'), descomenta esto:
  if (location.pathname === '/') return null;

  return (
    <button 
      className="back-button-fixed" 
      onClick={() => navigate(-1)} 
      title="Volver atrás"
    >
      {/* Icono de Flecha Izquierda (SVG) */}
      <svg className="back-icon" viewBox="0 0 24 24">
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </button>
  );
}