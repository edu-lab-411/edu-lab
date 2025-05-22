"use client";

import { useState } from "react";
import { X } from "lucide-react";
import useAuthStore from "@/app/store/authStore";

interface AuthModalProps {
    onClose?: () => void;
}

export function Signin({onClose}: AuthModalProps) {
    const setUserData = useAuthStore((state => state.setUserData)); 
    const setIsAuth = useAuthStore((state => state.setIsAuth)); 
    const [formData, setFormData] = useState<any>({
        email: "",
        password: "",
        remember: false,
    });
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSignin = async(e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        if(!formData.email || !formData.password) {
            setError("Please fill in all fields");
            setIsSubmitting(false);
            return;
        }
        try{
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signin`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    remember: formData.remember,
                }),
            });
            const data = await res.json();
            // console.log(data,res);
            if(res.ok){
                if(data?.user.blocked){
                    setError("Your account has been blocked. Please contact support.");
                    return;
                }
                localStorage.setItem("token", data.token);
                // console.log(data)
                setUserData(data.user);
                setIsAuth(true);
                setFormData({
                    email: "",
                    password: "",
                    remember: false,
                });
                setError(null);
                onClose?.();
            } else {
                setError(data.detail || "An error occurred. Please try again.");
            }
        } catch (error) {
            console.error("Error signing in:", error);
            setError("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div
                className="relative bg-white rounded-2xl shadow-xl w-[470px] overflow-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    <X size={24} />
                </button>
                <div
                    className={`p-8 md:p-12`}
                >
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign in</h2>
                        <p className="text-gray-500">
                            Welcome back! Please enter your details.
                        </p>
                        </div>

                        <form 
                            className="space-y-4"
                            onSubmit={handleSignin}
                        >
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                Username or Email
                                </label>
                                <input
                                    type="text"
                                    id="email"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            email: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            password: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            remember: e.target.checked,
                                        })
                                    }
                                />
                                <label
                                    htmlFor="remember"
                                    className="ml-2 block text-sm text-gray-700"
                                >
                                    Stay logged in
                                </label>
                                </div>
                                <a
                                    href="#"
                                    className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                                >
                                Forgot password?
                                </a>
                            </div>

                            {error && (
                                <div className="text-red-500 text-sm">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors mt-6"
                            >
                                {isSubmitting 
                                    ? <div className="animate-spin rounded-full h-[30px] w-[30px] border-b-2 border-white m-auto"></div>
                                    : "Sign in"
                                }
                            </button>
                        </form>

                    <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600">
                        Don&apos;t have an account?{" "}
                        <button
                            className="text-indigo-600 font-medium hover:text-indigo-700"
                        >
                            Sign up
                        </button>
                    </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
