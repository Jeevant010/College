"use client";
import { useState } from "react";
import { checkLibraryAccess } from "./logic";
import Link from "next/link";

export default function LogicChallenge() {
  const [hasCard, setHasCard] = useState(false);
  const [isStudent, setIsStudent] = useState(false);
  const [uiResult, setUiResult] = useState<string | null>(null);

  const handlePrompt = () => {
    const card = confirm("Do you have a library card?");
    const student = confirm("Are you a student?");
    alert(checkLibraryAccess(card, student));
  };

  const handleUI = () => {
    setUiResult(checkLibraryAccess(hasCard, isStudent));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <Link href="/" className="absolute top-8 left-8 text-blue-600 hover:underline">← Dashboard</Link>
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-black text-center">Task 5: Logic Gate</h1>

        <button onClick={handlePrompt} className="w-full bg-gray-800 text-white py-3 rounded-lg mb-8">
          Check via Prompt (Confirm)
        </button>

        <div className="border-t pt-6">
          <div className="space-y-4 mb-6">
            <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input type="checkbox" checked={hasCard} onChange={e => setHasCard(e.target.checked)} className="w-5 h-5 text-blue-600" />
              <span className="text-gray-700">I have a Library Card</span>
            </label>
            <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input type="checkbox" checked={isStudent} onChange={e => setIsStudent(e.target.checked)} className="w-5 h-5 text-blue-600" />
              <span className="text-gray-700">I am a Student</span>
            </label>
          </div>

          <button onClick={handleUI} className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700">
            Verify Access
          </button>

          {uiResult && (
            <div className={`mt-4 p-4 rounded-lg text-center font-bold text-white ${uiResult.includes("Granted") ? "bg-green-500" : "bg-red-500"}`}>
              {uiResult}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}