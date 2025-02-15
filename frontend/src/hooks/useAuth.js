"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useAuthProfile } from "./useAuthProfile";

export function useAuth(requireAuth = true) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const { userInfo, loading } = useSelector((state) => state.auth);
  const { data: profile, isLoading: profileLoading } = useAuthProfile();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !userInfo) {
        router.replace("/login");
      } else if (!requireAuth && userInfo) {
        router.replace("/profile");
      } else {
        setIsAuthorized(true);
      }
    }
  }, [requireAuth, userInfo, loading, router]);

  return {
    isAuthorized,
    isLoading: loading,
    user: userInfo,
  };
}
