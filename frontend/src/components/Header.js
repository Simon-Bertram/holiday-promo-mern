import Link from "next/link";
import ThemeSwitch from "./ThemeSwitch";

export default function Header() {
  return (
    <header className="border-b dark:border-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold">
            Holiday Promotions
          </Link>

          <div className="flex items-center gap-6">
            <nav>
              <ul className="flex items-center gap-4">
                <li>
                  <Link
                    href="/"
                    className="hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/deals"
                    className="hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    Deals
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    About
                  </Link>
                </li>
              </ul>
            </nav>
            <ThemeSwitch />
          </div>
        </div>
      </div>
    </header>
  );
}
