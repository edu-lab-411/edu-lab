"use client";
import React from "react";
import Link from "next/link";
import { CirclePlus, Search } from "lucide-react";
import Sidebar from "@/app/home/SideBar";
import JoinCourseCode from "../components/joinCourseCode";
import { usePathname } from "next/navigation";


export default function HomeLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [openJoinCourse, setOpenJoinCourse] = React.useState(false);
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex min-h-screen">
                {/* Left Sidebar */}
                <Sidebar />

                {/* Main Content */}
                <div className="flex-1 bg-gray-50">

                    {/* Top Navigation */}
                    <div className="bg-white shadow-sm py-4 px-8 flex justify-between items-center">
                        <div className="flex space-x-8">
                            <Link
                                href="/home"
                                className={`${
                                    pathname === "/home" 
                                        ? "text-indigo-600 font-medium border-b-2 border-indigo-600 pb-1" 
                                        : "text-gray-600 hover:text-indigo-600 transition-colors"
                                }`}
                            >
                                Courses
                            </Link>
                            <Link
                                href="/home/my-courses"
                                className={`${
                                    pathname === "/home/my-courses" 
                                        ? "text-indigo-600 font-medium border-b-2 border-indigo-600 pb-1" 
                                        : "text-gray-600 hover:text-indigo-600 transition-colors"
                                }`}
                            >
                                My Courses
                            </Link>
                            <Link
                                href="/home/favorite"
                                className={`${
                                    pathname === "/home/favorite" 
                                        ? "text-indigo-600 font-medium border-b-2 border-indigo-600 pb-1" 
                                        : "text-gray-600 hover:text-indigo-600 transition-colors"
                                }`}
                            >
                                Favorite
                            </Link>
                            <Link
                                href="/home/books"
                                className={`${
                                    pathname === "/home/books" 
                                        ? "text-indigo-600 font-medium border-b-2 border-indigo-600 pb-1" 
                                        : "text-gray-600 hover:text-indigo-600 transition-colors"
                                }`}
                            >
                                Books
                            </Link>
                            {/* <Link
                                href="#"
                                className="text-gray-600 hover:text-indigo-600 transition-colors"
                            >
                                Notes
                            </Link> */}
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="bg-gray-50 border border-gray-200 rounded-full py-2 px-4 pl-10 w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                />
                                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            </div>
                            <button 
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed h-[40px]"
                                onClick={() => setOpenJoinCourse(true)}
                            >
                                <CirclePlus size={18} />
                                <span className="font-[18px]">Join Course</span>
                            </button>
                        </div>
                    </div>

                    <div className="">
                        {children}
                    </div>

                </div>
            </div>
            <JoinCourseCode
                openJoinCourse={openJoinCourse}
                setOpenJoinCourse={setOpenJoinCourse}
            />
        </div>
    );
}