import axios from 'axios';
import {create} from 'zustand';
import { marked } from 'marked';

export const useAIStore = create((set,get:any) => ({
    // messages: [
    //     {
    //         role: "system",
    //         content: "This a wessAcademy, an online learning platform. You are a helpful assistant that helps students with their courses. You can answer questions about course content, provide explanations, and assist with any course-related inquiries. Please be concise and informative in your responses.",
    //     },
    //     {
    //         role: "assistant",
    //         content: "Hello! How can I assist you today?",
    //     },
    // ],
    waitToReply: false,
    waitGenerateTest: false,

    sendMsg: async(messages: string, courseID:number) => {
        // set({ messages: [...get().messages, { role: "user", content: message }] });
        set({ waitToReply: true });
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/course/askAI`, 
                {
                    // messages: get().messages,
                    messages,
                    courseID
                }, 
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    }
                }
            );
            if(res.status === 200){
                const data = res.data;
                // set({
                //     messages: [
                //         ...get().messages,
                //         {
                //             role: "assistant",
                //             content: marked(data),
                //         },
                //     ],
                // });
                return marked(data);
            }
        } catch (error) {
            console.error("Error sending message:", error);
            return null;
        } finally {
            set({ waitToReply: false });
        }
    },

    generateFinalTest: async(initialSystemMessage:number)=>{
        set({ waitGenerateTest: true });
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/course/generateFinalTest`,{initialSystemMessage},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    withCredentials: true
                }
            );
            if(res.status === 200){
                return res.data;
            }
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            set({ waitGenerateTest: false });
        }
    } 
}))