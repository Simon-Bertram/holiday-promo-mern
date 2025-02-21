"use client";

import { useRoleAuth } from "@/hooks/useRoleAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useGetSubscribersQuery } from "@/slices/subscribersApiSlice";

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthorized, isLoading, profile } = useRoleAuth([
    "admin",
    "moderator",
  ]);
  const {
    data: subscribers,
    isLoading: isLoadingSubscribers,
    error: subscribersError,
    refetch,
  } = useGetSubscribersQuery();

  useEffect(() => {
    if (!isLoading && !isAuthorized) {
      router.push(
        "/login?error=" +
          encodeURIComponent(
            "Unauthorized access. Please login with admin credentials."
          )
      );
    }
  }, [isLoading, isAuthorized, router]);

  if (isLoading || isLoadingSubscribers) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Will redirect in useEffect
  }

  if (subscribersError) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <div className="text-red-500">
          Error loading subscribers: {subscribersError.message}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="mb-6">Welcome, {profile?.name}</p>
    </div>
  );
}
