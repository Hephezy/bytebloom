"use client";

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Avoid hydration mismatch
  }

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={`relative w-20 h-10 rounded-full transition-colors duration-300 border-2 ${isDark ? 'bg-white border-gray-300' : 'bg-black border-gray-700'
        }`}
    >
      {/* Sun icon - left side */}
      <Sun
        className={`absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${!isDark ? 'text-white' : 'text-black'
          }`}
      />

      {/* Moon icon - right side */}
      <Moon
        className={`absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${isDark ? 'text-black' : 'text-white'
          }`}
      />

      {/* Circle thumb */}
      <div
        className={`absolute top-1 w-8 h-8 rounded-full transition-all duration-300 ${isDark ? 'bg-black translate-x-10' : 'bg-white translate-x-1'
          }`}
      />
    </button>
  );
}