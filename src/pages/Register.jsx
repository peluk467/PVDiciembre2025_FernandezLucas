// src/pages/Register.jsx
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useForm } from '../hooks/useForm';
import { useNavigate, Link } from 'react-router-dom';
import '../css/Auth.css';

export default function Register() {
  const { register } = useAuth();
  const { addDoctor } = useData();
  const navigate = useNavigate();

  const [formValues, handleInputChange] = useForm({
    nombre: '',
    apellido: '',
    dni: '',
    email: '',
    password: '',
    role: 'paciente',
    legajo: '',
    especialidad: '',
    piso: '',        
    consultorio: ''  
  });

  // --- NUEVA LÓGICA: Filtro para evitar números en Nombre y Apellido ---
  const handleNameChange = (e) => {
    // Reemplaza cualquier dígito (0-9) por un espacio vacío en tiempo real
    e.target.value = e.target.value.replace(/[0-9]/g, '');
    // Llama al manejador original para actualizar el estado
    handleInputChange(e);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if(formValues.password.length < 4) {
        alert("La contraseña debe tener al menos 4 caracteres");
        return;
    }
    
    if(formValues.role === 'medico') {
        if(formValues.legajo.length < 3) {
            alert("Legajo inválido");
            return;
        }
        // Validamos que complete la ubicación
        if(!formValues.piso || !formValues.consultorio) {
            alert("Por favor indique Piso y Consultorio");
            return;
        }
    }

    const userData = {
        ...formValues,
        name: `${formValues.nombre} ${formValues.apellido}`
    };

    const success = register(userData);
    
    if (success) {
      if (formValues.role === 'medico') {
        addDoctor({
            name: userData.name,
            specialty: formValues.especialidad,
            floor: formValues.piso,         
            office: formValues.consultorio  
        });
      }
      alert('¡Registro exitoso! Bienvenido al sistema.');
      navigate('/login');
    } else {
      alert('El correo electrónico ya está registrado.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Crear Cuenta</h2>
        <form onSubmit={handleSubmit}>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <div className="form-group" style={{ flex: 1 }}>
                <label>Nombre/s:</label>
                {/* Aplicamos el handleNameChange en lugar del original */}
                <input 
                  type="text" 
                  name="nombre" 
                  required 
                  value={formValues.nombre} 
                  onChange={handleNameChange} 
                />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
                <label>Apellido/s:</label>
                {/* Aplicamos el handleNameChange en lugar del original */}
                <input 
                  type="text" 
                  name="apellido" 
                  required 
                  value={formValues.apellido} 
                  onChange={handleNameChange} 
                />
            </div>
          </div>

          <div className="form-group">
            <label>DNI:</label>
            <input type="number" name="dni" required value={formValues.dni} onChange={handleInputChange} />
          </div>
          
          <div className="form-group">
            <label>Correo electrónico:</label>
            <input type="email" name="email" required value={formValues.email} onChange={handleInputChange} />
          </div>

          <div className="form-group">
            <label>Contraseña:</label>
            <input type="password" name="password" required value={formValues.password} onChange={handleInputChange} />
          </div>

          <div className="form-group">
            <label>Rol:</label>
            <select name="role" value={formValues.role} onChange={handleInputChange}>
                <option value="paciente">Paciente</option>
                <option value="medico">Médico / Especialista</option>
            </select>
          </div>

          {formValues.role === 'medico' && (
             <div className="medico-fields" style={{ animation: 'fadeIn 0.5s', padding: '15px', background: '#f9f9f9', borderRadius: '4px', borderLeft: '4px solid #e74c3c' }}>
                <h4 style={{marginTop: 0, color: '#c0392b'}}>Datos Profesionales</h4>
                
                <div className="form-group">
                    <label>Número de Legajo:</label>
                    <input type="text" name="legajo" required placeholder="Ej: MN-12345" value={formValues.legajo} onChange={handleInputChange} />
                </div>

                <div className="form-group">
                    <label>Especialidad:</label>
                    <select name="especialidad" required value={formValues.especialidad} onChange={handleInputChange} style={{ border: '1px solid #e74c3c' }}>
                        <option value="">-- Seleccione --</option>
                        <option value="Clínica Médica">Clínica Médica</option>
                        <option value="Cardiología">Cardiología</option>
                        <option value="Pediatría">Pediatría</option>
                        <option value="Dermatología">Dermatología</option>
                        <option value="Neurología">Neurología</option>
                        <option value="Kinesiología">Kinesiología</option>
                    </select>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label>Piso:</label>
                        <input type="text" name="piso" required placeholder="Ej: 2" value={formValues.piso} onChange={handleInputChange} />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label>Consultorio:</label>
                        <input type="text" name="consultorio" required placeholder="Ej: 2C" value={formValues.consultorio} onChange={handleInputChange} />
                    </div>
                </div>

             </div>
          )}

          <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>Registrarse</button>
        </form>
        <p className="redirect-text">
          ¿Ya tienes cuenta? <Link to="/login">Ingresa aquí</Link>
        </p>
      </div>
    </div>
  );
}