import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext'; 
import '../css/Navbar.css';

//Barra de navegación superior
export default function Navbar() {
  const { user, logout } = useAuth();
  // Traemos 'messages' y la nueva función 'markAsRead'
  const { messages, markAsRead } = useData(); 
  const navigate = useNavigate(); 
  
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => { //Cerrar sesión
    logout();      
    navigate('/'); 
  };

  const myMessages = user ? messages.filter(msg => //Filtra mensajes del usuario
    msg.recipient === user.email || msg.recipient === user.name //según rol
  ) : [];

  // Contar SOLO los que no han sido leídos
  const unreadCount = myMessages.filter(msg => !msg.read).length;

  // Manejar la apertura del panel y marcar como leído
  const handleToggleNotifications = () => {
    // Si la vamos a ABRIR, marcamos todo como leído
    if (!showNotifications && unreadCount > 0) {
        const identifier = user.role === 'medico' ? user.name : user.email;
        markAsRead(identifier);
    }
    setShowNotifications(!showNotifications);
  };

  return (
    <nav className="navbar">
      {/* Logo: LLeva al inicio */}
      <Link to="/" className="nav-brand">
        <img src="/Logopage.png" alt="Logo Hospital" className="navbar-logo-img" />
      </Link>

      <div className="nav-user-section">
          {/* Enlaces públicos */}
          <Link to="/" className="nav-link">Inicio</Link>
          <Link to="/especialidades" className="nav-link">Especialidades</Link>
          <Link to="/contacto" className="nav-link">Contacto</Link>

          {/* ¿Existe un usuario logueado? */}
          {user ? (
            <>
              {/* Texto dinámico según rol */}
              <Link to="/dashboard" className="nav-link">
                {user.role === 'medico' ? 'Turnos Vigentes' : 'Mis Turnos'} 
              </Link>
              
              {/* --- SISTEMA DE NOTIFICACIONES --- */}
              <div className="notification-container">
                <button 
                    className="btn-icon" 
                    onClick={handleToggleNotifications} // Usamos la nueva función
                    title="Mis Mensajes"
                >
                    📩 
                    {/* Solo muestra el badge si hay NO LEÍDOS */}
                    {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
                </button>

                {/* Panel desplegable */}
                {showNotifications && (
                    <div className="notification-dropdown">
                        <div className="notification-header">
                            <h4>Notificaciones</h4>
                            <button className="close-btn" onClick={() => setShowNotifications(false)}>✕</button>
                        </div>
                        <div className="notification-body">
                            {myMessages.length === 0 ? (
                                <p className="no-msg">No tiene mensajes.</p>
                            ) : (
                                myMessages.map(msg => (
                                    <div key={msg.id} className="notification-item"> 
                                        <p style={{whiteSpace: 'pre-line'}}>{msg.text}</p>
                                        <small>{msg.date}</small>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
              </div>
              {/* ------------------------------- */}

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