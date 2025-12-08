import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Especialidades from './pages/Especialidades';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import './css/global.css';
import Contacto from './pages/Contacto'; // <--- IMPORTAR
function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <div className="app-layout">
            <Navbar />
            
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/especialidades" element={<Especialidades />} />
              
              {/* --- NUEVA RUTA AQUÍ --- */}
              <Route path="/contacto" element={<Contacto />} />
              {/* ----------------------- */}

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