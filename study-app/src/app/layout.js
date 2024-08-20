import Link from 'next/link';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav className="bg-gray-800 text-white p-4">
          <ul className="flex space-x-4">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/questions">Questions</Link></li>
            <li><Link href="/notes">Notes</Link></li>
            <li><Link href="/study-plan">Study Plan</Link></li>
            <li><Link href="/doubts">Doubts</Link></li>
            <li><Link href="/profile">Profile</Link></li>
          </ul>
        </nav>
        <main className="container mx-auto p-4">
          {children}
        </main>
      </body>
    </html>
  );
}