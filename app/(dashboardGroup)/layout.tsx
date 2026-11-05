import { Navbar } from "@/components/shared/navbar"
import { getMe } from "@/service/getMe"
import { connection } from "next/server";

// Allow blocking route for dynamic dashboard layout
export const instant = false;

const DashboardGroupLayout = async ({
    children
}: {
    children: React.ReactNode
}) => {
    await connection();

    const user = await getMe();

    return(
        <div>
             <Navbar user={user}/>
            {children}
        </div>
    )
}

export default DashboardGroupLayout;