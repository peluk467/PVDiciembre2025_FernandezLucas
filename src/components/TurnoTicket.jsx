import jsPDF from 'jspdf';
import '../css/Dashboard.css';

export default function TurnoTicket({ turno, onReset }) {

  //Construye el PDF
  const generatePDF = () => {
    const doc = new jsPDF();//Pdf en blanco

    doc.setFontSize(20);
    doc.text("Comprobante de Turno Médico", 20, 20);
    
    doc.setFontSize(10);
    doc.text("Hospital Fernández", 20, 26);
    
    //Datos del Paciente
    doc.setFontSize(12);
    doc.text(`ID Turno: ${turno.id}`, 20, 40);
    doc.text(`Paciente: ${turno.patientName}`, 20, 50);
    doc.text(`DNI: ${turno.patientDNI}`, 20, 60);
    
    //Línea divisoria
    doc.line(20, 65, 190, 65); 

    //Datos del Médico
    doc.text(`Médico: ${turno.doctorName}`, 20, 75);
    doc.text(`Especialidad: ${turno.doctorSpec}`, 20, 85);
    
    doc.setFont(undefined, 'bold');//Negrita
    //Destaca la ubicación del consultorio
    doc.text(`UBICACIÓN: ${turno.doctorLocation || 'Consultar en admisión'}`, 20, 95);
    doc.setFont(undefined, 'normal');//Normal

    
    doc.text(`Fecha: ${turno.date}`, 20, 105);
    doc.text(`Hora: ${turno.time} hs`, 20, 115);

    //Mensaje del pie
    doc.setFontSize(10);
    doc.text("Por favor concurrir 10 minutos antes con DNI para confirmar turno", 20, 130);

    //Guarda el PDF y descarga automática
    doc.save(`turno_${turno.id}.pdf`);
  };

  return (
    <div className="ticket-wrapper">
      <div className="ticket-card">
        <h2 style={{ color: '#27ae60' }}>¡Turno Confirmado!</h2>
        
        {/* Resumen visual en pantalla */}
        <div style={{ textAlign: 'left', margin: '1.5rem 0', lineHeight: '1.6' }}>
            <p><strong>Paciente:</strong> {turno.patientName}</p>
            <p><strong>DNI:</strong> {turno.patientDNI}</p>
            <hr style={{ border: '0', borderTop: '1px dashed #ccc' }}/>
            <p><strong>Médico:</strong> {turno.doctorName}</p>
            <p><strong>Especialidad:</strong> {turno.doctorSpec}</p>
            
            {/* Tarjeta destacada para la ubicación */}
            <div style={{ background: '#fcf3cf', padding: '10px', borderRadius: '5px', margin: '10px 0', borderLeft: '4px solid #f1c40f' }}>
                <strong>Lugar de atención:</strong><br/>
                {turno.doctorLocation || "Piso y Consultorio a confirmar"}
            </div>

            <p><strong>Fecha:</strong> {turno.date}</p>
            <p><strong>Hora:</strong> {turno.time} hs</p>
        </div>
        
        {/* Botones de acción */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button onClick={generatePDF} className="btn-primary" style={{ backgroundColor: '#e74c3c' }}>
                Descargar PDF
            </button>
            {/* Llama a la función onReset pasada por props para limpiar el estado en Dashboard */}
            <button onClick={onReset} className="btn-primary" style={{ backgroundColor: '#95a5a6' }}>
                Volver
            </button>
        </div>
      </div>
    </div>
  );
}
