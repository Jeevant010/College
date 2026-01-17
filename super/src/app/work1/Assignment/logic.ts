// Requirement 2: Perform addition of the two numbers
// This file is "Pure Logic" - it has no UI code.

export const addNumbers = (num1: number, num2: number): number => {
  return num1 + num2;
};

export const validateInput = (input: string | null): number | false => {
  if (input === null || input.trim() === "") return false;
  const parsed = Number(input);
  return isNaN(parsed) ? false : parsed;
};