import { useNavigate, useLocation } from 'react-router-dom';
import '../css/BackButton.css';

export default function BackButton() { //Boton para volver
  const navigate = useNavigate(); //Hook para navegar en el historial
  const location = useLocation(); //Hook para obtener la ubicación actual

  if (location.pathname === '/') return null; //No ver el boton en el inicio

  return (
    <button  
      className="back-button-fixed"  
      onClick={() => navigate(-1)} //Vuelve atrás en el historial
    >
      {/* Icono flecha */}
      <svg className="back-icon" viewBox="0 0 24 24">  
        <path d="M15 18l-6-6 6-6" /> 
      </svg> 
    </button>
  );
}