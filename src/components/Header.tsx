"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { SEED_USERS } from "@/lib/seed-users";
import { useState, useEffect, useRef } from "react";

export default function Header() {
  const { user, login, logout } = useAuth();
  const [showUserPicker, setShowUserPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Close the dropdown when clicking outside of it
  useEffect(() => {
    if (!showUserPicker) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setShowUserPicker(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showUserPicker]);

  return (
    <header className="sticky top-0 z-40 border-b-4 border-kwk-yellow bg-kwk-black text-white shadow-md">
      <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex items-center gap-2.5 text-lg font-extrabold tracking-tight text-white sm:text-xl"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-kwk-green to-kwk-yellow text-lg shadow-sm transition group-hover:rotate-3">
            🏘️
          </span>
          <span className="hidden sm:inline">Community Hub</span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <>
              <Link
                href="/profile"
                className="rounded-lg px-3 py-2 text-sm font-semibold text-kwk-yellow transition hover:bg-kwk-yellow hover:text-kwk-black"
              >
                Profile
              </Link>
              <div className="hidden items-center gap-2 rounded-full bg-white/10 py-1 pl-1 pr-3 sm:flex">
                <img
                  src={user.image}
                  alt={user.name}
                  className="h-8 w-8 rounded-full ring-2 ring-white"
                />
                <span className="text-sm font-semibold text-white">
                  {user.name}
                </span>
              </div>
              <button
                onClick={logout}
                className="rounded-xl border-2 border-white bg-transparent px-3 py-2 text-sm font-semibold text-white transition hover:border-kwk-pink hover:bg-kwk-pink hover:text-kwk-black"
              >
                Log out
              </button>
            </>
          ) : (
            <div className="relative" ref={pickerRef}>
              <button
                onClick={() => setShowUserPicker(!showUserPicker)}
                className="rounded-xl border-2 border-kwk-yellow bg-kwk-yellow px-4 py-2 text-sm font-bold text-kwk-black shadow-sm transition hover:bg-kwk-pink hover:shadow-md"
              >
                Log in
              </button>
              {showUserPicker && (
                <div className="absolute right-0 top-12 z-10 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10">
                  <p className="mb-2 px-2 pt-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Pick a user (dev mode)
                  </p>
                  {SEED_USERS.map((seedUser) => (
                    <button
                      key={seedUser.id}
                      onClick={() => {
                        login(seedUser);
                        setShowUserPicker(false);
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-kwk-luna hover:text-kwk-space"
                    >
                      <img
                        src={seedUser.image}
                        alt={seedUser.name}
                        className="h-6 w-6 rounded-full"
                      />
                      {seedUser.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
