import React from 'react'

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About SMS Learning</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We are dedicated to providing high-quality education accessible to everyone, everywhere.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            At SMS Learning, we believe that education should be accessible, engaging, and effective. 
            Our mission is to empower learners worldwide by providing comprehensive, high-quality courses 
            that help them achieve their personal and professional goals.
          </p>
        </div>

        {/* Values Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Values</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Quality education accessible to all</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Innovation in learning methodologies</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Student success and satisfaction</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Continuous improvement and growth</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">What We Offer</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>Diverse course catalog</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>Expert instructors</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>Flexible learning schedules</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>Certification upon completion</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Team</h2>
          <p className="text-lg text-gray-700 mb-8">
            Our team consists of passionate educators, developers, and professionals dedicated to 
            creating the best learning experience for our students.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl text-gray-600">👨‍💼</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Management Team</h3>
              <p className="text-gray-600">Leading our vision and strategy</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl text-gray-600">👨‍🏫</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Instructors</h3>
              <p className="text-gray-600">Creating quality educational content</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl text-gray-600">👨‍💻</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Development Team</h3>
              <p className="text-gray-600">Building the platform you love</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
