"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/slices/authSlice";
import { usePasswordLoginMutation } from "@/slices/usersApiSlice";
import { getCookie } from "../utils/cookie.js";
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
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function PasswordLoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [login, { isLoading: isAuthenticating }] = usePasswordLoginMutation();

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

  // useEffect to focus the password input
  useEffect(() => {
    // Small delay to ensure the input is mounted
    const timer = setTimeout(() => {
      form.setFocus("password");
    }, 100);

    return () => clearTimeout(timer);
  }, [form]);

  async function onSubmit(data) {
    try {
      const res = await login(data).unwrap();
      dispatch(setCredentials({ ...res, token: getCookie("jwt") }));
      router.push(res.redirect || "/dashboard");
    } catch (err) {
      console.error("Error details:", err);
      const message =
        err.data?.message || err.error || "Invalid email or password";

      // Instead of letting the role check redirect to /unauthorized
      // Handle the error here and redirect to login with an error message
      router.push("/login?error=" + encodeURIComponent(message));
    }
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
                        disabled={isAuthenticating}
                        autoFocus
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
              <Button
                type="submit"
                className="w-full"
                disabled={isAuthenticating}
              >
                {isAuthenticating ? "Authenticating..." : "Login"}
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
  );
}
