import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { initializeAdmin } from '@/redux/slice/adminSlice'
import AdminLoginForm from '@/components/admin/loginForm'

const AdminLoginPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((state: RootState) => state.admin)

  useEffect(() => {
    // Initialize admin state from localStorage
    dispatch(initializeAdmin())
  }, [dispatch])

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard')
    }
  }, [isAuthenticated, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-red-600 rounded-full flex items-center justify-center">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Admin Access
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your administrator account
          </p>
        </div>
        
        <AdminLoginForm />
        
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Need help?{' '}
            <a href="#" className="font-medium text-red-600 hover:text-red-500">
              Contact system administrator
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default AdminLoginPage


