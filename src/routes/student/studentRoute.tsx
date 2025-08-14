import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '@/Pages/student/loginPage'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

const StudentRoutes = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.student)

  return (
    <Routes>
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} 
      />
      <Route 
        path="/dashboard" 
        element={isAuthenticated ? <div>Dashboard (Coming Soon)</div> : <Navigate to="/login" replace />} 
      />
      <Route 
        path="/" 
        element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} 
      />
    </Routes>
  )
}

export default StudentRoutes
