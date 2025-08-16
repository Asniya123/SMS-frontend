import { useEffect, useState } from 'react'
import { listCourses } from '@/services/coursePublicService'
import { Link } from 'react-router-dom'

export default function CourseList() {
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const res = await listCourses(1, 12)
        setCourses(res.courses || [])
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((c) => (
        <div key={c._id} className="border rounded-lg overflow-hidden shadow">
          <img src={c.imageUrl} alt={c.courseTitle} className="w-full h-40 object-cover" />
          <div className="p-4">
            <h3 className="font-semibold text-lg">{c.courseTitle}</h3>
            <p className="text-primary font-bold mt-2">₹{c.regularPrice}</p>
            <Link to={`/courses/${c._id}`} className="mt-3 inline-block bg-blue-600 text-white px-4 py-2 rounded">Buy now</Link>
          </div>
        </div>
      ))}
    </div>
  )
}



