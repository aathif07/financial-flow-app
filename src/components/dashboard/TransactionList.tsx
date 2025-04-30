
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, parseISO } from "date-fns";
import { Transaction } from "@/contexts/ExpenseContext";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TransactionListProps {
  transactions: Transaction[];
  limit?: number;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  limit = 5,
}) => {
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentTransactions.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No transactions yet
            </p>
          ) : (
            recentTransactions.map((transaction) => (
              <div 
                key={transaction.id} 
                className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0 animate-fade-in"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{transaction.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {format(parseISO(transaction.date), "MMM dd, yyyy")}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{transaction.category}</Badge>
                  <span
                    className={cn(
                      "font-medium",
                      transaction.type === "income"
                        ? "text-income"
                        : "text-expense"
                    )}
                  >
                    {transaction.type === "income" ? "+" : "-"}$
                    {transaction.amount.toFixed(2)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionList;
