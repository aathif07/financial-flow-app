
import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Transaction } from "@/contexts/ExpenseContext";
import { format, parseISO, startOfMonth, isSameMonth, subMonths } from "date-fns";

interface MonthlyExpenseChartProps {
  transactions: Transaction[];
}

export const MonthlyExpenseChart: React.FC<MonthlyExpenseChartProps> = ({
  transactions,
}) => {
  const chartData = useMemo(() => {
    const currentDate = new Date();
    const months = Array.from({ length: 6 }, (_, i) => subMonths(currentDate, 5 - i));
    
    return months.map(month => {
      const monthStart = startOfMonth(month);
      const monthExpenses = transactions
        .filter(t => t.type === "expense" && isSameMonth(parseISO(t.date), monthStart))
        .reduce((sum, t) => sum + t.amount, 0);
      
      const monthIncome = transactions
        .filter(t => t.type === "income" && isSameMonth(parseISO(t.date), monthStart))
        .reduce((sum, t) => sum + t.amount, 0);
      
      return {
        name: format(monthStart, "MMM"),
        expenses: monthExpenses,
        income: monthIncome,
      };
    });
  }, [transactions]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Overview</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value: number) => [`$${value.toFixed(2)}`, '']} 
              labelFormatter={(label) => `Month: ${label}`}
            />
            <Bar dataKey="income" name="Income" fill="#4ade80" />
            <Bar dataKey="expenses" name="Expenses" fill="#ea384c" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default MonthlyExpenseChart;
