import { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import TurnoTicket from '../components/TurnoTicket';
import '../css/Dashboard.css';

export default function Dashboard() {
  // 1. HOOKS DE CONTEXTO: Traemos usuario (Auth) y funciones de datos (Data)
  const { user } = useAuth();
  const { doctors, appointments, bookAppointment, cancelAppointment, toggleDoctorStatus } = useData();
  
  // 2. ESTADOS LOCALES: Para controlar la UI (seleccionados, confirmaciones, búsqueda)
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [confirmedTurno, setConfirmedTurno] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // --- VISTA EXCLUSIVA PARA MÉDICOS ---
  // Si el rol es 'medico', renderizamos un panel de control diferente
  if (user.role === 'medico') {
    
    // Verificamos el estado actual (Licencia/Disponible)
    const currentDoctorData = doctors.find(d => d.name === user.name); 
    const isOnLeave = currentDoctorData?.status === 'license';

    // Filtramos los turnos donde él es el médico
    const myAppointments = appointments.filter(app => 
        app.doctorName.toLowerCase().includes(user.name.toLowerCase()) || 
        user.name.toLowerCase().includes(app.doctorName.toLowerCase())
    );

    return (
      <div className="container dashboard-container">
        
        <div className="dashboard-header-block">
            <h2>Panel Médico: Dr/a. {user.name}</h2>
            <p>Legajo: {user.legajo}</p>
        </div>

        <div className="card">
            {/* Cabecera Flexbox: Título a la izquierda, Controles a la derecha */}
            <div className="card-header-flex">
                <h3 className="card-title">📋 Turnos Vigentes (MAÑANA)</h3>
                
                <div className="license-controls">
                    {/* Indicador visual de estado */}
                    <span className={`status-text ${isOnLeave ? 'status-license' : 'status-available'}`}>
                        {isOnLeave ? '🔴 DE LICENCIA' : '🟢 DISPONIBLE'}
                    </span>
                    {/* Botón para cambiar estado (toggle) */}
                    <button 
                        onClick={() => toggleDoctorStatus(user.name)}
                        className={`btn-license ${isOnLeave ? 'btn-back' : 'btn-leave'}`}
                    >
                        {isOnLeave ? 'Volver a Trabajar' : 'Tomar Licencia'}
                    </button>
                </div>
            </div>

            {/* Renderizado Condicional: Aviso si está de licencia */}
            {isOnLeave && (
                <div className="alert-license">
                    ⚠️ <strong>Atención:</strong> Usted está en modo licencia. Su perfil aparece bloqueado para nuevos turnos.
                </div>
            )}

            {/* Tabla de Turnos o Mensaje de Vacío */}
            {myAppointments.length === 0 ? (
                <p className="empty-msg">No tiene turnos asignados.</p>
            ) : (
                <table className="appointments-table">
                    <thead>
                        <tr>
                            <th>Horario</th>
                            <th>Paciente</th>
                            <th>DNI</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Ordenamos por horario antes de mostrar */}
                        {myAppointments.sort((a,b) => a.time.localeCompare(b.time)).map(app => (
                            <tr key={app.id}>
                                <td className="time-cell">{app.time}</td>
                                <td>{app.patientName}</td>
                                <td>{app.patientDNI}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
      </div>
    );
  }

  // --- VISTA EXCLUSIVA PARA PACIENTES ---
  
  // Filtramos los turnos que pertenecen a este paciente
  const misTurnos = appointments.filter(app => app.patientEmail === user.email);
  
  // Filtro de búsqueda de médicos (Nombre o Especialidad)
  const filteredDoctors = doctors.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    doc.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Manejador para reservar turno
  const handleBooking = (time) => {
    if (window.confirm(`¿Confirmar turno con ${selectedDoc.name} a las ${time}?`)) {
      const turno = bookAppointment(user, selectedDoc, time);
      setConfirmedTurno(turno); // Muestra el ticket
      setSelectedDoc(null);     // Cierra el acordeón
      setSearchTerm("");        // Limpia búsqueda
    }
  };

  const handleCancel = (id) => {
    if (window.confirm("¿Estás seguro que deseas cancelar este turno?")) {
        cancelAppointment(id);
    }
  };

  // Si hay un turno recién confirmado, mostramos el Ticket en lugar del Dashboard
  if (confirmedTurno) {
    return <TurnoTicket turno={confirmedTurno} onReset={() => setConfirmedTurno(null)} />;
  }

  return (
    <div className="container dashboard-container">
      <h2 className="welcome-title">Hola, {user.name}</h2>

      {/* SECCIÓN 1: MIS TURNOS */}
      <div className="card section-my-appointments">
        <h3>📅 Mis Turnos Confirmados</h3>
        {misTurnos.length === 0 ? (
            <p className="empty-msg">Aún no tienes turnos registrados.</p>
        ) : (
            <div className="appointments-grid">
                {misTurnos.map(turno => {
                    // Verificamos si el médico de este turno entró en licencia
                    const doctorActual = doctors.find(d => d.name === turno.doctorName);
                    const isDoctorOnLeave = doctorActual?.status === 'license';

                    return (
                        <div key={turno.id} className="appointment-card">
                            <h4 className="doc-name">{turno.doctorName}</h4>
                            <p className="doc-spec">{turno.doctorSpec}</p>
                            
                            <div className="location-badge">
                                <span>📍</span> 
                                {turno.doctorLocation || 'Piso y Cons. a confirmar'}
                            </div>

                            {/* Aviso visual si el médico se fue de licencia */}
                            {isDoctorOnLeave && (
                                <div className="alert-license-patient">
                                    ⚠️ El Médico está de licencia, su turno será reprogramado en breve.
                                </div>
                            )}

                            <div className="appointment-footer">
                                <div>
                                    <div className="app-date">MAÑANA</div>
                                    <div className="app-time">{turno.time} hs</div>
                                </div>
                                <button 
                                    onClick={() => handleCancel(turno.id)}
                                    className="btn-cancel"
                                >
                                    Cancelar Turno
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        )}
      </div>

      {/* SECCIÓN 2: SOLICITAR TURNO */}
      <h3 className="section-title-underline">
        Solicitar Nuevo Turno
      </h3>
      
      <div className="search-wrapper-left">
        <input 
            type="text" 
            placeholder="🔍 Buscar por nombre o especialidad..." 
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid">
        <div className="card">
            <h3>Médicos Disponibles</h3>
            <ul className="doctor-list">
                {filteredDoctors.length > 0 ? (
                    filteredDoctors.map(doc => {
                        const isLicense = doc.status === 'license';
                        return (
                            <li key={doc.id}>
                                <button 
                                    // Deshabilitamos visualmente si está de licencia
                                    className={`doctor-btn ${isLicense ? 'disabled-doc' : ''}`}
                                    onClick={() => !isLicense && setSelectedDoc(doc)}
                                >
                                    <div className="doctor-btn-content">
                                        <div>
                                            <strong>{doc.name}</strong> 
                                            {isLicense && <span className="badge-license">DE LICENCIA</span>}
                                            <br/>
                                            <small>{doc.specialty}</small>
                                        </div>
                                        <div className="doctor-location-mini">
                                            <div>Piso {doc.floor}</div>
                                            <div>Cons. {doc.office}</div>
                                        </div>
                                    </div>
                                </button>
                            </li>
                        );
                    })
                ) : (
                    <p className="empty-msg">No se encontraron médicos con ese nombre.</p>
                )}
            </ul>
        </div>

        {/* Panel de Horarios (Solo si seleccionó un médico) */}
        {selectedDoc && (
            <div className="card">
                <h3>Horarios de: {selectedDoc.name}</h3>
                <p>Ubicación: <strong>Piso {selectedDoc.floor} - Consultorio {selectedDoc.office}</strong></p>
                <hr className="divider"/>
                <div className="slots-container">
                    {selectedDoc.slots.map(slot => (
                        <button key={slot} className="slot-btn" onClick={() => handleBooking(slot)}>
                            {slot}
                        </button>
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
}