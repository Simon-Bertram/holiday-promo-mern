"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export default function EmailLoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data) {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/request-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (!response.ok) {
        form.setError("root", { message: result.message });
      } else {
        // Encode the email to handle special characters in URLs
        const encodedEmail = encodeURIComponent(data.email);
        // Route to code or password page based on response, including email as query param
        if (result.nextStep === "code") {
          router.push(`/login/code?email=${encodedEmail}`);
        } else {
          router.push(`/login/password?email=${encodedEmail}`);
        }
      }
    } catch (err) {
      form.setError("root", { message: "An error occurred" });
    }
    setIsLoading(false);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Input placeholder="Enter your email" {...form.register("email")} />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Submitting..." : "Continue"}
      </Button>
    </form>
  );
}
