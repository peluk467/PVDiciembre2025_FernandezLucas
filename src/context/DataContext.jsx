import { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();
export const useData = () => useContext(DataContext);

// --- BASE DE DATOS INICIAL ---
const initialDoctors = [
  { id: 1, name: "Dr. Carlos Bravo", specialty: "Clínica Médica", floor: "1", office: "1B", status: "available", slots: ["08:00", "09:00", "10:00", "11:00"] },
  { id: 2, name: "Dr. Alejandro Bazan", specialty: "Clínica Médica", floor: "1", office: "1A", status: "available", slots: ["14:00", "15:00", "16:00", "17:00"] },
  { id: 3, name: "Dra. Cristina Carmen", specialty: "Cardiología", floor: "2", office: "2D", status: "available", slots: ["09:00", "10:00", "11:00", "12:00"] },
  { id: 4, name: "Dr. Roberto Rodriguez", specialty: "Cardiología", floor: "2", office: "2C", status: "available", slots: ["14:00", "15:00", "16:00"] },
  { id: 5, name: "Dra. Andres Gomez", specialty: "Pediatría", floor: "PB", office: "0D", status: "available", slots: ["09:00", "10:00", "11:00"] },
  { id: 6, name: "Dr. Luis Perez", specialty: "Dermatología", floor: "3", office: "3D", status: "available", slots: ["15:00", "16:00", "17:00"] },
  { id: 7, name: "Dr. Gustavo Lopez", specialty: "Neurología", floor: "3", office: "3F", status: "available", slots: ["10:00", "11:00", "12:00"] },
  { id: 8, name: "Lic. Fernanda Bravo", specialty: "Kinesiología", floor: "PB", office: "GYM", status: "available", slots: ["13:00", "14:00", "15:00"] },
];

// Proveedor del contexto de datos
export const DataProvider = ({ children }) => {

  const [doctors, setDoctors] = useState(() => { 
    const storedDocs = localStorage.getItem('doctors'); 
    return storedDocs ? JSON.parse(storedDocs) : initialDoctors; 
  });

  const [appointments, setAppointments] = useState([]); 

  const [messages, setMessages] = useState(() => {
    const storedMsgs = localStorage.getItem('messages');
    return storedMsgs ? JSON.parse(storedMsgs) : [];
  });

  useEffect(() => { 
    const storedAppts = JSON.parse(localStorage.getItem('appointments')) || []; 
    setAppointments(storedAppts); 
  }, []);

  useEffect(() => {
    localStorage.setItem('doctors', JSON.stringify(doctors)); 
  }, [doctors]);

  useEffect(() => {
    localStorage.setItem('messages', JSON.stringify(messages));
  }, [messages]);

  // Función para crear mensajes
  const addMessage = (recipientIdentifier, text) => {
    const newMessage = {
        id: Date.now() + Math.random(), 
        recipient: recipientIdentifier, 
        text: text,
        date: new Date().toLocaleString(),
        read: false, // <--- NUEVO: El mensaje nace como "no leído"
    };
    setMessages(prev => [newMessage, ...prev]); 
  };

  // --- NUEVA FUNCIÓN: Marcar mensajes como leídos ---
  const markAsRead = (recipientIdentifier) => {
    setMessages(prev => prev.map(msg => 
        msg.recipient === recipientIdentifier ? { ...msg, read: true } : msg
    ));
  };

  const addDoctor = (newDocData) => { 
    const newDoctor = { 
      id: Date.now(),
      name: newDocData.name, 
      specialty: newDocData.specialty, 
      floor: newDocData.floor, 
      office: newDocData.office,
      status: 'available', 
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

    // Mensaje al Médico
    addMessage(doctor.name, 
        `Hospital Fernandez:\nEl paciente "${patient.name}" con el DNI: "${patient.dni}", reservó un turno con Usted el dia de MAÑANA a las "${time}" hs en el consultorio "Piso ${doctor.floor}" "Consultorio ${doctor.office}".`
    );

    // Mensaje al Paciente
    addMessage(patient.email,
        `Hospital Fernandez:\nUsted reservó un turno con el Medico/Especialista: "${doctor.name}" DNI: ${patient.dni} a hs "${time}" en el consultorio "Piso ${doctor.floor}" "Consultorio ${doctor.office}".`
    );

    return newAppointment;
  };

  const cancelAppointment = (appointmentId) => {
    const appointmentToCancel = appointments.find(app => app.id === appointmentId);
    if (!appointmentToCancel) return;

    const updatedAppts = appointments.filter(app => app.id !== appointmentId); 
    setAppointments(updatedAppts); 
    localStorage.setItem('appointments', JSON.stringify(updatedAppts)); 

    const updatedDoctors = doctors.map(doc => {
        if (doc.name === appointmentToCancel.doctorName) {
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

  const toggleDoctorStatus = (doctorName) => {
    const doctor = doctors.find(d => d.name === doctorName);
    const isGoingToLicense = doctor && doctor.status === 'available';

    if (isGoingToLicense) {
        const doctorAppointments = appointments.filter(app => app.doctorName === doctorName);
        
        if (doctorAppointments.length > 0) {
            const confirmMsg = `Usted tiene ${doctorAppointments.length} turnos asignados. Se enviarán notificaciones de cancelación a los pacientes. ¿Continuar?`;
            if (!window.confirm(confirmMsg)) return;
            
            doctorAppointments.forEach(app => {
                addMessage(app.patientEmail,
                  `Hospital Fernandez:\nEl turno que Usted reservó con el Medico/Especialista: "${app.doctorName}" a hs "${app.time}" en el consultorio "${app.doctorLocation}" ha sido cancelado, posteriormente será reprogramado hasta nuevo aviso.`
                );
            });
        }
    }

    const updatedDoctors = doctors.map(doc => {
        if (doc.name === doctorName) {
            return {
                ...doc,
                status: doc.status === 'available' ? 'license' : 'available'
            };
        }
        return doc;
    });
    setDoctors(updatedDoctors);
  };

  return (
    // Agregamos 'markAsRead' al value
    <DataContext.Provider value={{ doctors, appointments, messages, bookAppointment, addDoctor, cancelAppointment, toggleDoctorStatus, markAsRead }}>
      {children}
    </DataContext.Provider>
  );
};