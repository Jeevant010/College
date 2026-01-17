"use client";
import { useState } from "react";
import { getVotingStatus } from "./logic";
import Link from "next/link";

export default function AgeCalc() {
  const [year, setYear] = useState("");
  const [uiResult, setUiResult] = useState<string | null>(null);

  const handlePrompt = () => {
    const y = prompt("Enter birth year:");
    if (y) alert(getVotingStatus(Number(y)));
  };

  const handleUI = () => {
    setUiResult(getVotingStatus(Number(year)));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <Link href="/" className="absolute top-8 left-8 text-blue-600 hover:underline">← Dashboard</Link>
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-black">Task 3: Age Check</h1>

        <button onClick={handlePrompt} className="w-full bg-gray-800 text-white py-3 rounded-lg mb-8">
          Check via Prompt
        </button>

        <div className="border-t pt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Birth Year:</label>
          <input 
            type="number" 
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full p-3 border rounded-lg bg-gray-50 mb-4 text-black"
            placeholder="e.g. 2005"
          />
          <button onClick={handleUI} className="w-full bg-green-600 text-white py-3 rounded-lg font-bold">
            Check Eligibility
          </button>
          
          {uiResult && (
            <div className="mt-4 p-4 bg-green-50 text-green-800 rounded-lg text-center text-sm font-medium">
              {uiResult}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}