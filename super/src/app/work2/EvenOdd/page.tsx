"use client";
import { checkEvenOdd } from "./logic";
import Link from "next/link";

export default function EvenOdd() {
  const handleCheck = () => {
    const input = prompt("Enter a number:");
    if (input) {
      const result = checkEvenOdd(Number(input));
      alert(`The number ${input} is ${result}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Link href="/" className="absolute top-8 left-8 text-blue-600">← Back</Link>
      <div className="bg-white p-10 rounded-xl shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Task 2: Even/Odd Checker</h1>
        <button onClick={handleCheck} className="bg-purple-600 text-white px-6 py-2 rounded">
          Check Number
        </button>
      </div>
    </div>
  );
}