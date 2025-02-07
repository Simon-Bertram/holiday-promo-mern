"use client";

import Link from "next/link";
import ClientNav from "./ClientNav";

// This is now a server component
export default function Header() {
  return (
    <header className="border-b dark:border-gray-800" role="banner">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-lg font-semibold"
            aria-label="Holiday Promotions Home"
          >
            Holiday Promotions
          </Link>

          <ClientNav />
        </div>
      </div>
    </header>
  );
}
