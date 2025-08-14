import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import LoginForm from '@/components/student/loginForm'

const LoginPage = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector((state: RootState) => state.student)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-primary-600 rounded-full flex items-center justify-center">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your student account
          </p>
        </div>
        
        <LoginForm />
        
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Don't have an account?{' '}
            <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
              Contact your administrator
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
