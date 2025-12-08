import jsPDF from 'jspdf';
import '../css/Dashboard.css';

export default function TurnoTicket({ turno, onReset }) {
  
  const generatePDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text("Comprobante de Turno Médico", 20, 20);
    doc.setFontSize(10);
    doc.text("Hospital Fernández", 20, 26);
    
    doc.setFontSize(12);
    doc.text(`ID Turno: ${turno.id}`, 20, 40);
    doc.text(`Paciente: ${turno.patientName}`, 20, 50);
    doc.text(`DNI: ${turno.patientDNI}`, 20, 60);
    
    doc.line(20, 65, 190, 65); // Línea separadora

    doc.text(`Médico: ${turno.doctorName}`, 20, 75);
    doc.text(`Especialidad: ${turno.doctorSpec}`, 20, 85);
    
    // --- AQUÍ AGREGAMOS LA UBICACIÓN AL PDF ---
    doc.setFont(undefined, 'bold');
    doc.text(`UBICACIÓN: ${turno.doctorLocation || 'Consultar en admisión'}`, 20, 95);
    doc.setFont(undefined, 'normal');
    // -------------------------------------------

    doc.text(`Fecha: ${turno.date}`, 20, 105);
    doc.text(`Hora: ${turno.time} hs`, 20, 115);

    doc.setFontSize(10);
    doc.text("Por favor concurrir 10 minutos antes con DNI.", 20, 130);

    doc.save(`turno_${turno.id}.pdf`);
  };

  return (
    <div className="ticket-wrapper">
      <div className="ticket-card">
        <h2 style={{ color: '#27ae60' }}>¡Turno Confirmado!</h2>
        <div style={{ textAlign: 'left', margin: '1.5rem 0', lineHeight: '1.6' }}>
            <p><strong>Paciente:</strong> {turno.patientName}</p>
            <p><strong>DNI:</strong> {turno.patientDNI}</p>
            <hr style={{ border: '0', borderTop: '1px dashed #ccc' }}/>
            <p><strong>Médico:</strong> {turno.doctorName}</p>
            <p><strong>Especialidad:</strong> {turno.doctorSpec}</p>
            
            {/* UBICACIÓN DESTACADA */}
            <div style={{ background: '#fcf3cf', padding: '10px', borderRadius: '5px', margin: '10px 0', borderLeft: '4px solid #f1c40f' }}>
                <strong>Lugar de atención:</strong><br/>
                {turno.doctorLocation || "Piso y Consultorio a confirmar"}
            </div>

            <p><strong>Fecha:</strong> {turno.date}</p>
            <p><strong>Hora:</strong> {turno.time} hs</p>
        </div>
        
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button onClick={generatePDF} className="btn-primary" style={{ backgroundColor: '#e74c3c' }}>
                Descargar PDF
            </button>
            <button onClick={onReset} className="btn-primary" style={{ backgroundColor: '#95a5a6' }}>
                Volver
            </button>
        </div>
      </div>
    </div>
  );
}