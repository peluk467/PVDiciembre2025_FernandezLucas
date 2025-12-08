// src/components/Footer.jsx
import '../css/Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear(); // Año automático (2025, 2026...)

  return (
    <footer className="main-footer">
      <p>
        © Hospital Fernández {currentYear}. Todos los derechos reservados <br />
        Desarrollado por <strong>Fernandez Ocampo Lucas Adrián</strong>
      </p>
    </footer>
  );
}