import { useData } from '../context/DataContext';
import '../css/Home.css'; // Reusamos estilos

export default function Especialidades() {
  const { doctors } = useData();

  // Obtenemos las especialidades únicas para filtrar
  const especialidadesUnicas = [...new Set(doctors.map(doc => doc.specialty))];

  return (
    <div className="container">
      <h2 style={{ textAlign: 'center', color: '#2c3e50', margin: '2rem 0' }}>
        Nuestras Especialidades y Cuerpo Médico
      </h2>

      <div className="specialties-grid">
        {especialidadesUnicas.map(spec => (
          <div key={spec} className="spec-section">
            <h3 className="spec-title">{spec}</h3>
            <ul className="medico-list-public">
              {doctors
                .filter(doc => doc.specialty === spec)
                .map(doc => (
                  <li key={doc.id}>
                    <strong>{doc.name}</strong>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}