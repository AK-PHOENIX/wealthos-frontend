import type { Expense, BudgetGoal } from "@/types";

const today = new Date();
function daysAgo(n: number) {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

export const mockExpenses: Expense[] = [
  { id: "e1", amount: 480, description: "Swiggy dinner", category: "Food", date: daysAgo(0) },
  { id: "e2", amount: 220, description: "Uber to office", category: "Transport", date: daysAgo(0) },
  { id: "e3", amount: 1599, description: "Netflix annual", category: "Entertainment", date: daysAgo(1) },
  { id: "e4", amount: 35000, description: "Home loan EMI", category: "EMI", date: daysAgo(2) },
  { id: "e5", amount: 2400, description: "Apollo pharmacy", category: "Healthcare", date: daysAgo(3) },
  { id: "e6", amount: 4250, description: "Myntra shopping", category: "Shopping", date: daysAgo(4) },
  { id: "e7", amount: 850, description: "Zomato lunch", category: "Food", date: daysAgo(5) },
  { id: "e8", amount: 3200, description: "Petrol", category: "Transport", date: daysAgo(7) },
  { id: "e9", amount: 1200, description: "Spotify family", category: "Entertainment", date: daysAgo(9) },
  { id: "e10", amount: 5800, description: "Amazon Echo", category: "Shopping", date: daysAgo(12) },
  { id: "e11", amount: 650, description: "Cafe Coffee Day", category: "Food", date: daysAgo(14) },
  { id: "e12", amount: 12500, description: "Car insurance", category: "Other", date: daysAgo(18) },
  { id: "e13", amount: 1850, description: "Concert tickets", category: "Entertainment", date: daysAgo(21) },
  { id: "e14", amount: 720, description: "Ola airport", category: "Transport", date: daysAgo(24) },
  { id: "e15", amount: 3400, description: "Dentist visit", category: "Healthcare", date: daysAgo(28) },
];

export const mockBudgets: BudgetGoal[] = [
  { id: "b1", category: "Food", icon: "🍔", limit: 8000, spent: 6230 },
  { id: "b2", category: "Transport", icon: "🚗", limit: 5000, spent: 4140 },
  { id: "b3", category: "EMI", icon: "🏠", limit: 35000, spent: 35000 },
  { id: "b4", category: "Entertainment", icon: "🎬", limit: 3000, spent: 4649 },
  { id: "b5", category: "Healthcare", icon: "🏥", limit: 4000, spent: 5800 },
  { id: "b6", category: "Shopping", icon: "🛍️", limit: 10000, spent: 10050 },
];
