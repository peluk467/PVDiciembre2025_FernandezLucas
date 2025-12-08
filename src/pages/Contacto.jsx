// src/pages/Contacto.jsx
import { useState } from 'react';
import '../css/Contacto.css';

export default function Contacto() {
  // Estado para el formulario
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    asunto: '',
    mensaje: ''
  });

  const handleChange = (e) => {
    setFormData({
        ...formData,
        [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la conexión con un backend real
    console.log("Enviando mensaje:", formData);
    alert("¡Mensaje enviado con éxito! Nos pondremos en contacto a la brevedad.");
    
    // Limpiar formulario
    setFormData({
        nombre: '',
        apellido: '',
        email: '',
        asunto: '',
        mensaje: ''
    });
  };

  return (
    <div className="contact-container">
      
      <div className="contact-header">
        {/* Icono decorativo similar al de la imagen */}
        <span className="contact-icon-top">🩺</span> 
        <h1 className="contact-title">CONTÁCTANOS</h1>
        <p className="contact-subtitle">
          Estamos aquí para ayudarte. Por favor, completa el siguiente formulario 
          o utiliza la información de contacto para comunicarte con nosotros.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="contact-form">
        
        {/* Fila 1: Nombre y Apellido */}
        <div className="form-row">
            <div className="form-col">
                <label className="form-label">Nombre <span className="required">*</span></label>
                <input 
                    type="text" 
                    name="nombre"
                    className="form-input" 
                    placeholder="Escribe tu nombre..."
                    required
                    value={formData.nombre}
                    onChange={handleChange}
                />
            </div>
            <div className="form-col">
                <label className="form-label">Apellido <span className="required">*</span></label>
                <input 
                    type="text" 
                    name="apellido"
                    className="form-input" 
                    placeholder="Escribe tu apellido..."
                    required
                    value={formData.apellido}
                    onChange={handleChange}
                />
            </div>
        </div>

        {/* Fila 2: Email y Asunto */}
        <div className="form-row">
            <div className="form-col">
                <label className="form-label">E-mail <span className="required">*</span></label>
                <input 
                    type="email" 
                    name="email"
                    className="form-input" 
                    placeholder="Escribe tu dirección de correo..."
                    required
                    value={formData.email}
                    onChange={handleChange}
                />
            </div>
            <div className="form-col">
                <label className="form-label">Asunto <span className="required">*</span></label>
                <select 
                    name="asunto"
                    className="form-select"
                    required
                    value={formData.asunto}
                    onChange={handleChange}
                >
                    <option value="">Seleccione su asunto...</option>
                    <option value="consulta">Consulta General</option>
                    <option value="turnos">Problemas con Turnos</option>
                    <option value="sugerencia">Sugerencias</option>
                    <option value="reclamo">Reclamos</option>
                    <option value="rrhh">Trabaja con Nosotros</option>
                </select>
            </div>
        </div>

        {/* Fila 3: Mensaje */}
        <div className="form-col" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Mensaje <span className="required">*</span></label>
            <textarea 
                name="mensaje"
                className="form-textarea" 
                placeholder="Escribe tu mensaje..."
                required
                value={formData.mensaje}
                onChange={handleChange}
            ></textarea>
        </div>

        <button type="submit" className="btn-send">
            Enviar Mensaje
        </button>

      </form>
    </div>
  );
}