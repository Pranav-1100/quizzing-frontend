import Link from 'next/link';
import { useState } from 'react';
import { MenuIcon, XIcon } from '@heroicons/react/outline';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary">
          StudyApp
        </Link>
        <div className="hidden md:flex space-x-4">
          <NavLink href="/questions">Questions</NavLink>
          <NavLink href="/notes">Notes</NavLink>
          <NavLink href="/study-plan">Study Plan</NavLink>
          <NavLink href="/doubts">Doubts</NavLink>
          <NavLink href="/profile">Profile</NavLink>
        </div>
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? (
            <XIcon className="h-6 w-6" />
          ) : (
            <MenuIcon className="h-6 w-6" />
          )}
        </button>
      </nav>
      {isOpen && (
        <div className="md:hidden">
          <NavLink href="/questions" mobile>Questions</NavLink>
          <NavLink href="/notes" mobile>Notes</NavLink>
          <NavLink href="/study-plan" mobile>Study Plan</NavLink>
          <NavLink href="/doubts" mobile>Doubts</NavLink>
          <NavLink href="/profile" mobile>Profile</NavLink>
        </div>
      )}
    </header>
  );
}

function NavLink({ href, children, mobile }) {
  return (
    <Link href={href} className={`${mobile ? 'block py-2 px-4 hover:bg-gray-100' : 'hover:text-primary'}`}>
      {children}
    </Link>
  );
}