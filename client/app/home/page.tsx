"use client";
import { usePathname } from 'next/navigation';
import Courses from "./Courses";
import Settings from './settings/page';

export default function Home() {
    const pathname = usePathname();
    return (
        <div className="">
            {pathname === '/home' && <Courses />}
            {pathname === '/settings' && <Settings />}
            {/* {pathname === '/home/courseContent' && <CourseContent />} */}
        </div>
    );
}
