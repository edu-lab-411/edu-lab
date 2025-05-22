from fastapi import HTTPException
from db import database
from models.book import book
from sqlalchemy import select
import utils.groq as groq

import requests
from bs4 import BeautifulSoup

# Scraping Books
def scrape_books(major: str):
    url = f"https://openlibrary.org/search?q={major}&mode=everything&sort=rating&limit=15"
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')

    soup = soup.find_all('div', class_='sri__main')

    books = []

    for book in soup:
        title_tag = book.select_one('.resultTitle .booktitle a')
        author_tag = book.select_one('.bookauthor a')
        img_tag = book.select_one('.bookcover a img')
        title = title_tag.get_text(strip=True) if title_tag else "N/A"
        author = author_tag.get_text(strip=True) if author_tag else "N/A"
        img = img_tag['src'] if img_tag else "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
        # print("---------------")
        # print(title)
        # print(author)
        # print(img)
        # print("--------------")
        books.append({
            'title': title,
            'author': author,
            "cover": img
        })
    return books


# Get Books
async def getBooks(major):
    if major == "undefined":
        return []
    query = select(book).where(book.c.book_category == major)
    result = await database.fetch_all(query)
    if len(result)>0:
        return result
    
    books = scrape_books(major)
    for bookT in books:
        query = book.insert().values(
            book_name=bookT['title'][:100],
            book_author=bookT['author'],
            book_cover=bookT['cover'],
            book_category=major
        )
        await database.execute(query)
    
    query = select(book).where(book.c.book_category == major)
    result = await database.fetch_all(query)
    return result

# Get Book Summary
async def getBookSummary(systemMsg):
    messages = [
        {
            "role": "system",
            "content": """
                You are a professional book summarizer. 
                You receive a book title and author name. 
                You must:
                1. Write a one-paragraph summary of the book.
                2. Give a rating out of 10.
                3. List 5 important insights from the book.
                4. List 5 memorable quotes from the book.
                Format everything using Markdown in the following structure:

                ## 📘 Book Summary: [Book Title] by [Author Name]

                ### 🔍 Summary
                [Your one-paragraph summary here.]

                ### ⭐ Rating
                [Rating]/10

                ### 🧠 Key Insights
                1. [Insight 1]
                2. [Insight 2]
                3. [Insight 3]
                4. [Insight 4]
                5. [Insight 5]

                ### 📝 Notable Quotes
                1. \"*[Quote 1]*\"
                2. \"*[Quote 2]*\"
                3. \"*[Quote 3]*\"
                4. \"*[Quote 4]*\"
                5. \"*[Quote 5]*\"
            """
        },
        {
            "role": "user",
            "content": systemMsg
        }
    ]
    return groq.get_response(messages)