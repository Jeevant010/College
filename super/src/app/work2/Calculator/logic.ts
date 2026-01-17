export function calculate(n1: number, n2: number, op: string): number | string {
  switch (op) {
    case "+": return n1 + n2;
    case "-": return n1 - n2;
    case "*": return n1 * n2;
    case "/": return n2 !== 0 ? n1 / n2 : "Cannot divide by zero";
    case "%": return n1 % n2;
    default: return "Invalid Operation";
  }
}