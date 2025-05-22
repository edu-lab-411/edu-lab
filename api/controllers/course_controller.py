from fastapi import HTTPException
from db import database
from models.user import users
from models.course import course, userCourse, courseSections, courseNotes
from sqlalchemy import select, update
import utils.groq as groq
import utils.Quiz as Quiz
import json


# Get Courses
async def getCourses(userID):
    query = select(users).where(users.c.id == userID)
    db_user = await database.fetch_one(query)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    user_major = db_user["major"]

    query = select(course).where(course.c.course_major.like(f"%{user_major}%"))
    db_courses = await database.fetch_all(query)

    # query = (
    #     select(
    #         course,
    #         courseProgress.c.last_progress,
    #         courseProgress.c.total_sections,
    #         userCourse
    #     )
    #     .join(userCourse, userCourse.c.course_id == course.c.id)
    #     .join(courseProgress, (courseProgress.c.course_id == course.c.id) & (courseProgress.c.user_id == userID))
    #     .where(userCourse.c.user_id == userID)
    #     .order_by(courseProgress.c.last_progress.desc())
    # )
    
    query = (
        select(
            course,
            userCourse
        )
        .join(userCourse, userCourse.c.course_id == course.c.id)
        .where(userCourse.c.user_id == userID)
        .order_by(userCourse.c.progress.desc())
    )
    db_user_courses = await database.fetch_all(query)

    db_courses = [
        course for course in db_courses
        if course["id"] not in {user_course["course_id"] for user_course in db_user_courses}
    ]
    return {"courses":db_courses,"myCourses":db_user_courses}
    # return {
    #     "myCourses": db_user_courses,
    # }

# Enroll Course
async def enrollCourse(courseID, userID):

    query = select(courseSections).where(courseSections.c.course_id == courseID)
    db_sections = await database.fetch_all(query)

    query = userCourse.insert().values(
        user_id=userID,
        course_id=courseID,
        progress=0,
        status="In Progress",
        total_section=len(db_sections)+1
    )
    save = await database.execute(query)
    if not save:
        raise HTTPException(status_code=500, detail="Course enrollment failed")
    
    # query = select(courseSections).where(courseSections.c.course_id == courseID)
    # db_sections = await database.fetch_all(query)
    # query = courseProgress.insert().values(
    #     user_id=userID,
    #     course_id=courseID,é'"(&-è_ç)"
    #     last_progress=0,
    #     total_sections=len(db_sections)+1
    # )
    # save = await database.execute(query)
    if not save:
        raise HTTPException(status_code=500, detail="Course progress initialization failed")

    return {"message": "Course enrolled successfully"}

# Get Course Details
async def getCourseDetails(courseID, userID):
    query = select(course).where(course.c.id == courseID)
    db_course = await database.fetch_one(query)
    if not db_course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    query = select(courseSections).where(courseSections.c.course_id == courseID).order_by(courseSections.c.section_number)
    db_sections = await database.fetch_all(query)
    if not db_sections:
        raise HTTPException(status_code=404, detail="Course sections not found")
    
    query = select(userCourse).where((userCourse.c.course_id == courseID) & (userCourse.c.user_id == userID))
    db_courseUser = await database.fetch_one(query)
    if not db_courseUser:
        raise HTTPException(status_code=404, detail="Course progress not found")

    return {
        "course":db_course,
        "sections":db_sections,
        "progress":db_courseUser
    }

# Update Course Progress
async def updateCourseProgress(courseID, progress, userID):
    # query = update(courseProgress).where((courseProgress.c.course_id == courseID) & (courseProgress.c.user_id == userID)).values(
    #     last_progress=progress
    # )
    query = (
        update(userCourse)
        .where((userCourse.c.course_id == courseID) & (userCourse.c.user_id == userID))
        .values(
            progress=progress
        )
    )
    save = await database.execute(query)
    print(save)
    return {"message": "Course progress updated successfully"}

# Add Note
async def addNote(courseID, note, userID):
    query = courseNotes.insert().values(
        user_id=userID,
        course_id=courseID,
        note_content=note
    )
    save = await database.execute(query)
    if not save:
        raise HTTPException(status_code=500, detail="Note addition failed")
    return {"message": "Note added successfully"}

# Get Notes
async def getNotes(courseID, userID):
    query = select(courseNotes).where((courseNotes.c.course_id == courseID) & (courseNotes.c.user_id == userID))
    db_notes = await database.fetch_all(query)
    print(db_notes)
    return db_notes or []

# Delete Note
async def deleteNote(noteID, courseID, userID):
    query = courseNotes.delete().where((courseNotes.c.id == noteID) & (courseNotes.c.course_id == courseID) & (courseNotes.c.user_id == userID))
    save = await database.execute(query)
    return {"message": "Note deleted successfully"}

# Ask AI
async def askAI(courseID, messages):
    return groq.get_response(messages)

# Generate Final Test
async def generateFinalTest(initialSystemMessage):
    messages = [
        {
            "role": "system",
            "content": initialSystemMessage
        },
        {
            "role": "user",
            "content": """
                Generate a final quiz for the course with 10 questions. Each question must have a "question" field and an "options" array. Each option must include the "text" of the option and a boolean "is_correct" flag to indicate whether it is correct.

                Return the result as a valid and complete JSON array of question objects, ensuring no missing fields or syntax errors. Do not include any explanation or additional text — only return the JSON object.

                Example format:
                [
                    {
                        "question": "What is the capital of France?",
                        "options": [
                            { "text": "Paris", "is_correct": true },
                            { "text": "Berlin", "is_correct": false },
                            { "text": "Madrid", "is_correct": false }
                        ]
                    }
                ]

                Ensure that:
                1. Return ONLY valid JSON without any explanations or additional text.
                2. Each question must have a "question" field and an "options" array.
                3. Each option must include "text" and "is_correct" fields.
                4. The "is_correct" field must be a boolean (true/false).
                5. Ensure proper JSON syntax:
                    - All strings must have opening and closing quotes
                    - All objects must have opening and closing braces
                    - All arrays must have opening and closing brackets
                    - No trailing commas
                    - No missing commas between items
                    - Property names must be in double quotes

                Validate your JSON before returning it. DO NOT include any text outside the JSON array.

                return ONLY the requested JSON format without any additional text, explanations, or commentary.

                PLEASE before returning the JSON, validate it to ensure that:
                - All strings have opening and closing quotes
                - All objects have opening and closing braces
                - All arrays have opening and closing brackets
                - No trailing commas
                - No missing commas between items
                - Property names are in double quotes
            """
        }
    ]
    return groq.get_response(messages)
    
    # return Quiz.generate_quiz(initialSystemMessage)

# Finish Course
async def finishCourse(courseID, userID):
    query = update(userCourse).where((userCourse.c.course_id == courseID) & (userCourse.c.user_id == userID)).values(
        status="Completed",
        progress=-1
    )
    await database.execute(query)
    return {"message": "Course completed successfully"}

# Get Course By Code
async def getCourseByCode(courseCode):
    query = select(course).where(course.c.course_code == courseCode)
    db_course = await database.fetch_one(query)
    if not db_course:
        return {"success": False, "message": "Course not found"}
    return {
        "success": True,
        "course": db_course
    }

# Join Course Per Code
async def joinCoursePerCode(courseID, userID):
    query = select(course).where(course.c.id == courseID)
    db_course = await database.fetch_one(query)
    if not db_course:
        return {"success": False, "message": "Course not found"}
    
    query = select(userCourse).where((userCourse.c.course_id == courseID) & (userCourse.c.user_id == userID))
    db_user_course = await database.fetch_one(query)
    if db_user_course:
        return {"success": False, "message": "Already enrolled in this course"}
    
    query = select(courseSections).where(courseSections.c.course_id == courseID)
    db_sections = await database.fetch_all(query)
    
    query = userCourse.insert().values(
        user_id=userID,
        course_id=courseID,
        progress=0,
        status="In Progress",
        total_section=len(db_sections)+1
    )
    save = await database.execute(query)

    if not save:
        raise HTTPException(status_code=500, detail="Course enrollment failed")
    
    return {"success": True, "message": "Course joined successfully"}


























