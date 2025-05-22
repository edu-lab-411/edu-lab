"use client"
import { Settings, LogOut, ChevronRight, BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import useAuthStore from "../store/authStore";
import { useQuery } from "react-query";

const sideBar = () => {
    const userData:any = useAuthStore((state:any) => state.userData);
    const logout = useAuthStore((state:any) => state.logout);

        const {data:courses, isLoading, error} = useQuery({
            queryKey: ['myCoursesSideBar'],
            queryFn: () => fetch(`${process.env.NEXT_PUBLIC_API_URL}/course/coursesList`,{
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }).then(res => res.json()),
            enabled: !!userData,
            refetchOnWindowFocus: false,
        })

    return (
        <div className="w-72 bg-white shadow-lg z-10">
            <div className="p-6 border-b border-gray-100 px-[15px] py-[9px]">
                <Link href={"/home"} className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-400 text-transparent bg-clip-text">
                    <Image
                        src="/logo3.png"
                        alt="wessAcademy logo"
                        width={180}
                        height={69}
                        className="object-contain w-[145px]"
                    />
                </Link>
            </div>

            <div className="flex flex-col items-center py-8">
                <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center mb-[5px] text-white text-xl font-medium shadow-md">
                        {userData?.username?.slice(0, 2).toUpperCase() || ""}
                    </div>
                    <div className="absolute bottom-3 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                </div>

                <div className="text-gray-800 font-medium text-lg mb-1">{userData?.username}</div>
                <div className="text-gray-500 text-sm mb-6 capitalize">{userData?.major?.replace(/-/g, " ")}</div>

                <Link
                    href="/home/settings" 
                    className="w-48 py-2.5 px-4 mb-3 text-gray-700 bg-[#f0f1f27a] hover:bg-gray-100 rounded-lg flex items-center transition-all outline-none"
                >
                    <Settings size={18} className="mr-3 text-indigo-500" />
                    <span>Settings</span>
                    <ChevronRight size={16} className="ml-auto text-gray-400" />
                </Link>

                <button className="w-48 py-2.5 px-4 text-gray-700 bg-[#f0f1f27a] hover:bg-gray-100 rounded-lg flex items-center transition-all outline-none" onClick={logout}>
                    <LogOut size={18} className="mr-3 text-indigo-500" />
                    <span>Logout</span>
                    <ChevronRight size={16} className="ml-auto text-gray-400" />
                </button>
            </div>

            {/* My Courses Section */}
            <div className="w-full px-6">
                <div className="flex items-center mb-4">
                    <BookOpen size={18} className="text-indigo-500 mr-2" />
                    <h3 className="text-gray-700 font-medium">My Courses</h3>
                </div>
                {isLoading && (
                    <div className="flex flex-col items-center gap-3">
                        <div className="relative w-8 h-8">
                            <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-200 rounded-full"></div>
                            <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                        </div>
                    </div>
                )}
                {error && <div className="text-center text-red-500">Error loading courses</div>}
                {courses?.myCourses && courses?.myCourses?.map((course: any, idx: number) => (
                    <Link href={`/home/course-${course?.course_name.split(" ").join("-").toLowerCase()}-${course?.course_id}`} className="mb-4" key={idx}>
                        <div className="flex items-center mb-2">
                            <div className="w-10 h-10 rounded-md overflow-hidden mr-3 flex-shrink-0">
                                <div className="w-full h-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs">
                                    {course?.course_name?.slice(0, 1).toUpperCase() || ""}
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="text-sm font-medium text-gray-700">{course?.course_name}</div>
                                <div className="flex items-center mt-1">
                                    <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                                        <div 
                                            className="bg-indigo-500 h-full rounded-full transition-all duration-200" 
                                            style={{ width: `${course?.progress == -1 ? 100 : Math.floor(course?.progress / course?.total_section * 100)}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-xs text-gray-500 ml-2">
                                        {course?.progress == -1
                                            ? "100"
                                            : Math.floor(course?.progress / course?.total_section * 100)
                                        }
                                        %
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
                {(!isLoading&&courses?.myCourses?.length > 0) 
                    ? <Link
                        href="/all-courses"
                        className="text-indigo-600 text-sm font-medium flex items-center justify-center mt-2 hover:text-indigo-700"
                    >
                        View all courses <ChevronRight size={14} className="ml-1" />
                    </Link>
                    : <div className="text-center text-gray-500 text-[15px]"></div>
                }
            </div>

            <div className="absolute bottom-4 left-6 text-gray-400 text-sm">
                © 2025 wessAcademy
            </div>
        </div>
    )
}

export default sideBar