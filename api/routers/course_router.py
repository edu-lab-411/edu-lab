from urllib import request
from fastapi import APIRouter, Depends, HTTPException
# from app.schemas.auth_schema import UserSignup, UserSignin
from controllers import course_controller
from utils.security import auth_required

router = APIRouter()

# Get Courses
@router.get("/coursesList")
async def get_courses(userID=Depends(auth_required)):
    return await course_controller.getCourses(userID)

# Enroll Course
@router.post("/enrollCourse")
async def enroll_course(courseID: int, userID=Depends(auth_required)):
    return await course_controller.enrollCourse(courseID, userID)

# Get Course Details
@router.get("/courseDetails")
async def get_course_details(courseID: int, userID=Depends(auth_required)):
    return await course_controller.getCourseDetails(courseID,userID)

# Update Course Progress
@router.put("/updateCourseProgress")
async def update_course_progress(request: dict, userID=Depends(auth_required)):
    return await course_controller.updateCourseProgress(request.get("courseID"), request.get("progress"), userID)

# Add Note
@router.post("/addNote")
async def add_note(request: dict, userID=Depends(auth_required)):
    return await course_controller.addNote(request.get("courseID"), request.get("note"), userID)

# Get Notes
@router.get("/getNotes")
async def get_notes(courseID: int, userID=Depends(auth_required)):
    return await course_controller.getNotes(courseID, userID)

# Delete Note
@router.delete("/deleteNote")
async def delete_note(request: dict, userID=Depends(auth_required)):
    return await course_controller.deleteNote(request.get("noteID"),request.get("courseID"), userID)

#  Ask AI
@router.post("/askAI")
async def ask_ai(request: dict, userID=Depends(auth_required)):
    return await course_controller.askAI(request.get("courseID"), request.get("messages"))

# Generate Final Test
@router.post("/generateFinalTest")
async def generate_final_test(request: dict, userID=Depends(auth_required)):
    return await course_controller.generateFinalTest(request.get("initialSystemMessage"))

# Finish Course
@router.post("/finishCourse")
async def finish_course(request: dict, userID=Depends(auth_required)):
    courseID = request.get("courseID")
    return await course_controller.finishCourse(courseID,userID)

# Get Course By Code
@router.post("/getCourseByCode")
async def get_course_by_code(request: dict, userID=Depends(auth_required)):
    return await course_controller.getCourseByCode(request.get("courseCode"))

# Join Course Per Code
@router.post("/joinCoursePerCode")
async def join_course_per_code(request: dict, userID=Depends(auth_required)):
    return await course_controller.joinCoursePerCode(request.get("courseID"), userID)