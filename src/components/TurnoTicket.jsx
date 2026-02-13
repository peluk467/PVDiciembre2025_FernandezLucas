import jsPDF from 'jspdf';
import '../css/Dashboard.css';

export default function TurnoTicket({ turno, onReset }) {

  const generatePDF = () => {
    const doc = new jsPDF();

    // Encabezado del PDF
    doc.setFillColor(52, 152, 219); 
    doc.rect(0, 0, 210, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text("HOSPITAL FERNÁNDEZ - Comprobante de Turno", 105, 13, null, null, "center");

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(`ID Turno: #${turno.id}`, 20, 40);
    doc.setFont(undefined, 'normal');
    doc.text("----------------------------------------------------------------------------------", 20, 45);

    let y = 55;
    const lineHeight = 10;

    doc.setFont(undefined, 'bold');
    doc.text("PACIENTE:", 20, y);
    doc.setFont(undefined, 'normal');
    doc.text(`${turno.patientName} (DNI: ${turno.patientDNI})`, 60, y);
    
    y += lineHeight;
    doc.setFont(undefined, 'bold');
    doc.text("MÉDICO:", 20, y);
    doc.setFont(undefined, 'normal');
    doc.text(turno.doctorName, 60, y);

    y += lineHeight;
    doc.setFont(undefined, 'bold');
    doc.text("ESPECIALIDAD:", 20, y);
    doc.setFont(undefined, 'normal');
    doc.text(turno.doctorSpec, 60, y);

    y += lineHeight;
    doc.setFont(undefined, 'bold');
    doc.text("FECHA Y HORA:", 20, y);
    doc.setFont(undefined, 'normal');
    doc.text(`${turno.date} - ${turno.time} hs`, 60, y);

    y += 15;
    doc.setDrawColor(0);
    doc.setFillColor(240, 240, 240);
    doc.roundedRect(20, y, 170, 20, 3, 3, 'FD');
    doc.setFont(undefined, 'bold');
    doc.text(`UBICACIÓN: ${turno.doctorLocation}`, 105, y + 13, null, null, "center");

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Por favor, concurrir 15 minutos antes del horario indicado.", 105, 280, null, null, "center");

    doc.save(`Turno_${turno.patientName}_${turno.date}.pdf`);
  };

  return (
    <div className="ticket-overlay fade-in">
      <div className="ticket-card-modern">
        
        {/* Encabezado con Icono Animado */}
        <div className="ticket-header-success">
            <div className="success-checkmark">
                <div className="check-icon">
                    <span className="icon-line line-tip"></span>
                    <span className="icon-line line-long"></span>
                    <div className="icon-circle"></div>
                    <div className="icon-fix"></div>
                </div>
            </div>
            <h2>¡Turno Reservado!</h2>
            <p>La operación se realizó con éxito</p>
        </div>

        {/* Cuerpo del Ticket */}
        <div className="ticket-body">
            <div className="ticket-row">
                <span className="label">Paciente:</span>
                <span className="value">{turno.patientName}</span>
            </div>
            <div className="ticket-row">
                <span className="label">DNI:</span>
                <span className="value">{turno.patientDNI}</span>
            </div>
            
            <div className="ticket-divider"></div>

            <div className="ticket-row">
                <span className="label">Especialista:</span>
                <span className="value highlight">{turno.doctorName}</span>
            </div>
            <div className="ticket-row">
                <span className="label">Área:</span>
                <span className="value">{turno.doctorSpec}</span>
            </div>

            <div className="ticket-location-box">
                <span className="loc-icon">📍</span>
                <div className="loc-text">
                    <span className="loc-label">Ubicación:</span>
                    <span className="loc-value">{turno.doctorLocation}</span>
                </div>
            </div>

            <div className="ticket-row time-row">
                <div className="time-box">
                    <span className="time-label">Fecha</span>
                    <span className="time-value">{turno.date}</span>
                </div>
                <div className="time-box">
                    <span className="time-label">Hora</span>
                    <span className="time-value">{turno.time} hs</span>
                </div>
            </div>
        </div>

        {/* Botones */}
        <div className="ticket-footer">
            <button onClick={generatePDF} className="btn-download">
                📥 Descargar PDF
            </button>
            <button onClick={onReset} className="btn-back">
                Volver al Inicio
            </button>
        </div>

      </div>
    </div>
  );
}