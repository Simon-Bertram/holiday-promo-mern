"use client";

import Link from "next/link";
import { useAuthProfile } from "@/hooks/useAuthProfile";
import { useSelector } from "react-redux";
import UserMenu from "./UserMenu";

export default function NavLinks({ currentPath }) {
  const { data: profile } = useAuthProfile();
  const { userInfo } = useSelector((state) => state.auth);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/deals", label: "Deals" },
    { href: "/about", label: "About" },
  ];

  return (
    <nav aria-label="Main navigation">
      <ul className="flex items-center gap-4" role="menubar">
        {navLinks.map(({ href, label }) => (
          <li key={href} role="none">
            <Link
              href={href}
              className={`transition-colors hover:text-gray-600 dark:hover:text-gray-300 ${
                currentPath === href ? "text-blue-500 dark:text-blue-400" : ""
              }`}
              role="menuitem"
              aria-current={currentPath === href ? "page" : undefined}
            >
              {label}
            </Link>
          </li>
        ))}
        <li role="none">
          {userInfo ? (
            <UserMenu />
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors focus:ring-2 focus:ring-blue-400 focus:outline-none"
              role="menuitem"
            >
              Login
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}
