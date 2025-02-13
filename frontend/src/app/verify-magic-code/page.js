"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  code: z.string().length(6, "Code must be 6 digits"),
  email: z.string().email("Invalid email address"),
});

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

  async function onSubmit(data) {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (!response.ok) {
        form.setError("root", { message: result.message });
      } else {
        router.push(result.redirect);
      }
    } catch (err) {
      form.setError("root", { message: "An error occurred" });
    }
    setIsLoading(false);
  }

  if (!email) return null; // Don't render form if no email

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Input placeholder="Enter your 6-digit code" {...form.register("code")} />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Verifying..." : "Submit Code"}
      </Button>
    </form>
  );
}
