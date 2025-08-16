import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import AdminLoginPage from '@/Pages/admin/loginPage'
import AdminDashboard from '@/components/admin/AdminDashboard'

const AdminRoutes = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.admin)

  return (
    <Routes>
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/admin/dashboard" replace /> : <AdminLoginPage />} 
      />
      <Route 
        path="/dashboard" 
        element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" replace />} 
      />
      <Route 
        path="/students" 
        element={isAuthenticated ? <div>Student Management (Coming Soon)</div> : <Navigate to="/login" replace />} 
      />
      <Route 
        path="/teachers" 
        element={isAuthenticated ? <div>Teacher Management (Coming Soon)</div> : <Navigate to="/login" replace />} 
      />
      <Route 
        path="/courses" 
        element={isAuthenticated ? <div>Course Management (Coming Soon)</div> : <Navigate to="/login" replace />} 
      />
      <Route 
        path="/profile" 
        element={isAuthenticated ? <div>Admin Profile (Coming Soon)</div> : <Navigate to="/login" replace />} 
      />
      <Route 
        path="/" 
        element={<Navigate to={isAuthenticated ? "/admin/dashboard" : "/admin/login"} replace />} 
      />
      
    </Routes>
  )
}

export default AdminRoutes
