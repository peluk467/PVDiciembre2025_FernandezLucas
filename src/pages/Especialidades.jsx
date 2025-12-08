import { useState } from 'react';
import { useData } from '../context/DataContext';
import '../css/Home.css'; // Usamos el CSS de Home que modificaremos abajo

export default function Especialidades() {
  const { doctors } = useData();
  
  // Estado para saber cuál tarjeta se está señalando (null = ninguna)
  const [activeSpec, setActiveSpec] = useState(null);

  // Obtenemos las especialidades únicas
  const especialidadesUnicas = [...new Set(doctors.map(doc => doc.specialty))];

  return (
    <div className="container" style={{ paddingBottom: '4rem' }}>
      
      <div className="specialties-header">
        <h2>Nuestras Especialidades</h2>
        <p>Pase el cursor sobre cada tarjeta para ver el equipo médico disponible.</p>
      </div>

      <div className="specialties-grid">
        {especialidadesUnicas.map(spec => (
          <div 
            key={spec} 
            className={`spec-card-dynamic ${activeSpec === spec ? 'active' : ''}`}
            onMouseEnter={() => setActiveSpec(spec)}
            onMouseLeave={() => setActiveSpec(null)}
          >
            <div className="spec-card-header">
                {/* Icono dinámico según especialidad (opcional, uso genérico por ahora) */}
                <span className="spec-icon">🩺</span>
                <h3>{spec}</h3>
                <span className="arrow-indicator">▼</span>
            </div>

            {/* Lista que se despliega */}
            <div className="spec-body">
                <div className="spec-body-content">
                    <p className="staff-label">Staff Médico:</p>
                    <ul className="medico-list-public">
                    {doctors
                        .filter(doc => doc.specialty === spec)
                        .map(doc => (
                        <li key={doc.id} className="medico-item">
                            <span className="medico-name">{doc.name}</span>
                            {/* Mostramos piso si existe, sino un texto genérico */}
                            <span className="medico-location">
                                {doc.floor ? `(Piso ${doc.floor})` : ''}
                            </span>
                        </li>
                        ))}
                    </ul>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}