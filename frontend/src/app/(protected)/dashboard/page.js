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

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Subscribers</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subscribed Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subscribers?.map((subscriber) => (
                  <tr key={subscriber._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {subscriber.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(subscriber.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          subscriber.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {subscriber.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
