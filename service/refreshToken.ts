import { cookies } from "next/headers";

export async function getNewAccessToken() {
    // 1. Get cookies from the incoming Next.js request
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value || null; // Grabs all cookies like accessToken=...

  if(!refreshToken){

    return{
        success : false,
        message : "Refresh token not found!"
    }
  }

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/refresh-token`, {
            method: "POST",
            headers: {
                Cookie: `refreshToken=${refreshToken}` // 2. Forward the cookie to your Express backend
            },
            cache: "no-cache",
        });

        const result = await res.json();

        return result;

}