from fastapi import APIRouter
from controllers import admin_controller

router = APIRouter()

###### Overview Page ######
# Get Total Users, Courses, and Majors
@router.get("/get_total")
async def getTotal():
    return await admin_controller.getTotal()

# Major Statistics
@router.get("/get_major_statistics")
async def getMajorStatistics():
    return await admin_controller.getMajorStatistics()

# Course Enrollment
@router.get("/get_course_enrollment")
async def getCourseEnrollment():
    return await admin_controller.getCourseEnrollment()

# Majors
@router.get("/get_majors")
async def getMajors():
    return await admin_controller.getMajors()

###### Course Page ######
# Get All Courses
@router.get("/get_all_courses")
async def getAllCourses():
    return await admin_controller.getAllCourses()

# Delete Course
@router.delete("/delete_course/{course_id}")
async def deleteCourse(course_id: int):
    return await admin_controller.deleteCourse(course_id)

# Add Course
@router.post("/add_course")
async def addCourse(course: dict):
    return await admin_controller.addCourse(course)

@router.get("/courseDetails/{course_id}")
async def getCourseDetails(course_id: str):
    return await admin_controller.getCourseDetails(course_id)


###### Users Page ######
# Get Users
@router.get("/get_users")
async def getUsers():
    return await admin_controller.getUsers()

# Block User
@router.put("/block_user/{user_id}")
async def blockUser(user_id: int):
    return await admin_controller.blockUser(user_id)

# Unblock User
@router.put("/unblock_user/{user_id}")
async def unblockUser(user_id: int):
    return await admin_controller.unblockUser(user_id)