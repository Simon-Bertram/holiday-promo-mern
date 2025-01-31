"use client";

import NavLinks from "./NavLinks";
import Link from "next/link";
import ThemeSwitch from "./ThemeSwitch";
import { useRouter, usePathname } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    fetch("/api/users/logout", {
      method: "POST",
      credentials: "include",
    })
      .then(() => {
        setIsLoggedIn(false);
        router.push("/");
      })
      .catch((error) => console.error("Logout error:", error));
  };

  return (
    <>
      <a
        href="#main-content"
        className="absolute left-4 -top-10 z-50 transform focus:translate-y-12 bg-white dark:bg-gray-800 px-4 py-2 text-sm transition-transform focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-white"
      >
        Skip to main content
      </a>
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

            <div className="flex items-center gap-6">
              <NavLinks />
              {/* <ThemeSwitch /> */}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
