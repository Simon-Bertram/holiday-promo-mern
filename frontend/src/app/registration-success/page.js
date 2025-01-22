"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function RegistrationSuccess() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-background">
      <Card className="w-full max-w-md p-12 text-center">
        <div className="space-y-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
            className="flex justify-center"
          >
            <CheckCircle className="w-24 h-24 text-green-500" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h1 className="text-3xl font-bold mb-4">
              Thank You for Registering!
            </h1>
            <p className="text-muted-foreground mb-8">
              Your account has been successfully created. Welcome aboard!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <Button onClick={() => router.push("/login")} className="w-full">
              Continue to Login
            </Button>
          </motion.div>
        </div>
      </Card>
    </div>
  );
}
