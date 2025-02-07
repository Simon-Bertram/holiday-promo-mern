"use client";

import { usePathname } from "next/navigation";
import NavLinks from "./NavLinks";
import ThemeSwitch from "./ThemeSwitch";

export default function ClientNav() {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-6">
      <NavLinks currentPath={pathname} />
      <ThemeSwitch />
    </div>
  );
}
