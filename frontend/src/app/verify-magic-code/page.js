"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMagicCodeLoginMutation } from "@/slices/usersApiSlice";
import { setCredentials } from "@/slices/authSlice";
import { getCookie } from "@/app/utils/cookie";

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

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  code: z.string().length(5, "Code must be 5 digits"),
});

export default function CodeLoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const decodedEmail = email ? decodeURIComponent(email) : "";
  // Get both the mutation function and its loading state
  const [login, { isLoading: isAuthenticating, error: loginError }] =
    useMagicCodeLoginMutation();

  // Get the global auth loading state if needed
  const { isLoading: isAuthLoading } = useSelector((state) => state.auth);

  // Combined loading state
  const isLoading = isAuthenticating || isAuthLoading;

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
      email: decodedEmail,
    },
  });

  const [code, setCode] = useState(Array(5).fill(""));

  const handleChange = (index, value) => {
    if (/^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Update the form's code field with the combined value
      const combinedCode = newCode.join("");
      form.setValue("code", combinedCode);

      // Move focus to the next input if a digit is entered
      if (value && index < code.length - 1) {
        document.getElementById(`verificationCode${index + 2}`).focus();
      }
    }
  };

  async function onSubmit(data) {
    try {
      // Log the exact request data
      console.log("Sending verification request:", {
        email: decodedEmail,
        code: data.code,
        rawEmail: email,
        formData: data,
      });

      const result = await login({
        email: decodedEmail,
        code: data.code,
      }).unwrap();

      if (!result || typeof result !== "object") {
        throw new Error("Invalid response format from server");
      }

      dispatch(setCredentials({ ...result, token: getCookie("jwt") }));
      router.push(result.redirect || "/");
    } catch (err) {
      // Enhanced error logging
      console.error("Verification error details:", {
        error: err,
        requestData: {
          email: decodedEmail,
          code: data.code,
          rawEmail: email,
        },
        status: err?.status,
        data: err?.data,
        message: err?.message,
      });

      let errorMessage = "Verification failed";

      if (err.status === 404) {
        errorMessage = "User not found";
      } else if (err.status === 400) {
        errorMessage = "Invalid or expired code";
      } else if (err.data?.message) {
        errorMessage = err.data.message;
      }

      form.setError("code", { message: errorMessage });
    }
  }

  // Add this useEffect to log initial state
  useEffect(() => {
    console.log("Form initialization:", {
      decodedEmail,
      rawEmail: email,
      formValues: form.getValues(),
      code,
    });
  }, [decodedEmail, email, form, code]);

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

              {loginError && (
                <div className="text-red-500 text-sm mt-2">
                  {loginError?.data?.message ||
                    "An error occurred during login"}
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
