// src/context/DataContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();
export const useData = () => useContext(DataContext);

// --- BASE DE DATOS INICIAL ---
const initialDoctors = [
  { id: 1, name: "Dr. Carlos Bravo", specialty: "Clínica Médica", floor: "1", office: "101", slots: ["08:00", "09:00", "10:00", "11:00"] },
  { id: 2, name: "Dr. Jamal Bazan", specialty: "Clínica Médica", floor: "1", office: "102", slots: ["14:00", "15:00", "16:00", "17:00"] },
  { id: 3, name: "Dra. Cristina Carmen", specialty: "Cardiología", floor: "2", office: "205", slots: ["09:00", "10:00", "11:00", "12:00"] },
  { id: 4, name: "Dr. Roberto Rodriguez", specialty: "Cardiología", floor: "2", office: "206", slots: ["14:00", "15:00", "16:00"] },
  { id: 5, name: "Dra. Andres Gomez", specialty: "Pediatría", floor: "PB", office: "05", slots: ["09:00", "10:00", "11:00"] },
  { id: 6, name: "Dr. Luis Perez", specialty: "Dermatología", floor: "3", office: "310", slots: ["15:00", "16:00", "17:00"] },
  { id: 7, name: "Dr. Gustavo Lopez", specialty: "Neurología", floor: "3", office: "315", slots: ["10:00", "11:00", "12:00"] },
  { id: 8, name: "Lic. Fernanda Bravo", specialty: "Kinesiología", floor: "PB", office: "GYM", slots: ["13:00", "14:00", "15:00"] },
];

export const DataProvider = ({ children }) => {
  const [doctors, setDoctors] = useState(() => {
    const storedDocs = localStorage.getItem('doctors');
    return storedDocs ? JSON.parse(storedDocs) : initialDoctors;
  });

  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const storedAppts = JSON.parse(localStorage.getItem('appointments')) || [];
    setAppointments(storedAppts);
  }, []);

  useEffect(() => {
    localStorage.setItem('doctors', JSON.stringify(doctors));
  }, [doctors]);

  const addDoctor = (newDocData) => {
    const newDoctor = {
      id: Date.now(),
      name: newDocData.name,
      specialty: newDocData.specialty,
      floor: newDocData.floor,
      office: newDocData.office,
      slots: ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00"]
    };
    setDoctors([...doctors, newDoctor]);
  };

  const bookAppointment = (patient, doctor, time) => {
    const newAppointment = {
      id: Date.now(),
      patientName: patient.name,
      patientEmail: patient.email,
      patientDNI: patient.dni,
      doctorName: doctor.name,
      doctorSpec: doctor.specialty,
      doctorLocation: `Piso ${doctor.floor} - Cons. ${doctor.office}`,
      time: time,
      date: "MAÑANA",
    };

    const updatedAppts = [...appointments, newAppointment];
    setAppointments(updatedAppts);
    localStorage.setItem('appointments', JSON.stringify(updatedAppts));
    
    // Eliminar slot del médico
    const updatedDoctors = doctors.map(doc => {
        if (doc.id === doctor.id) {
            return {
                ...doc,
                slots: doc.slots.filter(slot => slot !== time)
            };
        }
        return doc;
    });
    setDoctors(updatedDoctors);

    return newAppointment;
  };

  // --- NUEVA FUNCIÓN: CANCELAR TURNO ---
  const cancelAppointment = (appointmentId) => {
    // 1. Buscamos el turno antes de borrarlo para saber qué horario y médico restaurar
    const appointmentToCancel = appointments.find(app => app.id === appointmentId);
    
    if (!appointmentToCancel) return;

    // 2. Borramos el turno de la lista de turnos
    const updatedAppts = appointments.filter(app => app.id !== appointmentId);
    setAppointments(updatedAppts);
    localStorage.setItem('appointments', JSON.stringify(updatedAppts));

    // 3. Devolvemos el horario al médico
    const updatedDoctors = doctors.map(doc => {
        // Buscamos al médico por nombre (ya que es único en este ejemplo)
        if (doc.name === appointmentToCancel.doctorName) {
            // Agregamos el horario y ordenamos la lista para que quede prolijo
            const newSlots = [...doc.slots, appointmentToCancel.time].sort();
            return {
                ...doc,
                slots: newSlots
            };
        }
        return doc;
    });
    setDoctors(updatedDoctors);
  };

  return (
    // Agregamos cancelAppointment al value
    <DataContext.Provider value={{ doctors, appointments, bookAppointment, addDoctor, cancelAppointment }}>
      {children}
    </DataContext.Provider>
  );
};