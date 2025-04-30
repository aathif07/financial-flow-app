
import React from "react";
import MonthlyExpenseChart from "@/components/reports/MonthlyExpenseChart";
import CategorySummary from "@/components/reports/CategorySummary";
import { useExpense } from "@/contexts/ExpenseContext";

const Reports = () => {
  const { transactions, categories } = useExpense();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
      
      <div className="grid grid-cols-1 gap-6">
        <MonthlyExpenseChart transactions={transactions} />
        <CategorySummary transactions={transactions} categories={categories} />
      </div>
    </div>
  );
};

export default Reports;
