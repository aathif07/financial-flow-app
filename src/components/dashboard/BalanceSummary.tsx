
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";
import { useExpense } from "@/contexts/ExpenseContext";

interface BalanceSummaryProps {
  balance: number;
  income: number;
  expenses: number;
}

export const BalanceSummary: React.FC<BalanceSummaryProps> = ({
  balance,
  income,
  expenses,
}) => {
  const { getCurrencySymbol } = useExpense();
  const currencySymbol = getCurrencySymbol();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {currencySymbol}{balance.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Current balance
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Income</CardTitle>
          <ArrowUp className="h-4 w-4 text-income" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-income">
            {currencySymbol}{income.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Total income
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Expenses</CardTitle>
          <ArrowDown className="h-4 w-4 text-expense" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-expense">
            {currencySymbol}{expenses.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Total expenses
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BalanceSummary;
