import { Routes, Route } from 'react-router-dom'
import StudentRoutes from './routes/student/studentRoute'
import AdminRoutes from './routes/admin/adminRoute'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/*" element={<StudentRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </div>
  )
}

export default App
