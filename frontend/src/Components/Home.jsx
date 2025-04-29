import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-10 text-center">
        <h1 className="text-6xl font-bold text-blue-600 mb-6">
          Welcome to the TODO Application
        </h1>

        <p className="text-2xl text-gray-700 mb-8">
          "Start where you left off and complete today; don’t wait for tomorrow"
        </p>

        <div className="flex gap-6 justify-center">
          <Link to="/register">
            <button className="px-10 py-5 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
              Register
            </button>
          </Link>

          <Link to="/login">
            <button className="px-10 py-5 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400">
              Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
