"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLoginMutation } from "@/slices/usersApiSlice";
import { setCredentials } from "@/slices/authSlice";

// Shadcn UI
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

const formSchema = z.object({});

export default function CodeLoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
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
      code: "",
      email: decodeURIComponent(email || ""),
    },
  });

  const [code, setCode] = useState(Array(5).fill(""));

  const handleChange = (index, value) => {
    if (/^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Move focus to the next input if a digit is entered
      if (value && index < code.length - 1) {
        document.getElementById(`verificationCode${index + 2}`).focus();
      }
    }
  };

  async function onSubmit(data) {
    setIsLoading(true);
    const combinedCode = code.join("");

    if (combinedCode.length !== 5) {
      form.setError("root", { message: "Code must be 5 digits" });
      setIsLoading(false);
      return;
    }

    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${API_URL}/api/auth/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: decodeURIComponent(email || ""),
          code: combinedCode,
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        form.setError("root", { message: result.message });
      } else {
        // Dispatch the setCredentials action with the user data and token
        dispatch(setCredentials({ ...res, token: getCookie("jwt") }));
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
          <h1 className="text-2xl font-bold text-center">
            Enter your verification code
          </h1>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                name="code"
                control={form.control}
                render={() => (
                  <FormItem>
                    <FormLabel>Verification Code</FormLabel>
                    <FormControl>
                      <div
                        id="codeContainer"
                        role="group"
                        aria-labelledby="verificationCodeLabel"
                        className="flex space-x-2 mt-4"
                      >
                        {code.map((digit, index) => (
                          <Input
                            key={index}
                            type="text"
                            id={`verificationCode${index + 1}`}
                            maxLength="1"
                            className="code-input border rounded-md text-center w-10 h-10"
                            aria-label={`Digit ${index + 1}`}
                            value={digit}
                            onChange={(e) =>
                              handleChange(index, e.target.value)
                            }
                            disabled={isLoading}
                          />
                        ))}
                      </div>
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
      </Card>
    </div>
  );
}
