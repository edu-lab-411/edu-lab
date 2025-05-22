from fastapi import HTTPException
from db import database
from models.user import users
from models.course import course, userCourse, courseSections, majorsTable
from sqlalchemy import select, func
import re
import random


# Get Total Users, Courses, and Majors
async def getTotal():
    try:
        numberUsers = await database.fetch_val(select(func.count()).select_from(users))
        numberCourses = await database.fetch_val(select(func.count()).select_from(course))

        if numberUsers is None or numberCourses is None:
            raise HTTPException(status_code=404, detail="Could not fetch counts")
        
        total = {
            "users": numberUsers,
            "courses": numberCourses
        }

        return total
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# Major Statistics
async def getMajorStatistics():
    try:
        query = select(users.c.major, func.count()).group_by(users.c.major)
        majorStatistics = await database.fetch_all(query)

        if majorStatistics is None:
            raise HTTPException(status_code=404, detail="Could not fetch major statistics")
        
        return majorStatistics
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# Course Enrollment
async def getCourseEnrollment():
    try:
        query = (
            select(
                course.c.course_name,
                func.count(userCourse.c.user_id).label("enrollment_count")
            )
            .join(userCourse, course.c.id == userCourse.c.course_id)
            .group_by(course.c.id, course.c.course_name)
            .order_by(func.count(userCourse.c.user_id).desc())
            .limit(5)
        )

        course_enrollment = await database.fetch_all(query)

        if course_enrollment is None:
            raise HTTPException(status_code=404, detail="Could not fetch course enrollment")
        
        return course_enrollment
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Majors
async def getMajors():
    try:
        query = select(majorsTable.c.major_name)
        majors = await database.fetch_all(query)
        if majors is None:
            raise HTTPException(status_code=404, detail="Could not fetch majors")
        return majors
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Get All Courses
async def getAllCourses():
    try:
        query = select(course)
        allCourses = await database.fetch_all(query)

        if allCourses is None:
            raise HTTPException(status_code=404, detail="Could not fetch courses")
        
        return allCourses
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Delete Course
async def deleteCourse(course_id: int):
    try:
        query = userCourse.delete().where(userCourse.c.course_id == course_id)
        await database.execute(query)
        
        query = courseSections.delete().where(courseSections.c.course_id == course_id)
        await database.execute(query)

        # if result is None:
        #     raise HTTPException(status_code=404, detail="Could not delete course sections")

        query = course.delete().where(course.c.id == course_id)
        await database.execute(query)

        # print(result)
        
        # if result is None:
        #     raise HTTPException(status_code=404, detail="Could not delete course")
        
        return {"message": "Course deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Add Course
def generateCourseCode(course_name: str):
    words = re.sub(r'[^\w\s]', '', course_name).split()
    if len(words) == 1:
        code = words[0][:3]
    else:
        code = ''.join(word[0] for word in words[:len(words)])
    num_chars = 10 - len(code)
    if num_chars > 0:
        code += ''.join(str(random.randint(0, 9)) for _ in range(min(num_chars, 7)))
    return code.lower()

async def addCourse(course_data: dict):
    try:
        query = course.insert().values(
            course_image=course_data["courseImage"],
            course_name=course_data["title"],
            course_description=course_data["description"],
            course_major=course_data["majors"],
            course_code=generateCourseCode(course_data["title"])
        )
        result = await database.execute(query)

        if result is None:
            raise HTTPException(status_code=404, detail="Could not add course")

        for section in course_data["sections"]:
            query = courseSections.insert().values(
                course_id=result,
                section_number=section["number"],
                section_title=section["title"],
                section_description=section["description"],
                section_content=section["content"],
                video_link=section["video"]
            )
            await database.execute(query)
        
        return {"message": "Course added successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Get Users
async def getUsers():
    try:
        query = select(users.c.id, users.c.username, users.c.email, users.c.major, users.c.created_at, users.c.blocked)
        allUsers = await database.fetch_all(query)

        if allUsers is None:
            raise HTTPException(status_code=404, detail="Could not fetch users")
        
        return allUsers
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Block User
async def blockUser(user_id: int):
    try:
        query = users.update().where(users.c.id == user_id).values(blocked=True)
        await database.execute(query)
        
        return {"message": "User blocked successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Unblock User
async def unblockUser(user_id: int):
    try:
        query = users.update().where(users.c.id == user_id).values(blocked=False)
        await database.execute(query)
        
        return {"message": "User unblocked successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Get Course Details
async def getCourseDetails(course_id: str):
    try:
        courseDetails = await database.fetch_one(select(course).where(course.c.id == int(course_id)))
        if courseDetails is None:
            raise HTTPException(status_code=404, detail="Could not fetch course details")
        
        sections_data = await database.fetch_all(
            select(courseSections).where(courseSections.c.course_id == int(course_id)).order_by(courseSections.c.section_number)
        )

        return {
            "courseDetails": courseDetails,
            "courseSections": sections_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))






