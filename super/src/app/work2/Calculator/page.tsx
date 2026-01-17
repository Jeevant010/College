"use client";
import { useState } from "react";
import { calculate } from "./logic";
import Link from "next/link";

type Operator = "+" | "-" | "*" | "/" | "%";

export default function Calculator() {
  // State for Visual UI
  const [num1, setNum1] = useState<string>("");
  const [num2, setNum2] = useState<string>("");
  const [op, setOp] = useState<Operator>("+");
  const [uiResult, setUiResult] = useState<string | number | null>(null);

  // Method 1: The College Assignment Way (Prompt)
  const handlePrompt = () => {
    const n1 = Number(prompt("Enter first number:"));
    const n2 = Number(prompt("Enter second number:"));
    const operatorInput = prompt("Choose operation (+, -, *, /, %):") || "+";
    const operator = ["+", "-", "*", "/", "%"].includes(operatorInput)
      ? (operatorInput as Operator)
      : "+";
    const res = calculate(n1, n2, operator as Operator);
    alert(`Result: ${res}`);
  };

  // Method 2: The Modern UI Way (Form)
  const handleUI = () => {
    const res = calculate(Number(num1), Number(num2), op);
    setUiResult(res);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <Link href="/" className="absolute top-8 left-8 text-blue-600 hover:underline">← Dashboard</Link>
      
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Task 1: Calculator</h1>

        {/* WAY 1: Prompt */}
        <div className="mb-8 pb-8 border-b border-gray-100">
          <p className="text-sm text-gray-500 mb-3">Method 1: Use Browser Prompts</p>
          <button onClick={handlePrompt} className="w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-black transition">
            Launch Prompt Calculator
          </button>
        </div>

        {/* WAY 2: Visual UI */}
        <div>
          <p className="text-sm text-gray-500 mb-3">Method 2: Use Visual Interface</p>
          <div className="flex gap-2 mb-4">
            <input 
              type="number" 
              placeholder="Num 1"
              value={num1}
              onChange={(e) => setNum1(e.target.value)}
              className="w-1/3 p-2 border rounded bg-gray-50 text-black"
            />
            <select 
              title="Operator Selection"
              value={op} 
              onChange={(e) => setOp(e.target.value as Operator)}
              className="w-1/3 p-2 border rounded bg-gray-50 font-bold text-center text-black"
            >
              <option value="+">+</option>
              <option value="-">-</option>
              <option value="*">×</option>
              <option value="/">÷</option>
              <option value="%">%</option>
            </select>
            <input 
              type="number" 
              placeholder="Num 2"
              value={num2}
              onChange={(e) => setNum2(e.target.value)}
              className="w-1/3 p-2 border rounded bg-gray-50 text-black"
            />
          </div>
          <button onClick={handleUI} className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-bold">
            Calculate Result
          </button>

          {uiResult !== null && (
            <div className="mt-4 p-4 bg-blue-50 text-blue-800 rounded-lg text-center font-bold text-xl">
              = {uiResult}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}