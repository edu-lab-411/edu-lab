"use client"
import { Button, Input, message, Modal } from 'antd'
import React from 'react'
import { useCourseStore } from "../store/courseStore";

type Props = {
    openJoinCourse: boolean
    setOpenJoinCourse: (openJoinCourse: boolean) => void
}

function JoinCourseCode({openJoinCourse, setOpenJoinCourse}:Props) {
    const searchCourseByCode = useCourseStore((state:any) => state.searchCourseByCode);
    const joinCourse = useCourseStore((state:any) => state.joinCourse);
    const [courseCode, setCourseCode] = React.useState<string>('');
    const [courseData, setCourseData] = React.useState<any>("");

    const handleSearchCourse = async() => {
        if(!courseCode.length) {
            return;
        }
        const res = await searchCourseByCode(courseCode);
        if(res.success) {
            setCourseData(res.course);
        } else {
            setCourseData(null);
        }
    }

    const handleJoinCourse= async() => {
        if(!courseData) {
            return;
        }
        const res = await joinCourse(courseData.id);
        if(res.success) {
            setOpenJoinCourse(false);
            setCourseCode('');
            setCourseData(null);
        } else {
            message.error(res.message);
        }
    }

    return (
        <Modal
            open={openJoinCourse}
            onOk={()=>{}}
            onCancel={()=>{
                setOpenJoinCourse(false);
                setCourseCode('');
                setCourseData("");
            }}
            footer={null}
            width={800}
            centered
            style={{ 
                top: 0,
                height: '90vh',
            }}
        >
            <div className="flex flex-col h-full p-6 pt-0">
                <h2 className="text-2xl font-semibold mb-6 text-[#222]">Join a Course</h2>
                <div className="flex gap-2 mb-8">
                    <Input
                        placeholder="Enter course code"
                        className="flex-1"
                        style={{
                            fontSize: '16px',
                            borderRadius: '8px',
                            padding: '10px 16px',
                            border: '1px solid #e5e7eb',
                            backgroundColor: '#f9fafb',
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                        }}
                        value={courseCode}
                        onChange={(e) => setCourseCode(e.target.value)}
                    />
                    <Button 
                        type="primary" 
                        className="bg-indigo-600 hover:bg-indigo-700 transition-colors text-white"
                        style={{
                            height: '45px',
                            width: '100px',
                            fontSize: '16px',
                            borderRadius: '8px',
                        }}
                        onClick={handleSearchCourse}
                    >
                        Search
                    </Button>
                </div>
                
                {courseData && (
                    <div className="flex border border-gray-200 rounded-lg p-4 shadow-sm">
                        <div className="w-1/3">
                            <img 
                                src={courseData?.course_image}
                                alt="Course" 
                                className="w-full h-48 object-cover rounded-md"
                            />
                        </div>
                        <div className="w-2/3 pl-6 flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-semibold mb-2">{courseData?.course_name}</h3>
                                <p className="text-gray-600 mb-4">{courseData?.course_description}</p>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {courseData?.course_major.split(", ").map((tag:any, idx:number) => (
                                        <span key={idx} className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-sm">{tag}</span>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="flex justify-end">
                                <button
                                    className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition"
                                    onClick={handleJoinCourse}
                                >
                                    Join Course
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {courseData==null && (
                    <div className="flex justify-center items-center h-full">
                        <p className="text-gray-500 text-[18px]">No course found with this code.</p>
                    </div>
                )}
            </div>
        </Modal>
    )
}

export default JoinCourseCode