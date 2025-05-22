import { useAIStore } from '@/app/store/AIStore'
import { Modal } from 'antd'
import { BotMessageSquare, Send } from 'lucide-react'
import { memo, useEffect, useState } from 'react'

type Props = {
    askAIOpen: boolean
    setAskAIOpen: (askAIOpen: boolean) => void
    courseID: number
    courseName: string
    courseDescription: string
    courseSections: any[]
}

function AskAI({askAIOpen, setAskAIOpen, courseID, courseName, courseDescription, courseSections}:Props) {
    const sendMsg = useAIStore((state:any) => state.sendMsg);
    const waitToReply = useAIStore((state:any) => state.waitToReply);
    // const messages = useAIStore((state:any) => state.messages);
    const [message, setMessage] = useState("");

    const courseInfo = `
        Course Name: ${courseName}
        Course Description: ${courseDescription}
        Course Sections: ${courseSections.map((section, index) => `Section ${index + 1}: ${section.title}, Section Description: ${section.description}`).join(", ")}
    `;
    const initialSystemMessage = `
        This is wessAcademy, an online learning platform. You are a helpful assistant that helps students with their courses. 
        You can answer questions about course content, provide explanations, and assist with any course-related inquiries. 
        Please be concise and informative in your responses.
        ${courseInfo}
    `;
    // console.log(initialSystemMessage);
    // console.log("Initial System Message: ", initialSystemMessage);
    const [messages, setMessages] = useState<any[]>([
        {
            role: "system",
            content: initialSystemMessage,
        },
        {
            role: "assistant",
            content: `Welcome to the course <b>${courseName}</b>. <br />Feel free to ask any questions about the course content, sections, or anything else you'd like to learn!`,
        },
    ]);

    useEffect(()=>{
        if(messages.length > 5){
            goToBottom();
        }
    },[messages])

    const handleSendMsg = async (e:any) => {
        e.preventDefault();
        if (message.trim() === "") return;
        let newMessages = [...messages, { role: "user", content: message }];
        setMessages(newMessages);
        setMessage("");
        const response = await sendMsg(newMessages, courseID);
        if (response) {
            newMessages = [...newMessages, { role: "assistant", content: response }];
            setMessages(newMessages);
        }
        goToBottom();
    }

    const goToBottom = () => {
        setTimeout(() => {
            const messagesContainer = document.querySelector('.overflow-y-auto');
            if (messagesContainer) {
                messagesContainer.scrollTo({
                    top: messagesContainer.scrollHeight,
                    behavior: 'smooth'
                });
            }
        }, 100);
    }

    return (
        <Modal
            open={askAIOpen}
            onOk={()=>{}}
            onCancel={()=>setAskAIOpen(false)}
            footer={null}
            width={800}
            height={800}
            centered
            style={{ 
                top: 0,
                height: '90vh',
            }}
        >
            <div className="flex flex-col">
                <div className="flex-1 overflow-y-auto pr-4 mt-[20px] pb-2 space-y-4 bg-gray-50 rounded min-h-[calc(100vh-200px)] max-h-[calc(100vh-200px)]">
                    {
                        messages?.map((msg:any, index:number) => {
                            if (msg.role != "system"){
                                return (
                                    <div key={index} className={`flex items-start ${msg.role === 'assistant' ? '' : 'justify-end'}`}>
                                        {msg.role === 'assistant' ? (
                                            <div className="flex-shrink-0 mr-3 relative top-[5px]">
                                                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                                                    <BotMessageSquare size={20} />
                                                </div>
                                            </div>
                                        ) : null}
                                        <div className={`bg-${msg.role === 'assistant' ? 'gray-200' : 'indigo-100'} p-3 rounded-lg shadow-sm max-w-[80%]`}>
                                            {/* <p className="text-gray-800"> */}
                                                <div dangerouslySetInnerHTML={{ __html: msg?.content }} />
                                            {/* </p> */}
                                        </div>
                                    </div>
                                )
                            }
                        })
                    }
                </div>

                {/* Input Area */}
                <div className="bg-white p-4 border-t border-gray-200 rounded-b-lg">
                    <form 
                        className="flex items-center gap-2"
                        onSubmit={(e) => handleSendMsg(e)}
                    >
                        <input
                            type="text"
                            placeholder="Ask me anything..."
                            className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all duration-200 outline-none h-[45px]"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center transition-all duration-200 rounded-[30px] w-[45px] h-[45px] justify-center"
                            disabled={waitToReply}
                        >
                            <Send size={20} />
                        </button>
                    </form>
                </div>
            </div>
        </Modal>
    )
}

export default memo(AskAI)