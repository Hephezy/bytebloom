"use client";

import React from 'react';
import ThemeToggle from '../ui/ThemeToggle';
import Link from 'next/link';
import { useSession, signOut } from "next-auth/react";
import { User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NavbarLinks } from '@/constants';

const Navbar = () => {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  return (
    <nav className='flex w-full justify-between items-center py-4'>
      <div>
        <h2>The Blog</h2>
      </div>
      <div className=''>
        <div className='hidden lg:flex gap-12 md:gap-8 items-center'>
          {NavbarLinks.map((item) => (
            <Link
              key={item.label}
              href={item.route}
            >
              <h2 className='text-primary font-semibold text-[18px]' >
                {item.label}
              </h2>
            </Link>
          ))}
        </div>
      </div>
      <div className='flex flex-row items-center justify-center gap-8'>
        {!loading && (
          <>
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
              <div className="flex items-center gap-2">
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
              </div>
            )}
          </>
        )}

        <ThemeToggle />
      </div>
    </nav>
  );
};

export default Navbar;