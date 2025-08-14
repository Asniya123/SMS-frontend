import { Route, Routes } from "react-router-dom"
import LoginPage from "../../Pages/student/loginPage"

const StudentRoute = () => {
    return(
        <Routes>
            <Route path="/login" element={<LoginPage />} />
        </Routes>
    )
}

export default StudentRoute