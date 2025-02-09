"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLogoutMutation } from "@/slices/usersApiSlice";
import { logout } from "@/slices/authSlice";
import { useDispatch } from "react-redux";
import { useGetProfileQuery } from "@/slices/usersApiSlice";
import { apiSlice } from "@/slices/apiSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";

export default function UserMenu() {
  const {
    data: profile,
    isLoading,
    error,
  } = useGetProfileQuery(undefined, {
    // Skip caching to always fetch fresh data
    refetchOnMountOrArgChange: true,
  });
  const dispatch = useDispatch();
  const [logoutMutation] = useLogoutMutation();
  const router = useRouter();

  const logoutHandler = async () => {
    try {
      await logoutMutation().unwrap();
      // First dispatch logout to clear auth state
      dispatch(logout());
      // Then manually invalidate the profile query
      dispatch(apiSlice.util.resetApiState());
      router.push("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return null;
  }

  // Use profile.name to display the initial (if available)
  const initialLetter = profile?.name ? profile.name.slice(0, 1) : "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors focus:ring-2 focus:ring-blue-400 focus:outline-none">
        {initialLetter}
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
