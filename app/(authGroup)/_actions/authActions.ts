"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import jwt, { JwtPayload } from "jsonwebtoken"

type LoginState ={
    success : true,
    statusCode: number,
    message: string,
    data:{
        accessToken: string,
        refreshToken: string
    }
}

export const loginAction = async (prevState:LoginState, formData: FormData)=> {

    console.log(formData);
    console.log(prevState, "prev State")

    const email = formData.get("email");
    const password = formData.get("password");

    const payload={
        email,
        password
    }

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/login`, {
        method: "POST",
        headers:{
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(payload)
    });

    const result= await res.json();
    console.log(result);

    if(result.success && result.data?.accessToken){
        const cookieStore = await cookies()

        cookieStore.set("accessToken", result.data.accessToken,{
            name: "accessToken",
            value: result.data.accessToken,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24,
            sameSite : "lax"
        })

         cookieStore.set("refreshToken", result.data.refreshToken,{
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7,
            sameSite : "lax"
        });

        const decodedToken = jwt.decode(result.data.accessToken) as JwtPayload;

        // console.log(decodedToken);

        if(decodedToken.role === "USER"){

            redirect("/dashboard")

        }else if(decodedToken.role === "ADMIN"){
            redirect("/admin-dashboard")
        }else if(decodedToken.role === "AUTHOR"){
            redirect("/author-dashboard")
        }

       
    }

    return result;

}