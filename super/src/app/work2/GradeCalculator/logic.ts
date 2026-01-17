export function calculateGrade(m1: number, m2: number, m3: number): string {
  const total = m1 + m2 + m3;
  const percentage = (total / 300) * 100;
  
  let grade = "Fail";
  if (percentage >= 90) grade = "A";
  else if (percentage >= 75) grade = "B";
  else if (percentage >= 50) grade = "C";

  return `Total: ${total}, Percentage: ${percentage.toFixed(2)}%, Grade: ${grade}`;
}