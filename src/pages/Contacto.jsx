import { useState } from 'react';
import '../css/Contacto.css';

export default function Contacto() {
  const [formData, setFormData] = useState({
    nombre: '', apellido: '', email: '', asunto: '', mensaje: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value }); // Actualiza el estado del formulario
  };

  // Maneja el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Enviando:", formData);
    alert("¡Mensaje enviado! Nos contactaremos pronto.");
    setFormData({ nombre: '', apellido: '', email: '', asunto: '', mensaje: '' });
  };

  // Mi numero de WhatsApp y mensaje predeterminado
  const miNumero = "5493884397876"; 
  const mensajePredeterminado = "Hola, quisiera hacer una consulta sobre el Hospital Fernández.";

  return (
    <div className="contact-container">
      
      <div className="contact-header">
        <span className="contact-icon-top">🩺</span> 
        <h1 className="contact-title">CONTÁCTANOS</h1>
        <p className="contact-subtitle">
          Estamos aquí para ayudarte. Completa el formulario o visítanos en nuestra sede.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="contact-form">
        {/* ... (Tus inputs del formulario siguen igual) ... */}
        <div className="form-row">
            <div className="form-col">
                <label className="form-label">Nombre <span className="required">*</span></label>
                <input type="text" name="nombre" className="form-input" required value={formData.nombre} onChange={handleChange} />
            </div>
            <div className="form-col">
                <label className="form-label">Apellido <span className="required">*</span></label>
                <input type="text" name="apellido" className="form-input" required value={formData.apellido} onChange={handleChange} />
            </div>
        </div>

        <div className="form-row">
            <div className="form-col">
                <label className="form-label">E-mail <span className="required">*</span></label>
                <input type="email" name="email" className="form-input" required value={formData.email} onChange={handleChange} />
            </div>
            <div className="form-col">
                <label className="form-label">Asunto <span className="required">*</span></label>
                <select name="asunto" className="form-select" required value={formData.asunto} onChange={handleChange}>
                    <option value="">Seleccione...</option>
                    <option value="consulta">Consulta General</option>
                    <option value="turnos">Turnos</option>
                    <option value="sugerencia">Sugerencias</option>
                </select>
            </div>
        </div>

        <div className="form-col" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Mensaje <span className="required">*</span></label>
            <textarea name="mensaje" className="form-textarea" required value={formData.mensaje} onChange={handleChange}></textarea>
        </div>

        <button type="submit" className="btn-send">Enviar Mensaje</button>
      </form>

      {/* --- NUEVA SECCIÓN DE INFORMACIÓN Y MAPA --- */}
      <div className="contact-info-section">
        <h2 className="info-title">INFORMACIÓN DE CONTACTO</h2>
        
        <div className="info-grid">
            {/* Columna Izquierda: Datos */}
            <div className="info-details">
                <div className="info-item">
                    <span className="info-icon">📍</span>
                    <div>
                        <p><strong>Dirección:</strong></p>
                        <p>Ing. Mario Italo Palanca 10</p>
                        <p>San Salvador de Jujuy, Jujuy, Argentina</p>
                    </div>
                </div>

                <div className="info-item">
                    <span className="info-icon">📞</span>
                    <div>
                         <p><strong>Teléfono:</strong></p>
                         <p>3884-1234567</p>
                    </div>
                </div>

                <div className="info-item">
                    <span className="info-icon">💬</span>
                    <div>
                         <p><strong>WhatsApp:</strong></p>
                         <p>+54 9 388 439 7876</p>
                         <small style={{ opacity: 0.8 }}>Cualquier Conculta las 24hs</small>
                    </div>
                </div>
            </div>

            {/* Columna Derecha: Mapa */}
            <div className="map-container">
                <iframe 
                    title="Ubicación Hospital"
                    src="https://maps.google.com/maps?q=Ing.+Mario+Italo+Palanca+10,+San+Salvador+de+Jujuy&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen="" 
                    loading="lazy"
                ></iframe>
            </div>
        </div>
      </div>
      {/* ------------------------------------------- */}

      {/* Botón flotante */}
      <a 
        href={`https://wa.me/${miNumero}?text=${encodeURIComponent(mensajePredeterminado)}`}
        className="btn-whatsapp"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="whatsapp-icon">
            <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-4-10.5-6.8z"/>
        </svg>
      </a>

    </div>
  );
}