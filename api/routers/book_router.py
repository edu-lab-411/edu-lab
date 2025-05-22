from fastapi import APIRouter, Depends
from controllers import book_controller
from utils.security import auth_required

router = APIRouter()

# Get Major Books
@router.get("/get_major_books/{major}")
async def get_books(major: str, _=Depends(auth_required)):
    return await book_controller.getBooks(major)

@router.post("/book_summary")
async def get_book_summary(request: dict, _=Depends(auth_required)):
    systemMsg = request.get("systemMsg")
    return await book_controller.getBookSummary(systemMsg)