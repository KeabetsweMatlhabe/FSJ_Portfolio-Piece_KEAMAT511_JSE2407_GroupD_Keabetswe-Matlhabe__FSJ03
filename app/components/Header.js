import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
      <div className="container mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          {/* Logo */}
          <Link href="/">
            <Image 
              src="/logo.png" 
              alt="Store Logo"
              width={40} 
              height={40}
              className="rounded-full" 
            />
          </Link>
          {/* Store Name */}
          <Link href="/">
            <span className="text-3xl font-extrabold tracking-wide hover:text-gray-200 transition-colors duration-200">
              Store
            </span>
          </Link>
        </div>

        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link href="/">
                <span className="text-lg font-medium hover:text-gray-200 transition-colors duration-200">
                  Home
                </span>
              </Link>
            </li>
            <li>
              <Link href="/products">
                <span className="text-lg font-medium hover:text-gray-200 transition-colors duration-200">
                  Products
                </span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
