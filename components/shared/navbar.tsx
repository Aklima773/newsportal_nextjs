"use client";

import Link from 'next/link'
import {
  CreditCard,
  LogOut,
  Settings,
  User,
  ChevronDown,
} from 'lucide-react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { logout } from '@/service/logout';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Button } from 'radix-ui/toolbar';


const navItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '#projects' },
  { label: 'Services', href: '#resources' },
  { label: 'Login', href: '/login' },
];

type IUser = {
    success: boolean;
    statusCode: number;
    message: string;
    data: {
        profile: {
            id: string;
            name: string;
            email: string;
            activeStatus: string;
            role: string;
            createdAt: string;
            updatedAt: string;
            profile: {
                id: string;
                profilePhoto: string;
                bio: string | null;
                userId: string;
            };
        };
    };
};

type NavbarProps = {
    user: IUser;
}

export function Navbar({ user }: NavbarProps) {

  // console.log(user.success, "success");

  // const [isLogout, setIsLogout] = useState(false);
  const router = useRouter();



  const handleUserMenuAction = async (action: string) => {
    console.log(`User menu action: ${action}`);

    if (action === "logout") {
      await logout();
       toast.success("Logout successFully!");
       router.push("/login")
      // setIsLogout(true)
    }
  };


  // useEffect(()=>{
  //   if(isLogout){
  //     toast.success("Logout successFully!");
  //     // router.push("/login")
  //   }
  // },[isLogout, router])

  // Safely extract profile data
  const profileData = user?.data?.profile || user?.data || user;



  console.log("RESOLVED PROFILE DATA:", profileData);

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="#overview" className="flex items-center gap-2.5" aria-label="Northstar home">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
              N
            </span>
            <span className="text-base font-semibold tracking-tight">Nextjs Press</span>
          </Link>

          <nav aria-label="Main navigation" className="hidden items-center gap-1 md:flex">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted hover:text-foreground ${index === 0 ? 'bg-muted font-medium text-foreground' : 'text-muted-foreground'}`}
                aria-current={index === 0 ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

     {user.success ?(   <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex h-10 items-center gap-2 rounded-lg px-2 text-sm font-medium transition-colors outline-none" aria-label="Open user menu">
            <Avatar className="size-8">
              <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
                {profileData?.name ? profileData.name.charAt(0).toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
            <span className="hidden sm:inline">{profileData?.name || "Name"}</span>
            <ChevronDown data-icon="inline-end" className="text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                <div className="flex flex-col gap-1">
                  <span>{profileData?.name || "Name"}</span>
                  <span className="text-xs font-normal text-muted-foreground">{profileData?.email || "Email"}</span>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <User />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={async () => { await handleUserMenuAction("logout") }} variant="destructive">
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>)  : <Link href={"/login"}>Login</Link>}
      </div>
    </header>
  )
}