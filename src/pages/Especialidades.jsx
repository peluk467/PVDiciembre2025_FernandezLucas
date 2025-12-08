import { useState } from 'react';
import { useData } from '../context/DataContext';
import '../css/Home.css';

export default function Especialidades() {
  const { doctors } = useData();
  
  const [activeSpec, setActiveSpec] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // <--- Nuevo Estado

  // 1. FILTRADO: Primero filtramos los médicos que coincidan con la búsqueda
  const filteredDoctors = doctors.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    doc.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 2. AGRUPACIÓN: Calculamos las especialidades SOLO de los médicos filtrados
  // Esto hace que si buscas un médico, desaparezcan las especialidades vacías
  const especialidadesVisibles = [...new Set(filteredDoctors.map(doc => doc.specialty))];

  return (
    <div className="container" style={{ paddingBottom: '4rem' }}>
      
      <div className="specialties-header">
        <h2>Nuestras Especialidades</h2>
        <p>Busque a su profesional por nombre o explore nuestras áreas.</p>
        
        {/* --- BARRA DE BÚSQUEDA --- */}
        <div className="search-wrapper">
            <input 
                type="text" 
                placeholder="🔍 Buscar médico o especialidad..." 
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        {/* ------------------------- */}
      </div>

      {especialidadesVisibles.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#777' }}>No se encontraron profesionales con ese nombre.</p>
      ) : (
        <div className="specialties-grid">
            {especialidadesVisibles.map(spec => (
            <div 
                key={spec} 
                className={`spec-card-dynamic ${activeSpec === spec || searchTerm ? 'active' : ''}`}
                // Si hay búsqueda, dejamos las tarjetas abiertas ('active') para ver los resultados rápido
                onMouseEnter={() => !searchTerm && setActiveSpec(spec)}
                onMouseLeave={() => !searchTerm && setActiveSpec(null)}
            >
                <div className="spec-card-header">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span className="spec-icon">🩺</span>
                        <h3>{spec}</h3>
                    </div>
                    {/* Ocultamos la flecha si estamos buscando, porque ya está abierto */}
                    {!searchTerm && <span className="arrow-indicator">▼</span>}
                </div>

                <div className="spec-body">
                    <div className="spec-body-content">
                        <p className="staff-label">Staff Médico:</p>
                        <ul className="medico-list-public">
                        {filteredDoctors
                            .filter(doc => doc.specialty === spec)
                            .map(doc => (
                            <li key={doc.id} className="medico-item">
                                <span className="medico-name">{doc.name}</span>
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
      )}
    </div>
  );
}