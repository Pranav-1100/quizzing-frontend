'use client';

import Link from 'next/link';
import { useState } from 'react';
import { MenuIcon, XIcon } from '@heroicons/react/outline';
import { useAuth } from '@/hooks/useAuth';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-primary">
            StudyApp
          </Link>
          <div className="hidden md:flex space-x-6">
            {user ? (
              <>
                <NavLink href="/questions">Questions</NavLink>
                <NavLink href="/notes">Notes</NavLink>
                <NavLink href="/study-plan">Study Plan</NavLink>
                <NavLink href="/doubts">Doubts</NavLink>
                <NavLink href="/profile">Profile</NavLink>
                <button onClick={logout} className="btn btn-secondary">Logout</button>
              </>
            ) : (
              <>
                <NavLink href="/login">Login</NavLink>
                <NavLink href="/register">Register</NavLink>
              </>
            )}
          </div>
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? (
              <XIcon className="h-6 w-6" />
            ) : (
              <MenuIcon className="h-6 w-6" />
            )}
          </button>
        </div>
        {isOpen && (
          <div className="md:hidden mt-4 space-y-2">
            {user ? (
              <>
                <NavLink href="/questions" mobile>Questions</NavLink>
                <NavLink href="/notes" mobile>Notes</NavLink>
                <NavLink href="/study-plan" mobile>Study Plan</NavLink>
                <NavLink href="/doubts" mobile>Doubts</NavLink>
                <NavLink href="/profile" mobile>Profile</NavLink>
                <button onClick={logout} className="btn btn-secondary w-full mt-2">Logout</button>
              </>
            ) : (
              <>
                <NavLink href="/login" mobile>Login</NavLink>
                <NavLink href="/register" mobile>Register</NavLink>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}

function NavLink({ href, children, mobile }) {
  return (
    <Link
      href={href}
      className={`${
        mobile
          ? 'block py-2 px-4 text-center hover:bg-gray-100 rounded-md'
          : 'text-gray-700 hover:text-primary font-medium'
      }`}
    >
      {children}
    </Link>
  );
}