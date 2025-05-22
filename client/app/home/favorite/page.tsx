"use client"
import { BookmarkPlus, ChevronRight, Copy } from 'lucide-react'
import useAuthStore from '../../store/authStore'
import { useQuery, useQueryClient } from 'react-query';
import Image from 'next/image';
import { message, Tooltip } from 'antd';
import Link from 'next/link';
import axios from 'axios';
import { useState } from 'react';
import { useFavoriteStore } from '@/app/store/favoriteStore';

const Favorite = () => {
    const queryClient = useQueryClient();
    const userData:any = useAuthStore((state:any) => state.userData);
    const favorites = useFavoriteStore((state:any) => state.favorites);
    const removeFavoriteCourse = useFavoriteStore((state:any) => state.removeFavoriteCourse);
    const [courses, setCourses] = useState<any>(null);

    const {data, isLoading, isRefetching, error} = useQuery({
        queryKey: ['favoriteCourses', favorites],
        queryFn: async()=>{
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/course/coursesList`,{
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            });
            const responseData = res.data;
            console.log(favorites);
            setCourses([
                ...responseData.courses?.filter((course:any) => favorites.has(course.id)),
                ...responseData.myCourses?.filter((course:any) => favorites.has(course.course_id))
            ]);
            console.log([
                ...responseData.courses?.filter((course:any) => favorites.has(course.id)),
                ...responseData.myCourses?.filter((course:any) => favorites.has(course.course_id))
            ]);
            return responseData;
        },
        enabled: !!userData,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    })

    const handleRemoveFavorite = async(favoriteId:string) => {
        await removeFavoriteCourse(favoriteId);
        // setTimeout(()=>{
        //     queryClient.invalidateQueries({ queryKey: ['favoriteCourses'] });
        // },3000)
    }

    return (
        <div className="h-[calc(100vh-74px)] overflow-auto">
            <div className="px-8 pt-8 pb-4">
                <h1 className="text-2xl font-bold text-gray-800">Favorite Courses</h1>
                <p className="text-gray-500 mt-1">
                    View your favorite courses and track progress. Resume learning where you left off.
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
                {(courses && (!isRefetching && !isLoading)) && courses?.map((course: any, idx: number) => (
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
                        <div className="p-5 min-h-[165px] relative">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                {course?.course_name}
                            </h3>
                            <p className="text-gray-600 text-sm">
                                {course?.course_description}
                            </p>
                        </div>
                        <Tooltip title="Remove From Favorite">
                            <button 
                                className='absolute top-2 right-2 p-1.5 bg-indigo-700 rounded-full shadow-sm hover:shadow hover:bg-indigo-700 transition-all duration-200 border border-indigo-200'
                                onClick={() => handleRemoveFavorite(favorites.get(course?.id||course?.course_id))}
                            >
                                <BookmarkPlus size={18} className="text-white" />
                            </button>
                        </Tooltip>
                    </div>
                ))}
                {(courses && (!isRefetching && !isLoading)) && courses?.length === 0 && (
                    <div className="w-full flex justify-center items-center py-8">
                        <div className="flex flex-col items-center gap-3">
                            <BookmarkPlus size={40} className="text-indigo-600" />
                            <p className="text-gray-600 font-medium">No favorite courses found</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Favorite