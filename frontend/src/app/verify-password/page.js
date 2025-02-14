"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/slices/authSlice";
import { getCookie } from "cookies-next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const formSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function PasswordLoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  // If no email in URL, redirect back to login
  useEffect(() => {
    if (!email) {
      router.replace("/login");
    }
  }, [email, router]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: decodeURIComponent(email || ""),
      password: "",
    },
  });

  async function onSubmit(data) {
    setIsLoading(true);
    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${API_URL}/api/auth/password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (!response.ok) {
        form.setError("root", { message: result.message });
      } else {
        // Dispatch the setCredentials action with the user data and token
        dispatch(setCredentials({ ...result, token: getCookie("jwt") }));
        router.push(result.redirect);
      }
    } catch (err) {
      form.setError("root", { message: "An error occurred" });
    }
    setIsLoading(false);
  }

  if (!email) return null; // Don't render form if no email

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1">
          <h1 className="text-2xl font-bold text-center">Login</h1>
          <p className="text-sm text-muted-foreground text-center">
            Enter your credentials to access your account
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                        disabled={isLoading}
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
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button
            variant="link"
            className="text-sm"
            onClick={() => router.push("/forgot-password")}
          >
            Forgot password?
          </Button>
          <div className="text-sm text-center">
            Don&apos;t have an account?{" "}
            <Button
              variant="link"
              className="p-0"
              onClick={() => router.push("/")}
            >
              Sign up
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
    // <form onSubmit={form.handleSubmit(onSubmit)}>
    //   <Input
    //     type="password"
    //     placeholder="Enter your password"
    //     {...form.register("password")}
    //   />
    //   <Button type="submit" disabled={isLoading}>
    //     {isLoading ? "Logging in..." : "Login"}
    //   </Button>
    // </form>
  );
}
