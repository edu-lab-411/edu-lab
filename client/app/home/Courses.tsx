"use client"
import { BookmarkPlus, ChevronRight, Copy, Star } from 'lucide-react'
import useAuthStore from '../store/authStore'
import { useQuery, useQueryClient } from 'react-query';
import Image from 'next/image';
import { message, Tooltip } from 'antd';
import Link from 'next/link';
import axios from 'axios';
import { useCourseStore } from '../store/courseStore';
import { useEffect } from 'react';
import { useFavoriteStore } from '../store/favoriteStore';
import { useBooksStore } from '../store/booksStore';

const Courses = () => {
    const queryClient = useQueryClient();
    const userData:any = useAuthStore((state:any) => state.userData);
    const addFavoriteCourse = useFavoriteStore((state:any) => state.addFavoriteCourse);
    const removeFavoriteCourse = useFavoriteStore((state:any) => state.removeFavoriteCourse);
    const getFavorites = useFavoriteStore((state:any) => state.getFavorites);
    const favorites = useFavoriteStore((state:any) => state.favorites);

    // console.log("User data", userData);
    // console.log("Favorite courses", myFavoriteCourses);

    useEffect(()=>{
        if(userData?.id){
            getFavorites(userData?.id);
        }
    },[])

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

    const handleEnrollCourse = async(courseID:number) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/course/enrollCourse?courseID=${courseID}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            });
            const data = await res.json();
            if (res.ok) {
                // message.success("Successfully enrolled in course!");
                console.log(courses);
                queryClient.invalidateQueries({ queryKey: ['courses'] });
                queryClient.invalidateQueries({ queryKey: ['myCoursesSideBar'] });
            } else {
                console.error("Failed to enroll in course:", data);
            }
        } catch(error) {
            console.error("Error enrolling in course:", error);
        }
    }

    const handleAddFavorite = async(courseID:number) => {
        await addFavoriteCourse(userData?.id, courseID);
    }

    const handleRemoveFavorite = async(favoriteId:string) => {
        await removeFavoriteCourse(favoriteId);
    }

    return (
        <div className="h-[calc(100vh-74px)] overflow-auto">
            {/* Page Title */}
            <div className="px-8 pt-8 pb-4">
                <h1 className="text-2xl font-bold text-gray-800">Hi <span className='capitalize text-indigo-600'>{userData?.username}</span></h1>
                <p className="text-gray-500 mt-1">
                    Good to see you! Let’s study.
                </p>
            </div>
            {/* Content Grid */}
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
                        {favorites.has(course?.course_id)
                            ? <Tooltip title="Remove From Favorite">
                                <button 
                                    className='absolute top-2 right-2 p-1.5 bg-indigo-700 rounded-full shadow-sm hover:shadow hover:bg-indigo-700 transition-all duration-200 border border-indigo-200'
                                    onClick={() => handleRemoveFavorite(favorites.get(course?.course_id))}
                                >
                                    <BookmarkPlus size={18} className="text-white" />
                                </button>
                            </Tooltip>
                            : <Tooltip title="Add To Favorite">
                                <button 
                                    className='absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-sm hover:shadow hover:bg-gray-50 transition-all duration-200 border border-indigo-200'
                                    onClick={() => handleAddFavorite(course?.course_id)}
                                >
                                    <BookmarkPlus size={18} className="text-indigo-600" />
                                </button>
                            </Tooltip>
                        }
                    </div>
                ))}
                {(courses?.courses && (!isRefetching && !isLoading)) && courses?.courses?.map((course: any, idx: number) => (
                    <div 
                        className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-auto w-[360px] h-auto relative"
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
                        <div className="p-5 min-h-[165px] relative pb-[60px]">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                {course?.course_name}
                            </h3>
                            <p className="text-gray-600 text-sm">
                                {course?.course_description}
                            </p>
                        </div>
                        <div className="flex justify-center items-center absolute bottom-[10px] left-[18px] w-[90%]">
                            <button 
                                className="px-[30px] py-[9px] rounded-[4px] bg-[#6665f1] text-white font-medium text-sm flex items-center transition-all duration-2000"
                                onClick={() => handleEnrollCourse(course?.id)}
                            >
                                Start
                            </button>
                        </div>
                        {favorites.has(course?.id)
                            ? <Tooltip title="Remove From Favorite">
                                <button 
                                    className='absolute top-2 right-2 p-1.5 bg-indigo-700 rounded-full shadow-sm hover:shadow hover:bg-indigo-700 transition-all duration-200 border border-indigo-200'
                                    onClick={() => handleRemoveFavorite(favorites.get(course?.id))}
                                >
                                    <BookmarkPlus size={18} className="text-white" />
                                </button>
                            </Tooltip>
                            : <Tooltip title="Add To Favorite">
                                <button 
                                    className='absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-sm hover:shadow hover:bg-gray-50 transition-all duration-200 border border-indigo-200'
                                    onClick={() => handleAddFavorite(course?.id)}
                                >
                                    <BookmarkPlus size={18} className="text-indigo-600" />
                                </button>
                            </Tooltip>
                        }
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Courses