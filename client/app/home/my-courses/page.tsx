"use client"
import { ChevronRight, Copy } from 'lucide-react'
import useAuthStore from '../../store/authStore'
import { useQuery } from 'react-query';
import Image from 'next/image';
import { message } from 'antd';
import Link from 'next/link';
import axios from 'axios';

const MyCourses = () => {
    const userData:any = useAuthStore((state:any) => state.userData);

    const {data:courses, isLoading, isRefetching, error} = useQuery({
        queryKey: ['courses'],
        queryFn: async()=>{
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/course/coursesList`,{
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            });
            return res.data;
        },
        enabled: !!userData,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    })

    return (
        <div className="h-[calc(100vh-74px)] overflow-auto">
            <div className="px-8 pt-8 pb-4">
                <h1 className="text-2xl font-bold text-gray-800">My Courses</h1>
                <p className="text-gray-500 mt-1">
                    View your enrolled courses and track progress. Resume learning where you left off.
                </p>
            </div>

            <div className="flex flex-wrap p-8 gap-6">
                {isLoading || isRefetching &&(
                    <div className="w-full flex justify-center items-center py-8">
                        <div className="flex flex-col items-center gap-3">
                            <div className="relative w-12 h-12">
                                <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-200 rounded-full"></div>
                                <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                            </div>
                            <p className="text-indigo-600 font-medium">Loading courses...</p>
                        </div>
                    </div>
                )}
                {error && <div className="text-center text-red-500">Error loading courses</div>}
                {(courses?.myCourses && (!isRefetching && !isLoading)) && courses?.myCourses?.map((course: any, idx: number) => (
                    <div 
                        className="relative bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-auto h-auto w-[360px]"
                        key={idx}
                    >
                        <Image
                            src={course?.course_image}
                            alt="Course Image"
                            width={360}
                            height={200}
                            className="w-full h-[200px] object-cover rounded-t-xl"
                        />
                        <span className='w-fit text-xs font-semibold bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 px-3 py-1.5 rounded-full mb-3 border border-indigo-300 shadow-sm flex absolute top-2 left-2'>
                            <span className="mr-1 opacity-70">Code:</span> {course?.course_code}
                            <Copy
                                size={13}
                                className='ml-[10px] relative top-[2px] cursor-pointer'
                                onClick={() => {
                                    navigator.clipboard.writeText(course?.course_code);
                                    message.success("Course code copied to clipboard");
                                }}
                            />
                        </span>
                        <div className="p-5 min-h-[165px] relative pb-[70px]">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                {course?.course_name}
                            </h3>
                            <p className="text-gray-600 text-sm">
                                {course?.course_description}
                            </p>
                        </div>
                        <div className="absolute bottom-[10px] left-[18px] w-[90%] flex-wrap">
                            <div className='w-full flex justify-between items-center'>
                                <span className={`
                                        text-xs font-medium bg-amber-50 px-2 py-1 rounded-full
                                        ${
                                            course?.status === 'Completed'
                                            ?'text-indigo-600 bg-indigo-100'
                                            :'text-amber-600 bg-amber-100'
                                        }
                                    `}>
                                    {course?.status}
                                </span>
                                <Link href={`/home/course-${course?.course_name.split(" ").join("-").toLowerCase()}-${course?.course_id}`} className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center cursor-pointer">
                                    {
                                        course?.status === 'completed' ? 'View' : 'Continue'
                                    }
                                    <ChevronRight size={16} className="ml-1" />
                                </Link>
                            </div>
                            <div className="flex items-center mt-[8px]">
                                <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                                    <div 
                                        className="bg-indigo-500 h-full rounded-full transition-all duration-200" 
                                        style={{ width: `
                                            ${course?.progress == -1 ? 100 : Math.floor(course?.progress / course?.total_section * 100)}%
                                        ` }}
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
                ))}
            </div>
        </div>
    )
}

export default MyCourses