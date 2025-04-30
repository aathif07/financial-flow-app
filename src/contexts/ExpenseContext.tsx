
import React, { createContext, useContext, useState, ReactNode } from "react";
import { formatISO } from "date-fns";

export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  notes?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  type: TransactionType;
}

interface ExpenseContextType {
  transactions: Transaction[];
  categories: Category[];
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  editTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  addCategory: (category: Omit<Category, "id">) => void;
  balance: number;
  income: number;
  expenses: number;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

// Sample data
const initialCategories: Category[] = [
  { id: "1", name: "Food & Dining", color: "#FF5733", type: "expense" },
  { id: "2", name: "Transportation", color: "#33FF57", type: "expense" },
  { id: "3", name: "Housing", color: "#3357FF", type: "expense" },
  { id: "4", name: "Entertainment", color: "#F033FF", type: "expense" },
  { id: "5", name: "Shopping", color: "#33FFF0", type: "expense" },
  { id: "6", name: "Salary", color: "#FFD700", type: "income" },
  { id: "7", name: "Freelance", color: "#C0C0C0", type: "income" },
  { id: "8", name: "Investments", color: "#90EE90", type: "income" }
];

const currentMonth = new Date().getMonth();
const currentYear = new Date().getFullYear();

const initialTransactions: Transaction[] = [
  {
    id: "1",
    title: "Grocery Shopping",
    amount: 120.50,
    type: "expense",
    category: "Food & Dining",
    date: formatISO(new Date(currentYear, currentMonth, 5)),
    notes: "Weekly grocery shopping"
  },
  {
    id: "2",
    title: "Monthly Salary",
    amount: 3500,
    type: "income",
    category: "Salary",
    date: formatISO(new Date(currentYear, currentMonth, 1)),
    notes: "Monthly salary payment"
  },
  {
    id: "3",
    title: "Rent Payment",
    amount: 1200,
    type: "expense",
    category: "Housing",
    date: formatISO(new Date(currentYear, currentMonth, 3)),
    notes: "Monthly rent"
  },
  {
    id: "4",
    title: "Freelance Project",
    amount: 850,
    type: "income",
    category: "Freelance",
    date: formatISO(new Date(currentYear, currentMonth, 15)),
    notes: "Website design project"
  },
  {
    id: "5",
    title: "Dinner with Friends",
    amount: 85.25,
    type: "expense",
    category: "Food & Dining",
    date: formatISO(new Date(currentYear, currentMonth, 18)),
    notes: "Dinner at Italian restaurant"
  },
  {
    id: "6",
    title: "Movie Tickets",
    amount: 30,
    type: "expense",
    category: "Entertainment",
    date: formatISO(new Date(currentYear, currentMonth, 20)),
    notes: "Two tickets for new release"
  },
  {
    id: "7",
    title: "Gas",
    amount: 45.75,
    type: "expense",
    category: "Transportation",
    date: formatISO(new Date(currentYear, currentMonth, 8)),
    notes: "Fuel for the week"
  }
];

export const ExpenseProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  // Calculate financial summaries
  const income = transactions
    .filter(t => t.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
    
  const expenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
    
  const balance = income - expenses;

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction = {
      ...transaction,
      id: Math.random().toString(36).substring(2, 9),
    };
    setTransactions(prev => [...prev, newTransaction]);
  };

  const editTransaction = (id: string, updatedFields: Partial<Transaction>) => {
    setTransactions(prev =>
      prev.map(transaction =>
        transaction.id === id ? { ...transaction, ...updatedFields } : transaction
      )
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id));
  };

  const addCategory = (category: Omit<Category, "id">) => {
    const newCategory = {
      ...category,
      id: Math.random().toString(36).substring(2, 9),
    };
    setCategories(prev => [...prev, newCategory]);
  };

  return (
    <ExpenseContext.Provider
      value={{
        transactions,
        categories,
        addTransaction,
        editTransaction,
        deleteTransaction,
        addCategory,
        balance,
        income,
        expenses
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error("useExpense must be used within an ExpenseProvider");
  }
  return context;
};
