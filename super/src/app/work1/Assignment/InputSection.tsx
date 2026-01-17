"use client";

// Requirement 1: Accept two numbers from the user using prompt()
// Requirement 4: Display the result using a popup message

import { addNumbers, validateInput } from "./logic";

interface InputProps {
  onCalculationComplete: (result: number) => void;
}

export default function InputSection({ onCalculationComplete }: InputProps) {
  
  const handleStart = () => {
    // Step 1: Get Inputs
    const input1 = prompt("Enter First Number:");
    const input2 = prompt("Enter Second Number:");

    // Step 2: Validate
    const num1 = validateInput(input1);
    const num2 = validateInput(input2);

    if (num1 === false || num2 === false) {
      alert("Invalid input! Please enter valid numbers.");
      return;
    }

    // Step 3: Use the logic file to Add
    const sum = addNumbers(num1, num2);

    // Step 4: Show Popup (Requirement 4)
    alert(`The result is: ${sum}`);

    // Step 5: Send data back to parent to update the Webpage (Requirement 3)
    onCalculationComplete(sum);
  };

  return (
    <button
      onClick={handleStart}
      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors w-full"
    >
      Start Prompt Assignment
    </button>
  );
}