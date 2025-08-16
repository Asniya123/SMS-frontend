// import { useEffect, useState } from 'react'
// import { getMyEnrollments } from '@/services/coursePublicService'
// import Cookies from 'js-cookie'

// export default function Enrollments() {
//   const [items, setItems] = useState<any[]>([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     (async () => {
//       const userId = Cookies.get('userId') || ''
//       if (!userId) return setLoading(false)
//       try {
//         const res = await getMyEnrollments(userId)
//         setItems(res.enrollments || [])
//       } finally {
//         setLoading(false)
//       }
//     })()
//   }, [])

//   if (loading) return <div className="p-6">Loading...</div>

//   return (
//     <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
//       {items.map((e) => (
//         <div key={e.orderId} className="border p-4 rounded">
//           <div className="font-semibold">Order: {e.orderId}</div>
//           <div>Amount: ₹{e.amount} {e.currency}</div>
//           <div className="mt-2 text-sm text-gray-600">{new Date(e.enrolledAt).toLocaleString()}</div>
//         </div>
//       ))}
//       {items.length === 0 && <div>No enrollments yet.</div>}
//     </div>
//   )
// }



