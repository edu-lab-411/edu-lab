from openai import OpenAI
import os
import dotenv
dotenv.load_dotenv()

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.environ["OPENROUTER_API_KEY"],
)

def generate_quiz(topic:str):
    completion = client.chat.completions.create(
        extra_headers={
            "Referer": "https://wessAcademy.vercel.app",
            "X-Title": "wessAcademy",
        },
        extra_body={},
        model="mistralai/mistral-small-3.1-24b-instruct:free",
        messages=[
            {
                "role": "system",
                "content": topic
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": """
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
                        """
                    }
                ]
            }
        ]
    )
    return completion.choices[0].message.content



# from langchain_groq import ChatGroq
# from langchain.schema import HumanMessage, SystemMessage
# from langchain.output_parsers import PydanticOutputParser
# from langchain.prompts import PromptTemplate
# from pydantic import BaseModel, Field

# dotenv.load_dotenv()

# chat_model = ChatGroq(
#     api_key=os.environ["GROQ_API_KEY"],
#     model="llama3-70b-8192",
#     temperature=0.7,
#     max_tokens=3072,
# )

# system_message = SystemMessage(
#     content="""You are an expert education content creator for WessAcademy, an online learning platform.
#     When asked to generate quiz content, you will create accurate, well-structured questions that follow
#     the exact format requested. Your responses will be structured in valid JSON format with proper syntax.
#     """
# )

# class QuizOption(BaseModel):
#     text: str = Field(description="The text of the option presented to the user.")
#     is_correct: bool = Field(description="Whether this option is correct (true) or incorrect (false).")

# class QuizQuestion(BaseModel):
#     question: str = Field(description="The question text shown to the user.")
#     options: list[QuizOption] = Field(description="List of possible answers to the question.")

# class Quiz(BaseModel):
#     questions: list[QuizQuestion] = Field(description="List of questions in this quiz.")


# parser = PydanticOutputParser(pydantic_object=Quiz)


# prompt_template_text = """
#     Generate a final quiz for a course on {topic} with {num_questions} questions.

#     {format_instructions}

#     Each question should have 3-4 options, with exactly one correct option. 
#     The questions should be challenging but fair, and the options should be plausible distractors.
#     Cover a range of topics within {topic}.
#     All questions and options must be in English.

#     Return ONLY the requested JSON format without any additional text, explanations, or commentary.
# """

# format_instructions = parser.get_format_instructions()

# prompt_template = PromptTemplate(
#     template=prompt_template_text,
#     input_variables=["topic", "num_questions"],
#     partial_variables={"format_instructions": format_instructions},
# )

# def generate_quiz(topic: str, num_questions: int = 10):
#     """
#     Generate a quiz on the specified topic with the given number of questions.
    
#     Args:
#         topic: The subject matter of the quiz
#         num_questions: How many questions to generate 10
        
#     Returns:
#         A Quiz direct object containing structured quiz data without and additional text.
#     """

#     prompt = prompt_template.format(topic=topic, num_questions=num_questions)
    
#     messages = [system_message, HumanMessage(content=prompt)]
    
#     response = chat_model(messages)
    
#     # try:
#     #     parsed_quiz = parser.parse(response.content)
#     #     return parsed_quiz
#     # except Exception as e:
#     #     print(f"Error parsing response: {e}")
#         # print(f"Response content: {response.content}")
#         # generate_quiz(topic, num_questions)
#         # raise ValueError("Failed to generate a valid quiz. Please try again.") from e

#     # return parser.parse(response.content)
#     # print(parser.parse(response.content).questions)

#     # return parser.parse(response.content).questions

#     try:
#         parsed_quiz = parser.parse(response.content)
#         return parsed_quiz.questions
#     except Exception as e:
#         print(f"Error parsing response: {e}")
#         # Recursively try again and return the result
#         return generate_quiz(topic)