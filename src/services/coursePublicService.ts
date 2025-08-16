import publicAPI from '@/api/publicInstance'
import studentInstance from '@/api/studentInstance'

export const listCourses = async (page = 1, limit = 9, search = '') => {
  const { data } = await publicAPI.get('/auth/courses', { params: { page, limit, search } })
  return data
}

export const getCourseById = async (courseId: string) => {
  const { data } = await publicAPI.get(`/auth/courses/${courseId}`)
  return data
}



export const enrollCourse = async (courseId: string, payload: { userId: string; paymentId: string; orderId: string; amount: number; currency?: string }) => {
  const { data } = await studentInstance.post(`/auth/courses/${courseId}/enroll`, payload)
  return data
}

// export const getMyEnrollments = async (userId: string) => {
//   const { data } = await studentInstance.get('/auth/courses/me/enrollments', { params: { userId } })
//   return data
// }



