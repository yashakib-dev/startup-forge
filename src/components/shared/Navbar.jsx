"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@heroui/react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "Browse Startups", href: "/startups" },
    { name: "Startup Details", href: "/startup-details" },
    { name: "Browse Opportunities", href: "/opportunities" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/50 bg-white/80 backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Left: Brand/Logo & Hamburger toggle on mobile */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center rounded-md p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 focus:outline-none dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-200 md:hidden"
            aria-expanded={isOpen}
          >
            <span className="sr-only">Toggle menu</span>
            {isOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent transition-opacity dark:from-blue-400 dark:to-indigo-400 hover:no-underline"
          >
            StartupForge
          </Link>
        </div>

        {/* Center: Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-8">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-zinc-600 hover:text-blue-600 transition-colors dark:text-zinc-400 dark:hover:text-blue-400"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Right: Auth Actions (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-semibold text-zinc-600 hover:text-blue-600 transition-colors dark:text-zinc-100 dark:hover:text-blue-400 hover:no-underline"
          >
            Login
          </Link>
          <Link href="/register">
            <Button
              color="primary"
              variant="solid"
              className="font-semibold shadow-sm dark:hover:text-blue-400 transition-all"
            >
              Register
            </Button>
          </Link>
        </div>

        {/* Mobile Action (when menu is closed) */}
        <div className="flex md:hidden items-center gap-2">
          {!isOpen && (
            <Link href="/register">
              <Button
                color="primary"
                variant="solid"
                size="sm"
                className="font-semibold"
              >
                Register
              </Button>
            </Link>
          )}
        </div>

      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden border-t border-zinc-200/50 bg-white dark:border-zinc-800/50 dark:bg-zinc-950 px-4 py-4 space-y-3 shadow-lg transition-all">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block py-2 text-base font-medium text-zinc-600 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-col gap-3">
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="flex justify-center w-full py-2 text-center text-base font-medium text-zinc-600 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 hover:no-underline"
            >
              Login
            </Link>
            <Link href="/register" onClick={() => setIsOpen(false)} className="w-full">
              <Button
                color="primary"
                variant="solid"
                className="w-full font-semibold"
              >
                Register
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
export default Navbar;