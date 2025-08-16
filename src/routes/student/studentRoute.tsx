import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Header from '@/components/Header';
import LoginPage from '@/Pages/student/loginPage';
import Home from '@/Pages/Home';
import About from '@/Pages/About';
import Contact from '@/Pages/Contact';
import CourseList from '@/Pages/student/CourseList';
import CourseDetail from '@/Pages/student/CourseDetail';
import StudentLeaveManagement from '@/Pages/student/studentLEaveManagement';

const StudentRoutes = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.student);

  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
        />
        <Route
          path="/*"
          element={
            <>
              <Header />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/courses" element={<CourseList />} />
                <Route path="/courses/:courseId" element={<CourseDetail />} />
                <Route
                  path="/leave"
                  element={
                    isAuthenticated ? (
                      <StudentLeaveManagement />
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  }
                />
              </Routes>
            </>
          }
        />
      </Routes>
    </>
  );
};

export default StudentRoutes;