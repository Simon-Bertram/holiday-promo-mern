"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLogoutMutation } from "@/slices/usersApiSlice";
import { logout } from "@/slices/authSlice";
import { useDispatch } from "react-redux";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";

export default function UserMenu({ userInfo, onLogout }) {
  const dispatch = useDispatch();
  const [logoutMutation] = useLogoutMutation();
  const router = useRouter();
  const logoutHandler = async () => {
    try {
      await logoutMutation().unwrap();
      dispatch(logout());
      router.push("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors focus:ring-2 focus:ring-blue-400 focus:outline-none">
        {userInfo.name.slice(0, 1)}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={logoutHandler}
          className="flex items-center gap-2 text-red-600 focus:text-red-600"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
