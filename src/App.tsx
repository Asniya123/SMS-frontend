import { Route, Routes } from "react-router-dom"
import StudentRoute from "./routes/student/studentRoute"

const App = () => {
    return (
        <Routes>
            <Route path="/*" element={<StudentRoute />} />
        </Routes>
    )
}

export default App