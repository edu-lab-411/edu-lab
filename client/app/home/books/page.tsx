"use client"
import useAuthStore from '@/app/store/authStore';
import { useBooksStore } from '@/app/store/booksStore'
import { Modal } from 'antd';
import React, { memo, useEffect, useLayoutEffect } from 'react'
import ReactMarkdown from 'react-markdown';
import "./style.scss"
import Image from 'next/image';

function Books() {
    const userData = useAuthStore((state:any) => state.userData);
    const books = useBooksStore((state:any) => state.books);
    const getBooks = useBooksStore((state:any) => state.getBooks);
    const bookSummary = useBooksStore((state:any) => state.bookSummary);
    const loading = useBooksStore((state:any) => state.loading);
    const [booksList, setBooksList] = React.useState<any>(null);

    
    const [open, setOpen] = React.useState(false);
    const [summary, setSummary] = React.useState("");

    useLayoutEffect(()=>{
        if(!userData) return;
        if(books?.length > 0) return;
        getBooks(userData?.major);
    },[])

    useEffect(()=>{
        if(books?.length > 0){
            setBooksList(books);
        }
    },[books])

    const handleSummary = async (name:string,author:string) => {
        setOpen(true);
        const systemMsg = `Book title: ${name}, Author: ${author}`;
        const summary = await bookSummary(systemMsg);
        setSummary(summary);
    }

    const handleSearch = (value: string) => {
        if(value==""){
            setBooksList(books);
            return;
        }
        const filteredBooks = books.filter((book:any) => {
            return book?.book_name?.toLowerCase().includes(value.toLowerCase());
        });
        setBooksList(filteredBooks);
    }

    return (
        <div className="h-[calc(100vh-74px)] overflow-auto">
            <div className="px-8 pt-8 pb-4">
                <h1 className="text-2xl font-bold text-gray-800"><span className='capitalize'>{userData?.major?.replace(/-/g, " ")}</span> Books</h1>
                <p className="text-gray-500 mt-1">
                    Explore a curated selection of books to enhance your learning experience. 
                    Dive into the world of knowledge and discover new perspectives.
                </p>
            </div>
            <div className="flex flex-wrap p-8 gap-6">
                <div className="w-full mb-6">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search by book name..."
                            className="w-full p-3 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
                {!loading && booksList?.map((book:any, idx:number) => (
                    <div 
                        className="relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden h-auto w-[360px] border border-gray-100 flex flex-col pb-[40px]"
                        key={idx}
                    >
                        <div className="bg-gray-50 flex items-center justify-center border-b">
                            <Image
                                src={book?.book_cover}
                                alt="Book Cover"
                                width={100}
                                height={100}
                                className="object-cover rounded my-2"
                            />
                        </div>
                        <div className="p-5">
                            <h2 className="text-[15px] font-semibold text-gray-800 line-clamp-2">{book?.book_name}</h2>
                            <p className="text-gray-500 mt-1 text-sm">by {book?.book_author}</p> 
                        </div>
                        <div className="flex justify-between items-center absolute bottom-4 left-5 right-5">
                            <span className="bg-blue-50 text-indigo-600 text-xs px-2 py-1 rounded-full">{userData?.major?.replace(/-/g, " ")}</span>
                            <button 
                                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                                onClick={() => handleSummary(book?.book_name, book?.book_author)}
                            >
                                View Summary
                            </button>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex items-center justify-center h-full w-full mt-10">
                        <svg className="animate-spin h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v2a6 6 0 100 12v2a8 8 0 01-8-8z"/>
                        </svg>
                    </div>
                )}
                {booksList?.length === 0 && !loading && (
                    <div className="flex items-center justify-center h-full w-full mt-10">
                        <p className="text-gray-500">No Books.</p>
                    </div>
                )}
            </div>
            <Modal
                open={open}
                onCancel={() => {
                    setOpen(false);
                    setSummary("");
                }}
                footer={null}
                width={800}
                className="rounded-lg"
                style={{
                    top: 20,
                    borderRadius: "1rem",
                    overflow: "hidden",
                }}
            >
                <div className="markdown-container">
                    {summary && <ReactMarkdown>{summary}</ReactMarkdown>}
                    {!summary && (
                        <div className="flex items-center justify-center h-full">
                            <svg className="animate-spin h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v2a6 6 0 100 12v2a8 8 0 01-8-8z"/>
                            </svg>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    )
}

export default memo(Books);