"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { FiUser, FiLogOut } from "react-icons/fi";
import { RxDashboard } from "react-icons/rx"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "Browse Startups", href: "/startups" },
    { name: "Startup Details", href: "/startup-details" },
    { name: "Browse Opportunities", href: "/opportunities" },
  ];

  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;
  // console.log(user);
  
  const getDashboardHref = (role) => {
    if (role === "founder") return "/dashboard/founder";
    if (role === "collaborator") return "/dashboard/collaborator";
    if (role === "admin") return "/dashboard/admin";
    return "/dashboard";
  };
  const dashboardHref = getDashboardHref(user?.role);


  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/50 py-3 bg-white/80 backdrop-blur-md dark:border-zinc-600/50 dark:bg-zinc-950/80">
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
          <div
            className="flex items-center gap-2 text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent transition-opacity dark:from-blue-400 dark:to-indigo-400 hover:no-underline"
          >
            StartupForge
          </div>
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
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1.5 focus:outline-none cursor-pointer rounded-full p-0.5 hover:ring-2 hover:ring-blue-500/50 transition-all duration-300"
              >
                {user.image ? (
                  <img
                    src={user.image || "https://i.ibb.co.com/xqykWXq5/avatar-15.png"}
                    alt={user.name || "User"}
                    className="h-11 w-11 rounded-full object-cover border border-zinc-200 dark:border-zinc-800"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div
                  style={{ display: user.image ? 'none' : 'flex' }}
                  className="h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 font-semibold text-sm"
                >
                  {user.name ? user.name[0].toUpperCase() : <FiUser className="h-4 w-4" />}
                </div>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <>
                  {/* Backdrop to close dropdown on click outside */}
                  <div
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2.5 w-56 origin-top-right rounded-xl border border-zinc-200/80 bg-white p-1.5 shadow-xl ring-1 ring-black/5 dark:border-zinc-800/80 dark:bg-zinc-900 z-50 transition-all">
                    {/* User Info Header */}
                    <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800 mb-1">
                      <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-zinc-500 truncate mt-0.5">
                        {user.email}
                      </p>
                    </div>

                    {/* Actions */}
                    <Link
                      href="/profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-lg hover:no-underline transition-colors"
                    >
                      <FiUser className="text-zinc-500 text-base" />
                      Profile
                    </Link>
                    <Link
                      href={dashboardHref}
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-lg hover:no-underline transition-colors"
                    >
                      <RxDashboard className="text-zinc-500 text-base" />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg text-left transition-colors cursor-pointer"
                    >
                      <FiLogOut className="text-red-500 dark:text-red-400 text-base" />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>

        {/* Mobile Action (when menu is closed) */}
        <div className="flex md:hidden items-center gap-2">
          {!isOpen && (
            user ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-1.5 focus:outline-none cursor-pointer rounded-full p-0.5 hover:ring-2 hover:ring-blue-500/50 transition-all duration-300"
                >
                  {user.image ? (
                    <img
                      src={user.image || "https://i.ibb.co.com/xqykWXq5/avatar-15.png"}
                      alt={user.name || "User"}
                      className="h-10 w-10 rounded-full object-cover border border-zinc-200 dark:border-zinc-800"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div
                    style={{ display: user.image ? 'none' : 'flex' }}
                    className="h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 font-semibold text-xs"
                  >
                    {user.name ? user.name[0].toUpperCase() : <FiUser className="h-3.5 w-3.5" />}
                  </div>
                </button>

                {/* Dropdown Menu for Mobile */}
                {isDropdownOpen && (
                  <>
                    {/* Backdrop to close dropdown on click outside */}
                    <div
                      className="fixed inset-0 z-40 cursor-default"
                      onClick={() => setIsDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2.5 w-52 origin-top-right rounded-xl border border-zinc-200/80 bg-white p-1.5 shadow-xl ring-1 ring-black/5 dark:border-zinc-800/80 dark:bg-zinc-900 z-50 transition-all">
                      {/* User Info Header */}
                      <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800 mb-1">
                        <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-zinc-500 truncate mt-0.5">
                          {user.email}
                        </p>
                      </div>

                      {/* Actions */}
                      <Link
                        href="/profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-lg hover:no-underline transition-colors"
                      >
                        <FiUser className="text-zinc-500 text-base" />
                        Profile
                      </Link>
                      <Link
                        href={dashboardHref}
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-lg hover:no-underline transition-colors"
                      >
                        <RxDashboard className="text-zinc-500 text-base" />
                        Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg text-left transition-colors cursor-pointer"
                      >
                        <FiLogOut className="text-red-500 dark:text-red-400 text-base" />
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
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
            )
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

          {!user && (
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
          )}
        </div>
      )}
    </header>
  );
}
export default Navbar;