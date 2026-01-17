"use client";
import { useState } from "react";
import { calculateGrade } from "./logic";
import Link from "next/link";

export default function GradeCalc() {
  const [marks, setMarks] = useState({ m1: "", m2: "", m3: "" });
  const [uiResult, setUiResult] = useState<string | null>(null);

  const handlePrompt = () => {
    const m1 = Number(prompt("Subject 1 Marks:"));
    const m2 = Number(prompt("Subject 2 Marks:"));
    const m3 = Number(prompt("Subject 3 Marks:"));
    alert(calculateGrade(m1, m2, m3));
  };

  const handleUI = () => {
    const res = calculateGrade(Number(marks.m1), Number(marks.m2), Number(marks.m3));
    setUiResult(res);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <Link href="/" className="absolute top-8 left-8 text-blue-600 hover:underline">← Dashboard</Link>
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-black">Task 4: Grades</h1>

        <button onClick={handlePrompt} className="w-full bg-gray-800 text-white py-3 rounded-lg mb-8">
          Calculate via Prompt
        </button>

        <div className="border-t pt-6 space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <input type="number" placeholder="Sub 1" className="p-2 border rounded text-black" 
              onChange={e => setMarks({...marks, m1: e.target.value})} />
            <input type="number" placeholder="Sub 2" className="p-2 border rounded text-black" 
              onChange={e => setMarks({...marks, m2: e.target.value})} />
            <input type="number" placeholder="Sub 3" className="p-2 border rounded text-black" 
              onChange={e => setMarks({...marks, m3: e.target.value})} />
          </div>
          
          <button onClick={handleUI} className="w-full bg-yellow-500 text-white py-3 rounded-lg font-bold hover:bg-yellow-600">
            Show Grade
          </button>

          {uiResult && (
            <div className="mt-4 p-4 bg-yellow-50 text-yellow-800 rounded-lg text-center font-medium">
              {uiResult}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}