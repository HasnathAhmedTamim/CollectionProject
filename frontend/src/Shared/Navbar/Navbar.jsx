// src/components/Navbar.jsx
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-2xl font-bold">
          <Link to="/">My Collection</Link>
        </div>

        <button
          onClick={toggleMenu}
          className="text-white md:hidden"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>

        <div
          className={`md:flex md:space-x-4 ${
            isOpen ? "flex-col" : "hidden"
          } md:items-center md:flex-row`}
        >
          <Link
            to="/"
            className="block py-2 px-4 text-gray-300 hover:text-gray-400"
          >
            Home
          </Link>
          <Link
            to="/collections"
            className="block py-2 px-4 text-gray-300 hover:text-gray-400"
          >
            Collections
          </Link>
          {user && (
            <Link
              to="/dashboard"
              className="block py-2 px-4 text-gray-300 hover:text-gray-400"
            >
              Dashboard
            </Link>
          )}
          {!user ? (
            <>
              <Link
                to="/login"
                className="block py-2 px-4 text-gray-300 hover:text-gray-400"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="block py-2 px-4 text-gray-300 hover:text-gray-400"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <span className="block py-2 px-4 text-gray-300">
                Hello, {user.displayName || "User"}
              </span>
              <button
                onClick={logOut}
                className="block py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
