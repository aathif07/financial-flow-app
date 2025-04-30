
import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction, Category } from "@/contexts/ExpenseContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

interface CategorySummaryProps {
  transactions: Transaction[];
  categories: Category[];
}

interface CategoryData {
  name: string;
  amount: number;
  color: string;
  percentage: number;
}

export const CategorySummary: React.FC<CategorySummaryProps> = ({
  transactions,
  categories,
}) => {
  const categoryData = useMemo(() => {
    // Filter expense transactions
    const expenseTransactions = transactions.filter(t => t.type === "expense");
    
    // Calculate total expenses
    const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    // Group by category and calculate amounts
    const expensesByCategory: Record<string, number> = {};
    expenseTransactions.forEach(t => {
      expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
    });
    
    // Map to formatted data with percentage and color
    return Object.entries(expensesByCategory)
      .map(([name, amount]) => {
        const category = categories.find(c => c.name === name);
        return {
          name,
          amount,
          color: category?.color || "#CBD5E0",
          percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
        };
      })
      .sort((a, b) => b.amount - a.amount);
  }, [transactions, categories]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense by Category</CardTitle>
      </CardHeader>
      <CardContent>
        {categoryData.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No expense data available
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Percentage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categoryData.map((category) => (
                <TableRow key={category.name}>
                  <TableCell>
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: category.color }}
                      />
                      {category.name}
                    </div>
                  </TableCell>
                  <TableCell>${category.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex items-center w-full gap-2">
                      <Progress value={category.percentage} className="h-2" />
                      <span className="text-xs w-12 text-right">
                        {category.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default CategorySummary;
