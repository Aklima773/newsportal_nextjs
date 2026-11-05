
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import  jwt, { JwtPayload }  from 'jsonwebtoken';
import { jwtUtils } from "./utils/jwt";
import { getNewAccessToken } from "./service/refreshToken";

const AUTH_ROUTES = ["/login", "/register"];
const PUBLIC_ROUTES =["/","/news"]

export async function proxy(request: NextRequest){

    const pathname = request.nextUrl.pathname;

    const cookieStore = await cookies();
    // const accessToken = cookieStore.get("accessToken")?.value;

    let accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    // const decodedToken = accessToken ? jwt.decode(accessToken) as JwtPayload : null;

    console.log(accessToken,"accessToken")

    let decodedAccessToken = accessToken ? jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string) : null;

    const decodedRefreshToken = refreshToken ? jwtUtils.verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET as string) : null;

    if(!decodedAccessToken?.success && decodedRefreshToken?.success){
        const result = await getNewAccessToken();

        if(result.success){
            const newAccessToken = result.data.accessToken;

            cookieStore.set("accessToken", newAccessToken,{
                httpOnly: true,
                maxAge: 60 * 60 * 24,
                sameSite: "lax",
            });
            accessToken = newAccessToken;

            decodedAccessToken=jwtUtils.verifyToken(accessToken!, process.env.JWT_ACCESS_SECRET as string)
        }
    }

    let userRole = null;

    if(!decodedAccessToken?.success){
        //token has expired

        cookieStore.delete("accessToken");
        // return NextResponse.redirect(new URL('/login', request.url))
    }

    if(decodedAccessToken?.success && decodedAccessToken.data){
        userRole = (decodedAccessToken.data as JwtPayload).role;
    }

    //user is looged in and trying to access in login an d reg page
    if(accessToken && AUTH_ROUTES.includes(pathname)){

        if(userRole === "USER"){
             return NextResponse.redirect(new URL('/dashboard', request.url));
        }else if(userRole === "ADMIN"){
            return NextResponse.redirect(new URL('/admin-dashboard', request.url));
        }else if(userRole === "AUTHOR"){
            return NextResponse.redirect(new URL('/author-dashboard', request.url));
        }else{
            return NextResponse.redirect(new URL('/', request.url));
        }

    }

    // console.log(request.nextUrl, "request");
    console.log(pathname, "pathname")
    // console.log("proxy");

    // return NextResponse.redirect(new URL('/', request.url))


    const isPublic = PUBLIC_ROUTES.some((route)=> pathname === route || pathname.startsWith(route + "/"));

    const isAuthRoute = AUTH_ROUTES.some((route)=> pathname === route || pathname.startsWith(route + "/"));

    if(!accessToken && !isPublic && !isAuthRoute){

         return NextResponse.redirect(new URL('/login', request.url))

    }

    if(pathname.startsWith("/dashboard") && userRole !== "USER"){
         return NextResponse.redirect(new URL('/not-found', request.url))
    }else if(pathname.startsWith("/admin-dashboard") && userRole !== "ADMIN"){
         return NextResponse.redirect(new URL('/not-found', request.url))
    }else if(pathname.startsWith("/author-dashboard") && userRole !== "AUTHOR"){
        return NextResponse.redirect(new URL('/not-found', request.url))
    }


    return NextResponse.next();
}

export const config ={
    matcher: [
        // '/dashboard/:path*',
        // '/admin-dashboard/:path*',
        // '/author-dashboard/:path*',
        '/((?!api|_next/static|_next/image|.*\\.png$).*)',

    ]
}