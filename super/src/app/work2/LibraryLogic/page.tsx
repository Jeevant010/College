"use client";
import { checkLibraryAccess } from "./logic";
import Link from "next/link";

export default function LogicChallenge() {
  const handleLogic = () => {
    // confirm() returns true for OK, false for Cancel
    const hasCard = confirm("Do you have a library card? (OK=Yes, Cancel=No)");
    const isStudent = confirm("Are you a student? (OK=Yes, Cancel=No)");
    
    const msg = checkLibraryAccess(hasCard, isStudent);
    alert(msg);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Link href="/" className="absolute top-8 left-8 text-blue-600">← Back</Link>
      <div className="bg-white p-10 rounded-xl shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Task 5: Logic Challenge</h1>
        <button onClick={handleLogic} className="bg-red-600 text-white px-6 py-2 rounded">
          Check Access
        </button>
      </div>
    </div>
  );
}