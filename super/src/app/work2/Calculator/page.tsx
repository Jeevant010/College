"use client";
import { useState } from "react";
import { calculate } from "./logic";
import Link from "next/link";

export default function Calculator() {
  const handleCalc = () => {
    const n1 = Number(prompt("Enter first number:"));
    const n2 = Number(prompt("Enter second number:"));
    const op = prompt("Choose operation (+, -, *, /, %):");
    
    if (op) {
      const res = calculate(n1, n2, op);
      alert(`Result: ${res}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Link href="/" className="absolute top-8 left-8 text-blue-600">← Back</Link>
      <div className="bg-white p-10 rounded-xl shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Task 1: Calculator</h1>
        <button onClick={handleCalc} className="bg-blue-600 text-white px-6 py-2 rounded">
          Start Calculator
        </button>
      </div>
    </div>
  );
}