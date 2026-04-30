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
    assignment: "Assignment 2",
    title: "1. Simple Calculator",
    description: "Arithmetic operations using Switch Case.",
    link: "/work2/Calculator",
    date: "2026-01-18"
  },
  {
    id: 3,
    assignment: "Assignment 2",
    title: "2. Even or Odd",
    description: "Modulus operator checker.",
    link: "/work2/EvenOdd",
    date: "2026-01-18"
  },
  {
    id: 4,
    assignment: "Assignment 2",
    title: "3. Age Calculator",
    description: "Birth year calc & voting eligibility.",
    link: "/work2/AgeCalculator",
    date: "2026-01-18"
  },
  {
    id: 5,
    assignment: "Assignment 2",
    title: "4. Grade Calculator",
    description: "Calculate percentage and grade.",
    link: "/work2/GradeCalculator",
    date: "2026-01-18"
  },
  {
    id: 6,
    assignment: "Assignment 2",
    title: "5. Library Logic",
    description: "Logical operators challenge (&& || !).",
    link: "/work2/LibraryLogic",
    date: "2026-01-18"
  },
  {
    id: 7, 
    assignment: "Day 02 (AVR)",
    title: "6. Three.js Shapes",
    description: "Render 3D Cube, Sphere & Prism.",
    link: "AVR/assignment1",
    date: "2026-01-18"
  },
  {
    id: 8,
    assignment: "Assignment 3",
    title: "jQuery Assignments",
    description: "Selectors, Animations, and AJAX implementation.",
    link: "/work3/index.html", 
    date: "2026-01-30"
  },
  {
    id: 9,
    assignment: "Assignment 4",
    title: "3. Personal Expense & Budget Analyzer",
    description: "Track income & expenses, category breakdown, monthly summaries with visual bars.",
    link: "/Assignment4/Expense",
    date: "2026-02-15"
  },
  {
    id: 10,
    assignment: "Assignment 4",
    title: "4. Student Attendance System",
    description: "Mark, store & analyze student attendance with date-wise records & percentage tracking.",
    link: "/Assignment4/Attendance",
    date: "2026-02-15"
  },
  {
    id: 11,
    assignment: "Assignment 5",
    title: "5. REST API CRUD Operations",
    description: "Perform GET, POST, PUT, and DELETE requests with custom JSON bodies, status codes, and response tracking.",
    link: "/Assignment5",
    date: "2026-03-17"
  },
  {
    id: 12,
    assignment: "Assignment 6",
    title: "Socket & HTTP Routes",
    description: "Notification server using websockets and standard HTTP routes.",
    link: "#", 
    date: "2026-04-10"
  },
  {
    id: 13,
    assignment: "Assignment 7",
    title: "Personal Website (Apache)",
    description: "A multi-page personal website (Home, About, Contact) designed for Apache HTTP Server execution.",
    link: "/assignment7/index.html",
    date: "2026-04-30"
  }
];