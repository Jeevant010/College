"use client";
import { getVotingStatus } from "./logic";
import Link from "next/link";

export default function AgeCalc() {
  const handleAge = () => {
    const year = prompt("Enter your birth year:");
    if (year) {
      const msg = getVotingStatus(Number(year));
      alert(msg);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Link href="/" className="absolute top-8 left-8 text-blue-600">← Back</Link>
      <div className="bg-white p-10 rounded-xl shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Task 3: Age & Voting</h1>
        <button onClick={handleAge} className="bg-green-600 text-white px-6 py-2 rounded">
          Check Eligibility
        </button>
      </div>
    </div>
  );
}