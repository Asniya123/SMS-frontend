import { Routes, Route } from 'react-router-dom'
import StudentRoutes from './routes/student/studentRoute'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/*" element={<StudentRoutes />} />
      </Routes>
    </div>
  )
}

export default App
