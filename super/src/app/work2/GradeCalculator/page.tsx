"use client";
import { calculateGrade } from "./logic";
import Link from "next/link";

export default function GradeCalc() {
  const handleGrade = () => {
    const m1 = Number(prompt("Enter marks for Subject 1:"));
    const m2 = Number(prompt("Enter marks for Subject 2:"));
    const m3 = Number(prompt("Enter marks for Subject 3:"));
    
    const result = calculateGrade(m1, m2, m3);
    alert(result);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Link href="/" className="absolute top-8 left-8 text-blue-600">← Back</Link>
      <div className="bg-white p-10 rounded-xl shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Task 4: Grade System</h1>
        <button onClick={handleGrade} className="bg-yellow-600 text-white px-6 py-2 rounded">
          Calculate Grade
        </button>
      </div>
    </div>
  );
}