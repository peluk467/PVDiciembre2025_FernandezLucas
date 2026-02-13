import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import TurnoTicket from '../components/TurnoTicket';
import '../css/Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  // Traemos appointments y cancelAppointment del contexto
  const { doctors, bookAppointment, toggleDoctorStatus, appointments, cancelAppointment } = useData();

  // Estados para el Paciente
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  // --- LÓGICA PACIENTE ---

  // 1. Filtrar los turnos que pertenecen al usuario logueado
  const myAppointments = user.role === 'paciente' 
    ? appointments.filter(app => app.patientEmail === user.email)
    : [];

  // 2. Filtrar médicos para el buscador
  const filteredDoctors = doctors.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBooking = (time) => {
    if (!selectedDoc) return;
    const ticket = bookAppointment(user, selectedDoc, time);
    setBookingSuccess(ticket);
    setSelectedDoc(null); // Cierra el modal
  };

  const handleCancel = (id) => {
    if(window.confirm("¿Estás seguro de que deseas cancelar este turno?")) {
        cancelAppointment(id);
    }
  };

  const resetBooking = () => {
    setBookingSuccess(null);
    setSelectedDoc(null);
    setSearchTerm('');
  };

  // --- LÓGICA MÉDICO ---
  const handleToggleStatus = () => {
    toggleDoctorStatus(user.name);
  };
  
  // Buscar datos actuales del médico logueado
  const currentDoctor = user.role === 'medico' 
    ? doctors.find(d => d.name === user.name) 
    : null;

  // ---------------- RENDERIZADO ----------------
  return (
    <div className="dashboard-container fade-in">
      
      {/* ================= VISTA PACIENTE ================= */}
      {user.role === 'paciente' && (
        <>
          {/* Si ya reservó y tiene el ticket en pantalla */}
          {bookingSuccess ? (
            <TurnoTicket turno={bookingSuccess} onReset={resetBooking} />
          ) : (
            <div className="patient-panel">
              <header className="panel-header">
                <h1>Panel del Paciente</h1>
                <p>Bienvenido, {user.name}</p>
              </header>

              {/* --- SECCIÓN: MIS TURNOS RESERVADOS --- */}
              {myAppointments.length > 0 ? (
                <div className="my-appointments-section">
                    <h2 className="section-title">📅 Mis Turnos Confirmados</h2>
                    <div className="appointments-grid-patient">
                        {myAppointments.map(app => (
                            <div key={app.id} className="appointment-card-blue">
                                <div className="app-details">
                                    <strong className="app-spec">{app.doctorSpec}</strong>
                                    <p className="app-doc-name">{app.doctorName}</p>
                                    <div className="app-time-box">
                                        <span>🕒 {app.time} hs</span>
                                        <span>📅 {app.date}</span>
                                    </div>
                                    <small className="app-location">📍 {app.doctorLocation}</small>
                                </div>
                                <button 
                                    className="btn-cancel-red"
                                    onClick={() => handleCancel(app.id)}
                                    title="Cancelar turno"
                                >
                                    Cancelar
                                </button>
                            </div>
                        ))}
                    </div>
                    <hr className="divider"/>
                </div>
              ) : (
                // Mensaje opcional si no tiene turnos
                <div style={{textAlign: 'center', marginBottom: '2rem', color: '#777'}}>
                    <p>No tienes turnos reservados actualmente.</p>
                </div>
              )}
              {/* ----------------------------------------- */}

              {/* --- SECCIÓN: RESERVAR NUEVO TURNO --- */}
              <div className="booking-section">
                  <h2 className="section-title">🔍 Reservar Nuevo Turno</h2>
                  
                  {/* Buscador */}
                  <div className="search-bar-container">
                    <input 
                      type="text" 
                      placeholder="Buscar por médico o especialidad..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="search-input"
                    />
                  </div>

                  {/* Lista de Médicos (Grid) */}
                  <div className="doctors-grid">
                    {filteredDoctors.map(doc => (
                      <div key={doc.id} className="doctor-card">
                        <div className="doc-info">
                          <h3>{doc.name}</h3>
                          <span className="doc-spec">{doc.specialty}</span>
                          
                          {/* Estado del médico */}
                          {doc.status === 'license' ? (
                            <span className="status-badge license">De Licencia</span>
                          ) : (
                            <span className="status-badge available">Disponible</span>
                          )}
                        </div>

                        <button 
                          className="btn-primary"
                          disabled={doc.status === 'license'}
                          onClick={() => setSelectedDoc(doc)}
                        >
                          {doc.status === 'license' ? 'No disponible' : 'Ver Turnos'}
                        </button>
                      </div>
                    ))}

                    {filteredDoctors.length === 0 && (
                      <p className="no-results">No se encontraron médicos.</p>
                    )}
                  </div>
              </div>

              {/* === MODAL DE HORARIOS === */}
              {selectedDoc && (
                <div className="modal-overlay" onClick={() => setSelectedDoc(null)}>
                  <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                      <h2>Turnos Disponibles</h2>
                      <button className="close-btn" onClick={() => setSelectedDoc(null)}>✕</button>
                    </div>
                    
                    <div className="modal-body">
                      <p className="modal-doc-name">{selectedDoc.name}</p>
                      <p className="modal-doc-spec">{selectedDoc.specialty}</p>
                      <p className="modal-doc-loc">
                        📍 Piso {selectedDoc.floor} - Consultorio {selectedDoc.office}
                      </p>

                      <hr />

                      <div className="slots-grid">
                        {selectedDoc.slots.length > 0 ? (
                          selectedDoc.slots.map(slot => (
                            <button 
                              key={slot} 
                              className="slot-btn" 
                              onClick={() => handleBooking(slot)}
                            >
                              {slot} hs
                            </button>
                          ))
                        ) : (
                          <p className="no-slots">Sin turnos disponibles por hoy.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* ================= VISTA MÉDICO ================= */}
      {user.role === 'medico' && currentDoctor && (
        <div className="doctor-panel">
          <header className="panel-header">
            <h1>Panel Médico</h1>
            <p>Gestione sus estados y visualice su disponibilidad.</p>
          </header>

          <div className="doctor-status-card">
            <h2>Estado Actual</h2>
            <div className={`status-indicator ${currentDoctor.status}`}>
              {currentDoctor.status === 'available' ? '🟢 Atendiendo' : '🔴 De Licencia'}
            </div>
            
            <p className="status-desc">
              {currentDoctor.status === 'available' 
                ? "Su agenda está abierta para recibir turnos." 
                : "Su agenda está bloqueada. Se han notificado cancelaciones."}
            </p>

            <button 
              className={`btn-status ${currentDoctor.status === 'available' ? 'btn-license' : 'btn-available'}`}
              onClick={handleToggleStatus}
            >
              {currentDoctor.status === 'available' ? 'Solicitar Licencia' : 'Habilitar Agenda'}
            </button>
          </div>

          <div className="my-slots-section">
            <h3>Mis Horarios Libres</h3>
            <div className="slots-list">
               {currentDoctor.slots.length > 0 
                 ? currentDoctor.slots.map(s => <span key={s} className="slot-tag">{s}</span>)
                 : <p>No tiene huecos libres hoy.</p>
               }
            </div>
          </div>
        </div>
      )}
    </div>
  );
}