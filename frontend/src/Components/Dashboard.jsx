// src/components/Dashboard.jsx
import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-1/4 bg-gray-800 text-white p-6">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <nav>
          <ul className="space-y-4">
            <li>
              <Link
                to="/dashboard/overview"
                className="block py-2 px-4 rounded hover:bg-gray-600 transition"
              >
                Overview
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/users"
                className="block py-2 px-4 rounded hover:bg-gray-600 transition"
              >
                Users
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/collections"
                className="block py-2 px-4 rounded hover:bg-gray-600 transition"
              >
                Collections
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/settings"
                className="block py-2 px-4 rounded hover:bg-gray-600 transition"
              >
                Settings
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>

        {/* Custom Table */}
        <div className="bg-white border border-gray-300 rounded-lg shadow-lg overflow-x-auto">
          <div className="min-w-full">
            <div className="border-b bg-gray-200 text-gray-700">
              <div className="grid grid-cols-4 gap-4 py-3 px-4 font-semibold">
                <div>ID</div>
                <div>Name</div>
                <div>Email</div>
                <div>Role</div>
              </div>
            </div>
            <div>
              {/* Sample data */}
              <div className="grid grid-cols-4 gap-4 py-3 px-4 border-b">
                <div>1</div>
                <div>John Doe</div>
                <div>john@example.com</div>
                <div>Admin</div>
              </div>
              <div className="grid grid-cols-4 gap-4 py-3 px-4 border-b">
                <div>2</div>
                <div>Jane Smith</div>
                <div>jane@example.com</div>
                <div>User</div>
              </div>
              {/* Add more rows as needed */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
