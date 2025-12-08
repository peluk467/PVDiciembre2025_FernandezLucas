import { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import TurnoTicket from '../components/TurnoTicket';
import '../css/Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const { doctors, appointments, bookAppointment, cancelAppointment } = useData();
  
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [confirmedTurno, setConfirmedTurno] = useState(null);
  
  // --- NUEVO ESTADO PARA BÚSQUEDA ---
  const [searchTerm, setSearchTerm] = useState("");

  // --- VISTA MÉDICO ---
  if (user.role === 'medico') {
    const myAppointments = appointments.filter(app => 
        app.doctorName.toLowerCase().includes(user.name.toLowerCase()) || 
        user.name.toLowerCase().includes(app.doctorName.toLowerCase())
    );

    return (
      <div className="container">
        <h2>Panel Médico: Dr/a. {user.name}</h2>
        <p>Legajo: {user.legajo}</p>
        <div className="card">
            <h3>📋 Turnos Vigentes (MAÑANA)</h3>
            {myAppointments.length === 0 ? (
                <p style={{ padding: '1rem', color: '#777' }}>No tiene turnos asignados.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                    <thead>
                        <tr style={{ background: '#eee', textAlign: 'left' }}>
                            <th style={{ padding: '10px' }}>Horario</th>
                            <th style={{ padding: '10px' }}>Paciente</th>
                            <th style={{ padding: '10px' }}>DNI</th>
                        </tr>
                    </thead>
                    <tbody>
                        {myAppointments.sort((a,b) => a.time.localeCompare(b.time)).map(app => (
                            <tr key={app.id} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{ padding: '10px', color: '#2980b9', fontWeight: 'bold' }}>{app.time}</td>
                                <td style={{ padding: '10px' }}>{app.patientName}</td>
                                <td style={{ padding: '10px' }}>{app.patientDNI}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
      </div>
    );
  }

  // --- VISTA PACIENTE ---
  
  // 1. Lógica de Mis Turnos
  const misTurnos = appointments.filter(app => app.patientEmail === user.email);

  // 2. Lógica de Filtrado de Médicos (NUEVO)
  const filteredDoctors = doctors.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    doc.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBooking = (time) => {
    if (window.confirm(`¿Confirmar turno con ${selectedDoc.name} a las ${time}?`)) {
      const turno = bookAppointment(user, selectedDoc, time);
      setConfirmedTurno(turno);
      setSelectedDoc(null);
      setSearchTerm(""); // Limpiamos la búsqueda al confirmar
    }
  };

  const handleCancel = (id) => {
    if (window.confirm("¿Estás seguro que deseas cancelar este turno?")) {
        cancelAppointment(id);
    }
  };

  if (confirmedTurno) {
    return <TurnoTicket turno={confirmedTurno} onReset={() => setConfirmedTurno(null)} />;
  }

  return (
    <div className="container">
      <h2 style={{ marginBottom: '2rem' }}>Hola, {user.name}</h2>

      {/* SECCIÓN 1: MIS TURNOS CONFIRMADOS */}
      <div className="card" style={{ marginBottom: '2rem', borderLeft: '5px solid #27ae60' }}>
        <h3>📅 Mis Turnos Confirmados</h3>
        {misTurnos.length === 0 ? (
            <p style={{ color: '#777' }}>Aún no tienes turnos registrados.</p>
        ) : (
            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', marginTop: '1rem' }}>
                {misTurnos.map(turno => (
                    <div key={turno.id} style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e0e0e0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                        <h4 style={{ margin: '0', color: '#2c3e50', fontSize: '1.1rem' }}>{turno.doctorName}</h4>
                        <p style={{ margin: '0', color: '#7f8c8d', fontSize: '0.9rem', marginBottom: '10px' }}>{turno.doctorSpec}</p>
                        
                        <div style={{ background: '#e3f2fd', padding: '10px', borderRadius: '6px', color: '#1565c0', fontSize: '0.95rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>📍</span> 
                            {turno.doctorLocation || 'Piso y Cons. a confirmar'}
                        </div>

                        <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: '#888' }}>MAÑANA</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2c3e50' }}>{turno.time} hs</div>
                            </div>
                            <button 
                                onClick={() => handleCancel(turno.id)}
                                style={{
                                    background: '#e74c3c', 
                                    color: 'white', 
                                    padding: '5px 10px', 
                                    fontSize: '0.8rem', 
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancelar Turno
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>

      {/* SECCIÓN 2: SOLICITAR NUEVO TURNO */}
      <h3 style={{ borderBottom: '2px solid #3498db', paddingBottom: '0.5rem', display: 'inline-block' }}>
        Solicitar Nuevo Turno
      </h3>
      
      {/* BARRA DE BÚSQUEDA */}
      <div className="search-wrapper" style={{ marginBottom: '1.5rem', justifyContent: 'flex-start' }}>
        <input 
            type="text" 
            placeholder="🔍 Buscar por nombre o especialidad..." 
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ maxWidth: '100%' }} // Ajuste para que ocupe el ancho disponible
        />
      </div>

      <div className="grid">
        <div className="card">
            <h3>Médicos Disponibles</h3>
            <ul className="doctor-list">
                {/* Usamos filteredDoctors en lugar de doctors */}
                {filteredDoctors.length > 0 ? (
                    filteredDoctors.map(doc => (
                        <li key={doc.id}>
                            <button className="doctor-btn" onClick={() => setSelectedDoc(doc)}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <strong>{doc.name}</strong> <br/>
                                        <small>{doc.specialty}</small>
                                    </div>
                                    <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#7f8c8d' }}>
                                        <div>Piso {doc.floor}</div>
                                        <div>Cons. {doc.office}</div>
                                    </div>
                                </div>
                            </button>
                        </li>
                    ))
                ) : (
                    <p style={{ color: '#777', padding: '1rem', fontStyle: 'italic' }}>
                        No se encontraron médicos con ese nombre.
                    </p>
                )}
            </ul>
        </div>

        {selectedDoc && (
            <div className="card">
                <h3>Horarios de: {selectedDoc.name}</h3>
                <p>Ubicación: <strong>Piso {selectedDoc.floor} - Consultorio {selectedDoc.office}</strong></p>
                <hr style={{ border: '0', borderTop: '1px solid #eee', margin: '1rem 0'}}/>
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