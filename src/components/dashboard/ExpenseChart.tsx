
import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Transaction, Category } from "@/contexts/ExpenseContext";

interface ExpenseChartProps {
  transactions: Transaction[];
  categories: Category[];
}

interface ChartData {
  name: string;
  value: number;
  color: string;
}

export const ExpenseChart: React.FC<ExpenseChartProps> = ({
  transactions,
  categories,
}) => {
  const chartData = useMemo(() => {
    const expenseTransactions = transactions.filter(t => t.type === "expense");
    
    // Group expenses by category and sum them
    const expensesByCategory = expenseTransactions.reduce<Record<string, number>>((acc, transaction) => {
      const { category, amount } = transaction;
      acc[category] = (acc[category] || 0) + amount;
      return acc;
    }, {});
    
    // Map to chart data format
    return Object.entries(expensesByCategory).map(([name, value]) => {
      const categoryObj = categories.find(c => c.name === name);
      return {
        name,
        value,
        color: categoryObj?.color || "#CBD5E0" // Default color if category not found
      };
    }).sort((a, b) => b.value - a.value);
  }, [transactions, categories]);

  // Handle no data case
  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Expense Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <p className="text-muted-foreground">No expense data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ExpenseChart;
