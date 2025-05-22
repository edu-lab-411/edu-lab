import { useCourseStore } from "@/app/store/courseStore";
import { Button, Modal } from "antd";
import { memo, useState } from "react";
import { useQuery, useQueryClient } from "react-query";

interface props {
    notesOpen: boolean;
    setNotesOpen: (notesOpen: boolean) => void;
    courseID: number;
}

const Notes = ({notesOpen,setNotesOpen,courseID}:props) => {
    const queryClient = useQueryClient();
    const {data:notes,isLoading,isError} = useQuery({
        queryKey: ["notes", courseID],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/course/getNotes?courseID=${courseID}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            });
            if(!res.ok){
                console.log("Error fetching notes");
                // throw new Error("Error fetching notes");
            }
            return res.json();
        },
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchInterval: 0,
        refetchIntervalInBackground: false,
    })

    const addNote = useCourseStore((state:any) => state.addNote);
    const deleteNote = useCourseStore((state:any) => state.deleteNote);
    const [note, setNote] = useState<string>("");

    const handleAddNote = async(e:any) => {
        e.preventDefault();
        if(!note.length){
            return;
        }
        await addNote(note, courseID);
        setNote("");
        queryClient.invalidateQueries(["notes", courseID]);
    }

    const handleDeleteNote = async(noteID:number) => {
        await deleteNote(noteID, courseID);
        queryClient.invalidateQueries(["notes", courseID]);
    }

    return (
        <Modal
            open={notesOpen}
            onOk={()=>{}}
            onCancel={()=>setNotesOpen(false)}
            footer={null}
        >
            <div className="pt-0 px-0 pb-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Notes</h2>
                <div className="mb-6">
                    <form 
                        className="space-y-2 flex flex-wrap justify-end"
                        onSubmit={e=>handleAddNote(e)}
                    >
                        <textarea 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 resize-none h-32 transition-all duration-200"
                            placeholder="Write your note here..."
                            value={note}
                            onChange={e=>setNote(e.target.value)}
                        />
                        <Button
                            type="primary"
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg outline-0 transition-colors focus:ring-indigo-700 focus:ring-offset-2 h-[40px] hover:bg-black-700 w-fit"
                            htmlType="submit"
                        >
                            Add Note
                        </Button>
                    </form>
                </div>
                
                <div className="space-y-4">
                    {isLoading && <p className="text-gray-500">Loading notes...</p>}
                    {isError && <p className="text-red-500">Error loading notes.</p>}
                    {notes?.length > 0 && notes?.map((note:any) => (
                        <div key={note.id} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 hover:bg-gray-100 transition-colors duration-200 hover:border-gray-300">
                            <p className="text-gray-700 mb-2">{note.note_content}</p>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">{new Date(note.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                <button 
                                    className="text-red-500 hover:text-red-700 text-sm"
                                    onClick={() => handleDeleteNote(note.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))} 
                    {notes?.length==0 && (
                        <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
                            <p className="text-gray-700">No notes available.</p>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    )
}

export default memo(Notes);