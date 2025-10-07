import React from 'react'
import ThemeToggle from '../ui/ThemeToggle';

const Navbar = () => {
  return (
    <nav className='flex w-full justify-between items-center py-4'>
      <div>
        <h2>The Blog</h2>
      </div>
      <div>
        <ThemeToggle />
      </div>
      <div></div>
    </nav>
  );
};

export default Navbar;