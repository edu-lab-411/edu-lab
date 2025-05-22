"use client"
import { useLayoutEffect, useState } from "react"
import { Check, ChevronLeft, ChevronRight, NotebookPen, BotMessageSquare, ShieldCheck, ClipboardCheck, BookCopy } from "lucide-react"
import { useParams } from "next/navigation"
import "./style.scss"
import Link from "next/link"
import { message } from "antd"
import { useQueryClient } from "react-query"
import Notes from "./notes"
import AskAI from "./askAI"
import FinalTest from "./finalTest"
import { useCourseStore } from "@/app/store/courseStore"
import Content from "./content"

export default function CourseContent() {
    const queryClient = useQueryClient();
    const params = useParams();
    const name = params.name;

    const finishCourse = useCourseStore((state:any) => state.finishCourse);

    const [completedSections, setCompletedSections] = useState<number[]>([])
    const [course, setCourse] = useState<any>(null)
    const [sections, setSections] = useState<any>([])
    const [cur, setCur] = useState(0)
    const [notesOpen, setNotesOpen] = useState(false);
    const [askAIOpen, setAskAIOpen] = useState(false);
    const [doneQuiz, setDoneQuiz] = useState(false);
    const [progress, setProgress] = useState(0);

    useLayoutEffect(()=>{
        if(!name){
            return;
        }
        const courseID = name.toString().split("-");
        const getCourse = async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/course/courseDetails?courseID=${parseInt(courseID[courseID.length - 1], 10)}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            const data = await res.json()
            if (res.ok) {
                setCourse(data.course);
                setProgress(data.progress.progress);
                setSections([...data.sections, {
                    id: -1,
                    section_number: data.sections.length + 1,
                    section_title: "Test your knowledge",
                    section_description: "Test your knowledge with a quiz.",
                    video: null,
                    section_content: null,
                }]);
                const newCompletedSections:any = [];
                if(data.progress.progress >= 0){
                    data.sections.forEach((section:any) => {
                        if(section.section_number < data.progress.progress+1){
                            // console.log("section", section.id);
                            newCompletedSections.push(section.id);
                        }
                        setCur(data.progress.progress);
                    });
                } else {
                    data.sections.forEach((section:any) => newCompletedSections.push(section.id));
                    newCompletedSections.push(-1);
                    setCur(data.sections.length);
                }
                setCompletedSections(newCompletedSections);
                // console.log("cur", data.progress.last_progress);
                // console.log("sections", newCompletedSections);
            } else {
                console.error("Failed to fetch course:", data)
            }
        }
        getCourse()
    },[params])

    const handleNextSection = async() => {
        if (cur > sections.length - 1) {
            return;
        }
        setCur(cur + 1);
        if(completedSections.includes(sections[cur].id)){
            return;
        }
        let completedSectionsTemp:any = [...completedSections, sections[cur].id]
        setCompletedSections(completedSectionsTemp);
        // console.log("completedSections", completedSections);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/course/updateCourseProgress`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    courseID: course.id,
                    progress: cur + 1
                })
            })
            const data = await res.json()
            if (res.ok) {
                message.success("Progress updated successfully");
                queryClient.invalidateQueries({queryKey: ['myCoursesSideBar']});
            } else {
                console.error("Failed to update progress:", data)
            }
        } catch (error) {
            console.error("Error updating progress:", error)
        }
    }
    const handlePrevSection = () => {
        if (cur > 0) {
            setCur(cur - 1)
        }
    }
    const handleStartTest = () => {
        handleNextSection();
        // console.log("completedSections", completedSections);
        // console.log("Start Test");
    }

    const handleFinishCourse = () => {
        if(progress== -1){
            return;
        }
        finishCourse(course.id);
        message.success("Course completed successfully");
        queryClient.invalidateQueries({queryKey: ['myCoursesSideBar']});
        queryClient.invalidateQueries({queryKey: ['courses']});
        window.location.href = "/home";
    }

    return (
        <div className="flex gap-x-6 p-6 flex-wrap max-h-[calc(100vh-74px)] overflow-auto items-start">
            <div className="flex w-[100%] mb-[30px] h-fit">
                <Link href="/home">
                    <ChevronLeft size={30} className="relative top-[4px]" />
                </Link>
                <h3 className="text-left text-[25px] font-bold text-gray-700">
                    {course?.course_name}
                </h3>
            </div>
            <div className="w-full flex gap-2 mb-[20px] justify-between select-none">
                <div className="flex gap-2">
                    {/* <button 
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed h-[40px]"
                    >
                        <BookCopy size={18} />
                        <span className="font-[18px]">Books</span>
                    </button> */}
                    <button 
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed h-[40px]"
                        onClick={() => setNotesOpen(true)}
                    >
                        <NotebookPen size={18} />
                        <span className="font-[18px]">Notes</span>
                    </button>
                    <button 
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed h-[40px]"
                        onClick={() => setAskAIOpen(true)}
                    >
                        <BotMessageSquare size={18} />
                        <span className="font-[18px]">Ask AI</span>
                    </button>
                </div>
                <div className="flex gap-2">
                    <button 
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed h-[40px]"
                        disabled={cur === 0}
                        onClick={()=>handlePrevSection()}
                    >
                        <ChevronLeft size={18} />
                        <span className="font-[18px]">Previous</span>
                    </button>
                    {
                            cur < sections.length - 2 && (
                                <button 
                                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed h-[40px]"
                                    onClick={()=>handleNextSection()}
                                >
                                    <span className="font-[18px]">Next</span>
                                    <ChevronRight size={18} />
                                </button>
                            )
                    }
                    {
                        cur === sections.length - 2  && (
                            <button 
                                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md shadow-sm hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed h-[40px]"
                                onClick={handleStartTest}
                            >
                                <ShieldCheck size={18} />
                                <span className="font-[18px]">Start Test</span>
                            </button>
                        )
                    }
                    {
                        (cur === sections.length - 1 && progress!=-1) && (
                            <button 
                                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md shadow-sm hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed h-[40px]"
                                onClick={handleFinishCourse}
                                disabled={!doneQuiz}
                            >
                                <ClipboardCheck size={18} />
                                <span className="font-[18px]">Finish Course</span>
                            </button>
                        )
                    }
                </div>
            </div>
            <div className="w-[300px] bg-white shadow-md h-fit p-4 rounded-md">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[20px] font-semibold text-gray-700">Sections</h3>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full font-medium">{sections.length}</span>
                </div>
                <div className="sections">
                    {sections.map((section:any, index:any) => (
                        <div key={index} className="flex mb-2 select-none py-2 rounded-md" onClick={() => {console.log("ok")}}>
                            <div
                                // className={`w-5 h-5 rounded border flex items-center justify-start cursor-pointer mr-[10px] ${
                                // completedSections.includes(section.id) ? "bg-indigo-500 border-indigo-500" : "border-gray-300"
                                // }`}
                                className={`
                                    w-5 h-5 rounded-[30px] border
                                    flex items-center justify-start
                                    mr-[10px] border-gray-300
                                    transition-all duration-200
                                    ${completedSections.includes(section.id) ? "bg-indigo-500 border-indigo-500" : ""}
                                    ${cur === index ? "bg-indigo-500 border-indigo-500" : ""}
                                `}
                            >
                                {completedSections?.includes(section.id) ? (
                                    <Check size={18} className="text-white" />
                                ) : (
                                    <div className="w-full h-full"></div>
                                )}
                            </div>
                            {/* {completedSections?.map((item:any, index:any) => (<p>{item}</p>))} */}
                            {/* <span className="mr-1 text-gray-700">{section.section_number}.</span> */}
                            <span
                                className={`
                                    font-medium text-black transition-all duration-200
                                    ${cur === index ? "text-indigo-500" : "text-gray-700"}
                                `}
                            >
                                {section.section_title}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="w-[calc(100%-324px)] flex flex-wrap h-fit overflow-auto">
                <div 
                    className="w-full" 
                >
                    <h3 className="flex flex-wrap bg-white rounded-md shadow-md p-6 w-full h-fit mb-[20px]">
                        <span className="text-[19px] font-semibold text-gray-700 w-full">
                            {sections[cur]?.section_number}.<> </>
                            {sections[cur]?.section_title}
                        </span>
                        <span className="text-[15px] py-1 font-medium w-full text-[#6b7280]">
                            {sections[cur]?.section_description}
                        </span>
                    </h3>
                    
                    {cur == sections.length - 1 && course
                        ? (
                            <FinalTest
                                courseID={course?.id}
                                initialSystemMessage={`
                                    Course Name: ${course?.course_name}
                                    Course Description: ${course?.course_description}
                                    Course Sections: ${sections.slice(0, sections.length-1).map((section:any, index:any) => `Section ${index + 1}: ${section.section_title}, Description: ${section.section_description}`).join(", ")}
                                `}
                                setDoneQuiz={setDoneQuiz}
                            />
                        )
                        : <Content 
                            video={sections[cur]?.video_link}
                            content={sections[cur]?.section_content}

                        />
                    }
                </div>
            </div>
            {course && (
                    <>
                        <Notes
                            notesOpen={notesOpen}
                            setNotesOpen={setNotesOpen}
                            courseID={course?.id}
                        />
                        <AskAI
                            askAIOpen={askAIOpen}
                            setAskAIOpen={setAskAIOpen}
                            courseID={course?.id}
                            courseName={course?.course_name}
                            courseDescription={course?.course_description}
                            courseSections={
                                sections.map((section:any) => {
                                    return {
                                        title: section.section_title,
                                        description: section.section_description,
                                    }
                                })
                            }
                        />
                    </>
                )
            }
        </div>
    )
}
