// src/pages/Dashboard.jsx
import { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import TurnoTicket from '../components/TurnoTicket';

export default function Dashboard() {
  const { user } = useAuth();
  const { doctors, bookAppointment } = useData();
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [confirmedTurno, setConfirmedTurno] = useState(null);

  const handleBooking = (time) => {
    if (window.confirm(`¿Confirmar turno con ${selectedDoc.name} a las ${time}?`)) {
      const turno = bookAppointment(user, selectedDoc, time);
      setConfirmedTurno(turno);
      setSelectedDoc(null); // Resetear selección
    }
  };

  if (confirmedTurno) {
    return <TurnoTicket turno={confirmedTurno} onReset={() => setConfirmedTurno(null)} />;
  }

  return (
    <div className="container">
      <h2>Bienvenido, {user.name}</h2>
      <p>Seleccione un médico para ver horarios de MAÑANA:</p>

      <div className="grid">
        {/* Lista de Médicos */}
        <div className="card">
            <h3>Médicos Disponibles</h3>
            <ul>
                {doctors.map(doc => (
                    <li key={doc.id}>
                        <button onClick={() => setSelectedDoc(doc)}>
                            {doc.name} - {doc.specialty}
                        </button>
                    </li>
                ))}
            </ul>
        </div>

        {/* Horarios del Médico Seleccionado */}
        {selectedDoc && (
            <div className="card">
                <h3>Horarios para: {selectedDoc.name}</h3>
                <p>Fecha: MAÑANA</p>
                <div className="slots">
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