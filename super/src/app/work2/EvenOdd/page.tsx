"use client";
import { useState } from "react";
import { checkEvenOdd } from "./logic";
import Link from "next/link";

export default function EvenOdd() {
  const [inputVal, setInputVal] = useState("");
  const [uiResult, setUiResult] = useState<string | null>(null);

  // Method 1: Prompt
  const handlePrompt = () => {
    const val = prompt("Enter a number:");
    if (val) alert(`Number is ${checkEvenOdd(Number(val))}`);
  };

  // Method 2: UI
  const handleUI = () => {
    setUiResult(checkEvenOdd(Number(inputVal)));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <Link href="/" className="absolute top-8 left-8 text-blue-600 hover:underline">← Dashboard</Link>
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-6 text-black">Task 2: Even or Odd</h1>

        <button onClick={handlePrompt} className="w-full bg-gray-800 text-white py-3 rounded-lg mb-8">
          Check via Prompt
        </button>

        <div className="border-t pt-6 text-left">
          <label className="block text-sm font-medium text-gray-700 mb-2">Enter Number:</label>
          <div className="flex gap-2">
            <input 
              type="number" 
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="flex-1 p-3 border rounded-lg bg-gray-50 text-black"
              placeholder="e.g. 42"
            />
            <button onClick={handleUI} className="bg-purple-600 text-white px-6 rounded-lg font-bold">
              Check
            </button>
          </div>
          {uiResult && (
            <div className="mt-4 p-3 bg-purple-50 text-purple-800 rounded font-bold text-center">
              Result: {uiResult}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}