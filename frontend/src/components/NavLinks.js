"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility function to combine classes
const cn = (...inputs) => {
  return twMerge(clsx(inputs));
};

export default function NavLinks() {
  const pathname = usePathname();

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
              className={cn(
                "transition-colors hover:text-gray-600 dark:hover:text-gray-300",
                pathname === href && "text-blue-500 dark:text-blue-400"
              )}
              role="menuitem"
              aria-current={pathname === href ? "page" : undefined}
            >
              {label}
            </Link>
          </li>
        ))}
        <li role="none">
          <Link
            href="/login"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors focus:ring-2 focus:ring-blue-400 focus:outline-none"
            role="menuitem"
          >
            Login
          </Link>
        </li>
      </ul>
    </nav>
  );
}
