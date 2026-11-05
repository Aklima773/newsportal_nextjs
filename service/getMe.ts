import { cookies } from "next/headers";

export async function getMe() {
    // 1. Get cookies from the incoming Next.js request
    const cookieStore = await cookies();
    const cookieString = cookieStore.toString(); // Grabs all cookies like accessToken=...

    try {
        const res = await fetch("http://localhost:5000/api/users/me", {
            method: "GET",
            headers: {
                "Cookie": cookieString, // 2. Forward the cookie to your Express backend
            },
            cache: "no-store",
        });

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch user:", error);
        return null;
    }
}