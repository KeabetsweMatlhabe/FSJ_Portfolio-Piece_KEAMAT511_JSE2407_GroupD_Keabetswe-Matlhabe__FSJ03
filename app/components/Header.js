"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../context/authContext';

export default function Header() {
  const { user, logout, loading } = useAuth();

  return (
    <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Link href="/">
              <Image
                 src="/logo.jpg"
                 alt="Store Logo"
                 width={40}
                 height={40}
                className="rounded-full border-2 border-white"
              />
            </Link>
            <Link href="/">
              <span className="text-3xl font-extrabold tracking-wide hover:text-gray-200 transition-colors duration-200">
                Store
              </span>
            </Link>
          </div>

          <nav>
            <ul className="flex space-x-6 items-center">
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
              {loading ? (
                <li className="text-sm">Loading...</li>
              ) : user ? (
                <>
                  <li className="text-sm">Welcome, {user.email}</li>
                  <li>
                    <button
                      onClick={logout}
                      className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-full transition-colors duration-200"
                    >
                      Sign Out
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link href="/signin">
                      <span className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full transition-colors duration-200">
                        Sign In
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/signup">
                      <span className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition-colors duration-200">
                        Sign Up
                      </span>
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}