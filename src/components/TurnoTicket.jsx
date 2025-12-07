// src/components/TurnoTicket.jsx
import jsPDF from 'jspdf';

export default function TurnoTicket({ turno, onReset }) {
  
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Comprobante de Turno Médico", 20, 20);
    doc.text(`Paciente: ${turno.patientName}`, 20, 40);
    doc.text(`Médico: ${turno.doctorName} (${turno.doctorSpec})`, 20, 50);
    doc.text(`Fecha: ${turno.date}`, 20, 60);
    doc.text(`Hora: ${turno.time}`, 20, 70);
    doc.text(`ID Turno: ${turno.id}`, 20, 80);
    doc.save(`turno_${turno.id}.pdf`);
  };

  return (
    <div className="ticket-container">
      <div className="ticket">
        <h3>¡Turno Confirmado!</h3>
        <p><strong>Paciente:</strong> {turno.patientName}</p>
        <p><strong>Médico:</strong> {turno.doctorName}</p>
        <p><strong>Hora:</strong> {turno.time}</p>
        
        <button onClick={generatePDF} style={{backgroundColor: '#e74c3c'}}>
            Descargar PDF
        </button>
        <button onClick={onReset} style={{marginLeft: '10px'}}>
            Volver al inicio
        </button>
      </div>
    </div>
  );
}