import axios from "axios";
import {create} from "zustand";

export const useBooksStore = create((set,get)=>({
    books: [],
    loading: false,

    getBooks: async(major: string)=>{
        set({loading: true});
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/book/get_major_books/${major}`,{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            });
            // console.log(res);
            set({
                books: res.data
            })
        } catch(err){
            console.log("Error fetching books:", err);
        } finally {
            set({loading: false});
        }
    },

    bookSummary: async(systemMsg: string)=>{
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/book/book_summary`,{
                systemMsg
            },{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            });
            // console.log(res);
            return res.data;
        } catch(err){
            console.log("Error fetching summary:", err);
        }
    }
}))