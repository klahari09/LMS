import React from 'react'
import Hero from '../../components/student/Hero'
import Companies from '../../components/student/Companies'
import CoursesSection from '../../components/student/CoursesSection'
import TestimonialsSection from '../../components/student/TestimonialsSection'
import CalltoAction from '../../components/student/CalltoAction'
import Footer from '../../components/student/Footer'

const Home = () => {
  return (
    <div className='flex flex-col items-center space-y-7 text-center'>
      <div className="w-full bg-gradient-to-b from-cyan-100/70 via-white to-white">
      <Hero />
      <Companies />
      </div>
        <CoursesSection/>
        <TestimonialsSection/>
        <CalltoAction />
        <Footer />
    </div>
  )
}

export default Home