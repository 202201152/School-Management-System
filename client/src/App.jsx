import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import StudentsPage from './pages/StudentsPage';
import TasksPage from './pages/TasksPage';
import AnnouncementsPage from './pages/AnnouncementsPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster 
            position="top-center" 
            toastOptions={{
                success: {
                    style: { background: 'var(--primary)', color: '#fff', borderRadius: '1rem', fontWeight: 'bold' }
                },
                error: {
                    style: { background: 'var(--danger)', color: '#fff', borderRadius: '1rem', fontWeight: 'bold' }
                }
            }}
        />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/students" element={<ProtectedRoute><StudentsPage /></ProtectedRoute>} />
          <Route path="/tasks" element={<ProtectedRoute><TasksPage /></ProtectedRoute>} />
          <Route path="/announcements" element={<ProtectedRoute><AnnouncementsPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
