"use client"; // Required for interactivity (useState)

import { useState } from "react";
import Link from "next/link";

export default function DayOneCounter() {
  // TypeScript automatically infers this is a number, 
  // but we can be explicit: useState<number>(0)
  const [count, setCount] = useState<number>(0);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      {/* Back Navigation */}
      <div className="absolute top-8 left-8">
        <Link 
          href="/" 
          className="flex items-center text-gray-600 hover:text-blue-600 transition-colors font-medium"
        >
          <span>← Back to Dashboard</span>
        </Link>
      </div>

      {/* Main App Content */}
      <div className="text-center space-y-8">
        <h1 className="text-4xl font-bold text-gray-900">Day 1: Counter App</h1>
        
        <div className="bg-gray-50 p-12 rounded-3xl border border-gray-200 w-80 mx-auto">
          <span className="block text-7xl font-mono font-bold text-blue-600 mb-8">
            {count}
          </span>
          
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => setCount(count - 1)}
              className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all shadow-sm"
            >
              Decrease
            </button>
            <button 
              onClick={() => setCount(count + 1)}
              className="px-6 py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl"
            >
              Increase
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}