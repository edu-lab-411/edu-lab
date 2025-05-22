from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
import os

chat_model = ChatGroq(
    api_key=os.environ["GROQ_API_KEY"],
    model="llama3-70b-8192",
    temperature=0.7,
    max_tokens=3072,
)

# system_message = SystemMessage(
#     content="This a wessAcademy, an online learning platform. You are a helpful assistant that helps students with their courses. You can answer questions about course content, provide explanations, and assist with any course-related inquiries. Please be concise and informative in your responses."
# )

def convert_to_langchain_messages(raw_messages):
    converted = []
    for msg in raw_messages:
        role = msg['role']
        content = msg['content']
        if role == "system":
            converted.append(SystemMessage(content=content))
        elif role == "user":
            converted.append(HumanMessage(content=content))
        elif role == "assistant":
            converted.append(AIMessage(content=content))
    return converted

def get_response(messages: dict) -> str:
    messages = convert_to_langchain_messages(messages)
    response = chat_model.invoke(messages)
    return response.content