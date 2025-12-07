// src/context/DataContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();
export const useData = () => useContext(DataContext);

// Datos Mock de Médicos (Iniciales)
const initialDoctors = [
  { id: 1, name: "Dr. House", specialty: "Diagnóstico", slots: ["09:00", "10:00", "11:00"] },
  { id: 2, name: "Dra. Grey", specialty: "Cirugía", slots: ["14:00", "15:00", "16:00"] },
];

export const DataProvider = ({ children }) => {
  const [doctors, setDoctors] = useState(initialDoctors);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const storedAppts = JSON.parse(localStorage.getItem('appointments')) || [];
    setAppointments(storedAppts);
  }, []);

  const bookAppointment = (patient, doctor, time) => {
    const newAppointment = {
      id: Date.now(),
      patientName: patient.name,
      patientEmail: patient.email,
      doctorName: doctor.name,
      doctorSpec: doctor.specialty,
      time: time,
      date: "MAÑANA", // Hardcoded según consigna
    };

    const updatedAppts = [...appointments, newAppointment];
    setAppointments(updatedAppts);
    localStorage.setItem('appointments', JSON.stringify(updatedAppts));
    
    // Opcional: Remover el horario disponible del médico visualmente
    return newAppointment;
  };

  return (
    <DataContext.Provider value={{ doctors, appointments, bookAppointment }}>
      {children}
    </DataContext.Provider>
  );
};