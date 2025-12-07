// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

// Componente para proteger rutas
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <div className="app-layout">
            <nav style={{padding: '1rem', background: '#eee'}}>
                <h1>Sistema de Salud</h1>
                {/* Aquí podrías agregar un botón de Logout accediendo al contexto */}
            </nav>
            
            <Routes>
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
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </div>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;