import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

// Importamos las páginas nuevas
import Home from './pages/Home';
import Especialidades from './pages/Especialidades';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

import './css/global.css';

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <div className="app-layout">
            <Navbar />
            
            <Routes>
              {/* Ruta principal ahora es Home */}
              <Route path="/" element={<Home />} />
              
              {/* Nueva ruta pública */}
              <Route path="/especialidades" element={<Especialidades />} />

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
              
              {/* Si ponen cualquier cosa, vuelve al inicio */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </div>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;