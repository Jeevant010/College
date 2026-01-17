// src/data/app.ts

// 1. You must Export this "Interface" (This fixes the TS Error)
export interface Project {
  id: number;
  title: string;
  description: string;
  link: string;
  date: string;
}

// 2. Your Data Array
export const apps: Project[] = [
    {
    id: 1,
    title: "Assignment 1: Modular Addition",
    description: "Split into Logic, Input, and Display files.",
    link: "/work1/Assignment",
    date: "2026-01-17"
  },
];