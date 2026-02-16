// src/data/app.ts

// 1. You must Export this "Interface" (This fixes the TS Error)
export interface Project {
  id: number;
  title: string;
  assignment: string;
  description: string;
  link: string;
  date: string;
}

// 2. Your Data Array
export const apps: Project[] = [
    {
    id: 1,
    title: "Assignment 1: Modular Addition",
    assignment: "Assignment 1",
    description: "Split into Logic, Input, and Display files.",
    link: "/work1/Assignment",
    date: "2026-01-17"
  },
  {
    id: 2,
    assignment: "Assignment 02",
    title: "1. Simple Calculator",
    description: "Arithmetic operations using Switch Case.",
    link: "/work2/Calculator",
    date: "2026-01-18"
  },
  {
    id: 3,
    assignment: "Assignment 02",
    title: "2. Even or Odd",
    description: "Modulus operator checker.",
    link: "/work2/EvenOdd",
    date: "2026-01-18"
  },
  {
    id: 4,
    assignment: "Assignment 02",
    title: "3. Age Calculator",
    description: "Birth year calc & voting eligibility.",
    link: "/work2/AgeCalculator",
    date: "2026-01-18"
  },
  {
    id: 5,
    assignment: "Assignment 02",
    title: "4. Grade Calculator",
    description: "Calculate percentage and grade.",
    link: "/work2/GradeCalculator",
    date: "2026-01-18"
  },
  {
    id: 6,
    assignment: "Assignment 02",
    title: "5. Library Logic",
    description: "Logical operators challenge (&& || !).",
    link: "/work2/LibraryLogic",
    date: "2026-01-18"
  },
  {
  id: 7, // Increment the ID
  assignment: "Day 02",
  title: "6. Three.js Shapes",
  description: "Render 3D Cube, Sphere & Prism.",
  link: "AVR/assignment1",
  date: "2026-01-18"
},
{
    id: 8,
    assignment: "Day 03",
    title: "jQuery Assignments",
    description: "Selectors, Animations, and AJAX implementation.",
    link: "/work3/index.html", // Links to the public HTML file
    date: "2026-01-30"
},
{
    id: 9,
    assignment: "Assignment 04",
    title: "3. Personal Expense & Budget Analyzer",
    description: "Track income & expenses, category breakdown, monthly summaries with visual bars.",
    link: "/Assignment4/Expense",
    date: "2026-02-15"
},
{
    id: 10,
    assignment: "Assignment 04",
    title: "4. Student Attendance System",
    description: "Mark, store & analyze student attendance with date-wise records & percentage tracking.",
    link: "/Assignment4/Attendance",
    date: "2026-02-15"
}
];