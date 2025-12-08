import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import BackButton from './components/BackButton'; // <--- IMPORTAMOS EL BOTÓN
import Home from './pages/Home';
import Especialidades from './pages/Especialidades';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Contacto from './pages/Contacto';
import './css/global.css';

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <div className="app-layout">
            <Navbar />
            
            {/* --- AGREGAMOS EL BOTÓN FLOTANTE AQUÍ --- */}
            <BackButton />
            {/* ---------------------------------------- */}
            
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/especialidades" element={<Especialidades />} />
              <Route path="/contacto" element={<Contacto />} />
              
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } 
              />
              
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </div>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;