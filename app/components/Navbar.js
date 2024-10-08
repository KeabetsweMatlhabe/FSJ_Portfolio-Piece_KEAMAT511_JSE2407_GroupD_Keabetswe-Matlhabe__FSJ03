// app/components/Navbar.js
"use client"; 

import { useAuth } from '../../context/authContext'; // Ensure the path is correct

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {user ? (
          <>
            <span>Welcome, {user.email}</span>
            <button 
              onClick={logout} 
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Sign Out
            </button>
          </>
        ) : (
          <a href="/auth/signin" className="text-white hover:text-gray-400">Sign In</a>
        )}
      </div>
    </nav>
  );
}
