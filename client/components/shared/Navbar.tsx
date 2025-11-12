"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from "next-auth/react";
import { User, Menu, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ThemeToggle from '../ui/ThemeToggle';
import { NavbarLinks } from '@/constants';

const Navbar = () => {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <nav className='w-full'>
      {/* Desktop & Mobile Header */}
      <div className='flex w-full justify-between items-center py-4'>
        <div>
          <h2 className="text-xl font-bold">Byte Bloom</h2>
        </div>

        {/* Desktop Navigation */}
        <div className='hidden lg:flex gap-12 md:gap-8 items-center'>
          {NavbarLinks.map((item) => (
            <Link
              key={item.label}
              href={item.route}
            >
              <h2 className='text-primary font-semibold text-[18px]'>
                {item.label}
              </h2>
            </Link>
          ))}
        </div>

        {/* Right Side Controls */}
        <div className='flex flex-row items-center justify-center gap-4'>
          {/* Desktop Auth */}
          {!loading && (
            <div className="hidden lg:flex items-center gap-4">
              {session ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="p-4 bg-secondary rounded-full items-center justify-center cursor-pointer">
                      <User className="h-6 w-6" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => signOut()}>
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-foreground hover:text-primary transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          )}

          {/* Mobile: Profile Icon (if signed in) */}
          {!loading && session && (
            <div className="lg:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="p-3 bg-secondary rounded-full items-center justify-center cursor-pointer">
                    <User className="h-5 w-5" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut()}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          <ThemeToggle />

          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 hover:bg-secondary rounded-md transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border py-4 space-y-4">
          {/* Navigation Links */}
          <div className="flex flex-col space-y-3">
            {NavbarLinks.map((item) => (
              <Link
                key={item.label}
                href={item.route}
                onClick={closeMobileMenu}
                className="px-4 py-2 text-foreground hover:text-primary hover:bg-secondary/50 rounded-md transition-colors"
              >
                <span className="font-semibold text-[16px]">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Auth Buttons (only show if not signed in) */}
          {!loading && !session && (
            <div className="flex flex-col space-y-2 px-4 pt-4 border-t border-border">
              <Link
                href="/login"
                onClick={closeMobileMenu}
                className="w-full px-4 py-2 text-center text-foreground hover:text-primary hover:bg-secondary/50 rounded-md transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={closeMobileMenu}
                className="w-full px-4 py-2 text-center bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;