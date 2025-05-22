"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import useAuthStore from "./store/authStore"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const isAuth = useAuthStore((state) => state.isAuth);
    const getUserData = useAuthStore((state) => state.getUserData);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token && !isAuth) {
            getUserData();
        }
        if (isAuth && pathname === "/" ) {
            router.push("/home");
        }
        if (!isAuth && pathname.startsWith("/home")) {
            router.push("/");
        }
    }, [isAuth, getUserData, pathname]);

    return <>{children}</>;
}
