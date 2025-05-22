import { message } from 'antd';
import axios from 'axios';
import {create} from 'zustand';

export const useFavoriteStore = create((set,get:any)=>({
    favorites: new Map<number, {id:number, userId:number}>(),

    getFavorites: async(user_id:number)=>{
        try {
            const res = await axios.get(`http://localhost:8081/api/favorite/getByUser?userId=${user_id}`);
            if(res.status === 200){
                res.data.forEach((favorite:any) => {
                    set({
                        favorites: new Map(
                            [...get().favorites, [parseInt(favorite.courseId), favorite.id]]
                        )
                    })
                });
                // console.log(get().favorites);
            }
        } catch(err){
            console.log("Error fetching favorite courses", err);
        }
    },

    addFavoriteCourse: async(userId: number, courseId:number) => {
        console.log(userId,courseId);
        try {
            const res = await axios.post(`http://localhost:8081/api/favorite`,{userId,courseId});
            message.success("Course added to favorites");
            set({
                favorites: new Map(
                    [...get().favorites, [courseId, res.data.id]]
                )
            })
            return res.data;
        } catch (error) {
            console.error("Error adding favorite course:", error);
        }
    },

    removeFavoriteCourse: async(favoriteId: string) => {
        try {
            const res = await axios.delete(`http://localhost:8081/api/favorite/${favoriteId}`);
            message.success("Course removed from favorites");
            set({
                favorites: new Map(
                    [...get().favorites].filter(([key,value]) => value !== favoriteId)
                )
            })
            return res.data;
        } catch (error) {
            console.error("Error removing favorite course:", error);
        }
    },

}))