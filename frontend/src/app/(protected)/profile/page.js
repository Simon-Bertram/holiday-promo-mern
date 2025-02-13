"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { apiSlice } from "@/slices/apiSlice";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "@/slices/usersApiSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
// Shadcn imports
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

// Define form validation schema with preprocessing for empty strings
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

function UserProfileForm() {
  const { data: profile, isLoading: isProfileLoading } = useGetProfileQuery();
  // Use RTK Query mutation state to determine if the update was successful
  const [updateProfile, { isLoading, isSuccess, isError, error: updateError }] =
    useUpdateProfileMutation();
  const dispatch = useDispatch();

  // Optional local state if you want to control message presentation further
  const [localSuccessMsg, setLocalSuccessMsg] = useState("");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name || "",
        email: profile.email || "",
      });
    }
  }, [profile, form]);

  // React to successful update via the RTK Query status flag
  useEffect(() => {
    if (isSuccess) {
      setLocalSuccessMsg("Profile updated successfully");
    } else {
      setLocalSuccessMsg("");
    }
  }, [isSuccess]);

  async function handleUpdateProfile(newData) {
    try {
      const result = await updateProfile(newData).unwrap();
      setLocalSuccessMsg("Profile updated successfully");

      // Force a refetch of the profile data
      dispatch(apiSlice.util.invalidateTags(["Profile"]));
    } catch (err) {
      const message =
        err.data?.message || err.error || "An error occurred during update";
      form.setError("root", {
        type: "manual",
        message: message,
      });
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md p-12">
        <CardHeader>
          <h1>Welcome to your profile</h1>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleUpdateProfile)}
              className="space-y-6 w-full max-w-md"
              noValidate
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your name"
                        type="text"
                        autoComplete="name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email"
                        type="email"
                        autoComplete="email"
                        disabled
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.formState.errors.root && (
                <div className="text-red-500 text-sm mt-2">
                  {form.formState.errors.root.message}
                </div>
              )}

              {/* Display success message based on RTK Query mutation status */}
              {localSuccessMsg && (
                <div className="text-green-600 text-sm mt-2">
                  {localSuccessMsg}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading || isProfileLoading ? "Updating..." : "Update"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ProfilePage() {
  return <UserProfileForm />;
}
