"use client"
import Image from "next/image"
import Link from "next/link"
import { CheckCircle, Bell, ArrowRight, BookOpen, Users, Award, Lightbulb } from "lucide-react"
import { useRef } from "react";
import { Signin } from "@/app/components/signin"
import { Signup } from "@/app/components/signup"

export default function Home() {
  const signInModel = useRef(null);
  const signUpModel = useRef(null);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-indigo-500 bg-gradient-to-br from-indigo-400 to-indigo-600">
        <div className="bg-white overflow-hidden shadow-xl">
          {/* Main content area */}
          <div className="grid grid-cols-1 lg:grid-cols-2 h-[100vh]">
            {/* Left column */}
            <div className="p-8 lg:p-12 h-[100vh] relative">
              <div className="mb-16">
                <Image
                  src="/logo3.png"
                  alt="wessAcademy logo"
                  width={180}
                  height={69}
                  className="h-12 w-[180px] h-[69px] object-contain"
                />
              </div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-max">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                  A good <span className="text-indigo-500">education</span> <br />
                  is a foundation for <br />
                  better future
                </h1>
                <p className="mt-6 text-gray-600 max-w-md">
                  A community with high expectation and high academic achievement
                </p>
                <div className="mt-8">
                  <button
                    className="inline-block px-8 py-3 bg-indigo-500 text-white font-medium rounded-lg hover:bg-indigo-600 transition-all duration-200 outline-none"
                    onClick={()=>{
                      if (signInModel.current) {
                        signInModel.current.showModal();
                      }
                    }}
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </div>
            {/* Right column */}
            <div className="bg-indigo-500 p-8 lg:p-12 relative h-[100vh]">
              {/* Navigation */}
              <nav className="flex justify-end items-center space-x-6 text-white mb-8 ">
                {/* <a href="#about-us" className="hover:text-indigo-200 transition-all duration-200">
                  About us
                </a>
                <a href="#services" className="hover:text-indigo-200 transition-all duration-200">
                  Service
                </a> */}
                {/* <Link href="/" className="hover:text-indigo-200 transition-all duration-200">
                  Courses
                </Link>
                <Link href="/" className="hover:text-indigo-200 transition-all duration-200">
                  Courses
                </Link> */}
                <div className="flex justify-end items-center space-x-2 text-white">
                  <button
                    onClick={()=>{
                      if (signInModel.current) {
                        signInModel.current.showModal();
                      }
                    }}
                    className="px-4 py-2 bg-white text-indigo-600 font-medium rounded-lg hover:bg-gray-100 transition-all duration-200"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={()=>{
                      if (signUpModel.current) {
                        signUpModel.current.showModal();
                      }
                    }}
                    className="px-4 py-2 bg-white text-indigo-600 font-medium rounded-lg hover:bg-gray-100 transition-all duration-200"
                  >
                    Sign up
                  </button>
                </div>
              </nav>
              {/* Student image and notifications */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="absolute -left-16 top-1/4 bg-white p-4 rounded-xl shadow-lg z-10 flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-amber-500" />
                  <span className="text-sm font-medium">Get 20% offer</span>
                </div>

                <div className="bg-white rounded-3xl p-6 max-w-sm mx-auto relative w-[385px] h-[400px]">
                  <Image
                    src="/home.jpg"
                    width={385}
                    height={400}
                    alt="Student with books"
                    className="rounded-2xl w-[100%] h-[100%]"
                  />

                  <div className="absolute -right-12 top-8 bg-white p-4 rounded-xl shadow-lg">
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Congratulation</p>
                        <p className="text-xs text-gray-500">Your admission completed</p>
                      </div>
                    </div>
                  </div>

                  <div className="absolute -right-8 bottom-16 bg-white p-3 rounded-xl shadow-lg">
                    <div className="w-16 h-16 flex flex-col items-center justify-center">
                      <span className="text-xs font-medium text-gray-900">Skills</span>
                      <svg className="w-10 h-6 mt-1" viewBox="0 0 40 24">
                        <path
                          d="M0,20 Q10,23 20,15 T40,12"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="text-indigo-500"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Services Section */}
          <section id="services" className="py-16 px-8">
            <div className="container mx-auto max-w-6xl">
              <h2 className="text-3xl font-bold mb-12 text-center text-gray-900">Our Services</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="bg-indigo-100 p-3 rounded-lg w-fit mb-6">
                    <BookOpen className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Online Courses</h3>
                  <p className="text-gray-600 mb-6">
                    Access to a wide variety of courses taught by experienced instructors, available anytime and anywhere.
                  </p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="bg-indigo-100 p-3 rounded-lg w-fit mb-6">
                    <Award className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Certifications</h3>
                  <p className="text-gray-600 mb-6">
                    Earn industry-recognized certificates to boost your resume and demonstrate your expertise.
                  </p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="bg-indigo-100 p-3 rounded-lg w-fit mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-indigo-600">
                      <path d="M12 20h9"></path>
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Skill Assessments</h3>
                  <p className="text-gray-600 mb-6">
                    Evaluate your strengths and areas for improvement with our comprehensive assessment tools.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Core Values Section */}
          <section className="py-16 px-8">
            <div className="container mx-auto max-w-6xl">
              <h2 className="text-3xl font-bold mb-12 text-center text-gray-900">Our Core Values</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
                      <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                      <line x1="6" y1="1" x2="6" y2="4"></line>
                      <line x1="10" y1="1" x2="10" y2="4"></line>
                      <line x1="14" y1="1" x2="14" y2="4"></line>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Excellence</h3>
                  <p className="text-gray-600">We strive for the highest standards in everything we do, from course creation to student support.</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                      <line x1="9" y1="9" x2="9.01" y2="9"></line>
                      <line x1="15" y1="9" x2="15.01" y2="9"></line>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Inclusivity</h3>
                  <p className="text-gray-600">We believe that education should be accessible to all, regardless of location, background, or financial means.</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
                      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Innovation</h3>
                  <p className="text-gray-600">We continuously evolve our teaching methods and platform to ensure the best learning experience.</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Community</h3>
                  <p className="text-gray-600">We foster a supportive environment where students and educators can connect, collaborate, and grow together.</p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-indigo-500 bg-gradient-to-br from-indigo-400 to-indigo-600 py-16 px-8 text-white">
            <div className="container mx-auto max-w-6xl text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to start your learning journey?</h2>
              <p className="text-indigo-100 max-w-2xl mx-auto mb-8">
                Join thousands of students who have already advanced their education and careers with WessAcademy.
              </p>
              <button 
                className="inline-block px-8 py-3 bg-white text-indigo-600 font-medium rounded-lg hover:bg-gray-100 transition-all duration-200"
                onClick={()=>{
                  if (signUpModel.current) {
                    signUpModel.current.showModal();
                  }
                }}
              >
                Get Started Today
              </button>
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-gray-900 text-white py-12 px-8">
            <div className="container mx-auto max-w-6xl">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-6 md:mb-0">
                  <Image
                    src="/logo3.png"
                    alt="wessAcademy logo"
                    width={150}
                    height={58}
                    className="h-10 w-[150px] h-[58px] object-contain p-1 rounded"
                  />
                  <p className="text-gray-400 mt-2">A foundation for a better future</p>
                </div>
                <div className="flex flex-wrap gap-8">
                <p className="text-gray-400">© {new Date().getFullYear()} WessAcademy. All rights reserved.</p>
                </div>
              </div>
            </div>
          </footer>

          {/* Auth */}
          <dialog ref={signInModel} id="signInModel" className="modal">
            <div className="modal-box">
              <Signin onClose={()=>{
                if (signInModel.current) {
                  signInModel.current.close();
                }
              }} />
            </div>
          </dialog>

          <dialog ref={signUpModel} id="signUpModel" className="modal">
            <div className="modal-box">
              <Signup onClose={()=>{
                if (signUpModel.current) {
                  signUpModel.current.close();
                }
              }} />
            </div>
          </dialog>
        </div>
      </div>
    </div>
  )
}

