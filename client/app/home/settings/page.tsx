"use client"
import useAuthStore from '@/app/store/authStore';
import { Input, message } from 'antd'
import React, { useEffect, useState } from 'react'

function Settings() {
    const userData:any = useAuthStore((state:any) => state.userData);
    const setUserData:any = useAuthStore((state:any) => state.setUserData);
    const [userForm, setUser] = React.useState<any>({});
    const [error, setError] = useState<string>("");

    useEffect(() => {
        setUser({
            username: userData?.username,
            email: userData?.email,
            major: userData?.major?.split("-").join(" "),
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        });
    },[userData]);

    const handleSettings = async() => {
        if(userForm.currentPassword==""){
            setError("Please enter your current password");
            return;
        }
        if(
            userForm.username == userData.username
            &&
            userForm.email == userData.email
            &&
            userForm.newPassword == ""
            &&
            userForm.confirmPassword == ""
        ){
            console.log("Please fill all the fields");
            return;
        }
        setError("");
        if(userForm.newPassword !== userForm.confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        let updatedUser:any = {
            currentPassword: userForm.currentPassword,
        }
        if(userForm.username !== userData.username){
            updatedUser = { ...updatedUser, username: userForm.username }
        }
        if(userForm.email !== userData.email){
            updatedUser = { ...updatedUser, email: userForm.email }
        }
        if(userForm.newPassword !== ""){
            updatedUser = { ...updatedUser, newPassword: userForm.newPassword }
        }
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/updateUser`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(updatedUser),
            });
            const data = await res.json();
            if(res.ok) {
                setUserData(data);
                setError("");
                message.success("User updated successfully");
            } else {
                setError(data.detail);
            }
        } catch (error:any) {
            console.error("Error updating user:", error);
        }
    }

    return (
        <div className='h-[calc(100vh-74px)] overflow-auto'>
            {/* <h2 className="text-2xl font-bold text-gray-800">Account Settings</h2> */}
            <div className="bg-white p-6 rounded-lg shadow-sm w-[600px] m-auto mt-6">
                <div className='flex items-center mb-4 flex-col'>
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center mb-[5px] text-white text-xl font-medium shadow-md">
                            {userForm?.username?.slice(0,2).toUpperCase()}
                        </div>
                        <div className="absolute bottom-3 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                </div>
                <form 
                    className="space-y-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSettings();
                    }}
                >
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <Input
                            type="text" id="username" name="username"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                            value={userForm?.username}
                            onChange={(e) => setUser({ ...userForm, username: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <Input
                            type="email" 
                            id="email" 
                            name="email"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                            value={userForm?.email}
                            onChange={(e) => setUser({ ...userForm, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Major</label>
                        <Input 
                            type="text" 
                            id="username" 
                            name="username"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                            value={userForm?.major}
                            disabled 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                        <Input 
                            type="password" 
                            id="currentPassword"
                            name="currentPassword"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            value={userForm?.currentPassword}
                            onChange={(e) => setUser({ ...userForm, currentPassword: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <Input 
                            type="password" 
                            id="newPassword"
                            name="newPassword"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            value={userForm?.newPassword}
                            onChange={(e) => setUser({ ...userForm, newPassword: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                        <Input 
                            type="password" 
                            id="confirmPassword" 
                            name="confirmPassword"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            onChange={(e) => setUser({ ...userForm, confirmPassword: e.target.value })}
                            value={userForm?.confirmPassword}
                        />
                    </div>
                    {error && <div className="text-red-500 text-sm mt-[5px]">{error}</div>}
                    <div className="pt-2">
                        <button 
                            type="submit" 
                            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Settings