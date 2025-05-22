"use client"
import { useAIStore } from '@/app/store/AIStore'
import { memo, useEffect, useLayoutEffect, useState } from 'react'
import JSON5 from 'json5';
import { useQuery } from 'react-query';
import { Button } from 'antd';
import { Check, X } from 'lucide-react';
import confetti from "canvas-confetti";

type Props = {
    courseID?: number
    initialSystemMessage: string
    setDoneQuiz: any
}

function FinalTest({initialSystemMessage, courseID, setDoneQuiz}: Props) {
    // const waitGenerateTest = useAIStore((state:any) => state.waitGenerateTest);
    const generateFinalTest = useAIStore((state:any) => state.generateFinalTest);
    const [answers, setAnswers] = useState<any>([]);
    const [results, setResults] = useState<any>([]);
    // const [quiz, setQuiz] = useState<any>([]);

    // const fetchQuiz = async () => {
    //     const quizList = await generateFinalTest(initialSystemMessage);
    //     console.log(quizList);
    //     setQuiz(quizList || []);
    //     // console.log(quizList?.questions);
    // }
    // useLayoutEffect(()=>{
    //     fetchQuiz();
    // },[initialSystemMessage]);

    const {data:quiz = [], isLoading, isRefetching, isError, refetch} = useQuery({
        queryKey: ['quiz',[courseID, initialSystemMessage]],
        queryFn: async () => {
            const quizList = await generateFinalTest(initialSystemMessage);
            try {
                const parsedQuiz = JSON.parse(quizList);
                return parsedQuiz || [];
            } catch (error) {
                console.error("Error parsing quiz data:", error);
                return [];
            }
        },
        enabled: !!initialSystemMessage && !!courseID,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
    });

    const handleVerify = () => {
        let res = [];
        for(let i=0; i<quiz.length; i++){
            const question = quiz[i];
            const correctAnswer = question.options.find((option:any) => option.is_correct);
            res[i] = {
                text: answers[i]?.text,
                isCorrect: answers[i]?.text === correctAnswer?.text,
                correctAnswer: correctAnswer?.text,
            }
        }
        // console.log(res);
        setResults(res)
        if(res.every((result:any) => result.isCorrect)){
            confetti({
                particleCount: 500,
                spread: 150,
                origin: { y: 0.6 },
            });
            setDoneQuiz(true);
        }
    }

    const handleReset = () => {
        setResults([]);
        setAnswers([]);
        refetch();
    }

    if(isError) return (
        <div className="flex justify-center items-center h-screen">
            <p className="text-red-500">Error fetching quiz data.</p>
        </div>
    )

    if(isLoading) return (
        <div className="flex justify-center h-screen mt-[90px]">
            <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-blue-500"></div>
        </div>
    )

    if(isRefetching) return (
        <div className="flex flex-wrap justify-center mt-[90px] h-[300px]">
            <div>
                <p className="text-center w-full text-gray-600 mb-6">Preparing your quiz questions, please wait...</p>
                <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-blue-500 m-auto"></div>
            </div>
        </div>
    )

    return (
        <div>
            {/* {isError &&(
                <div className="flex justify-center items-center h-screen">
                    <p className="text-red-500">Error fetching quiz data.</p>
                </div>
            )}*/}
            {isLoading &&(
                <div className="flex justify-center h-screen mt-[90px]">
                    <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-blue-500"></div>
                </div>
            )}
            {/* {(!isLoading) &&  */}
                <div className="container mx-auto p-6 max-w-4xl">
                    {
                        quiz?.length === 0 
                        ? (
                            <>
                                <p className="text-center text-gray-600">No questions available at the moment.</p>
                                <button
                                    className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-8 rounded-full shadow-md transition duration-200 transform hover:scale-105 m-auto block"
                                    onClick={handleReset}
                                >
                                    {isLoading || isRefetching ? 'Loading...' : 'Try Again'}
                                </button>
                            </>
                        ) 
                        : (
                            <div className="space-y-8">
                                {quiz.map((question:any, index:number) => (
                                    <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden border border-indigo-100">
                                        <div className="bg-indigo-600 px-6 py-4">
                                            {/* <h3 className="text-[18px] font-semibold text-white">Question {index + 1}</h3> */}
                                            <h3 className="text-[16px] font-semibold text-white">{question.question}</h3>
                                        </div>
                                        
                                        <div className="p-6">
                                            {/* <p className="text-gray-800 font-medium mb-4">{question.question}</p> */}
                                            
                                            <div className="space-y-3">
                                                {question.options.map((option:any, optIndex:number) => (
                                                    <div key={optIndex} className="flex items-center">
                                                        <input 
                                                            type="radio" 
                                                            id={`q${index}-opt${optIndex}`}
                                                            name={`question-${index}`}
                                                            className={`
                                                                h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 accent-indigo-600
                                                                ${results[index]?.correctAnswer == option?.text ? 'accent-green-600' : ''}
                                                                ${(results[index]?.text == option.text && results[index]?.isCorrect==false) ? 'accent-red-600' : ''}
                                                            `}
                                                            onChange={() => {
                                                                const updatedAnswers = [...answers];
                                                                updatedAnswers[index] = {
                                                                    text: option?.text,
                                                                    isCorrect: option?.is_correct
                                                                };
                                                                setAnswers(updatedAnswers);
                                                            }}
                                                            checked={answers[index]?.text === option?.text}
                                                            disabled={isLoading || results.length > 0}
                                                        />
                                                        <label 
                                                            htmlFor={`q${index}-opt${optIndex}`} 
                                                            className={`
                                                                ml-3 text-gray-700 cursor-pointer flex gap-2
                                                                ${
                                                                    results[index]?.text == option.text ? 
                                                                        results[index]?.isCorrect ?'text-[green]' : 'text-[red]' 
                                                                    :''
                                                                }
                                                                ${
                                                                    results[index]?.correctAnswer == option?.text ?'text-[green]' : ''
                                                                }
                                                            `}
                                                        >
                                                            {option?.text}
                                                            {results[index]?.correctAnswer == option?.text && (
                                                                <Check color='green' size={20} className='relative top-[1px]' />
                                                            )}
                                                            {(results[index]?.text == option.text && results[index]?.isCorrect==false) && (
                                                                <X color='red' size={20} className='relative top-[1px]' />
                                                            )}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div className="mt-8 flex justify-center">
                                    {(answers.length == quiz.length && results.length==0 ) && (
                                        <button 
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-8 rounded-full shadow-md transition duration-200 transform hover:scale-105"
                                            onClick={handleVerify}
                                        >
                                            Submit Answers
                                        </button>
                                    )}
                                    {results.length>0&&(
                                        <button
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-8 rounded-full shadow-md transition duration-200 transform hover:scale-105 ml-4"
                                            onClick={handleReset}
                                            disabled={isLoading || isRefetching}
                                        >
                                            Test Again
                                        </button>
                                    )}
                                </div>
                            </div>
                        )
                    }
                </div>
            {/* } */}
        </div>
    )
}

export default memo(FinalTest);