"use client";

import { useState } from "react";
import Link from "next/link";
import InputSection from "./InputSection";
import DisplaySection from "./DisplaySection";

export default function AssignmentOnePage() {
  const [result, setResult] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      
      {/* Navigation Back */}
      <Link href="/" className="absolute top-8 left-8 text-gray-500 hover:text-blue-600 mb-8 inline-block">
        ← Back to Dashboard
      </Link>

      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full">
        <div className="mb-6 border-b pb-4">
          <h1 className="text-2xl font-bold text-gray-800">Assignment 01</h1>
          <p className="text-sm text-gray-500">Addition using Prompts & Components</p>
        </div>

        {/* 1. The Input Component (Handles Prompts & Alerts) */}
        <InputSection onCalculationComplete={(val) => setResult(val)} />

        {/* 2. The Display Component (Handles Webpage Result) */}
        <DisplaySection resultValue={result} />
      </div>
    </div>
  );
}