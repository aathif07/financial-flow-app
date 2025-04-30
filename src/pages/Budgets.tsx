
import React, { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useExpense } from "@/contexts/ExpenseContext";
import BudgetDialog from "@/components/budgets/BudgetDialog";

// Temporary budget data structure until we implement it in context
type Budget = {
  id: string;
  category: string;
  amount: number;
  spent: number;
  color: string;
  period: "weekly" | "monthly" | "yearly";
};

const Budgets = () => {
  const { categories } = useExpense();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Temporary budget data
  const [budgets, setBudgets] = useState<Budget[]>([
    {
      id: "1",
      category: "Food",
      amount: 500,
      spent: 320,
      color: "#FF5733",
      period: "monthly"
    },
    {
      id: "2",
      category: "Entertainment",
      amount: 200,
      spent: 180,
      color: "#33FF57",
      period: "monthly"
    },
    {
      id: "3", 
      category: "Transport",
      amount: 150,
      spent: 80,
      color: "#3357FF",
      period: "monthly"
    }
  ]);

  const handleAddBudget = (budget: Omit<Budget, "id">) => {
    const newBudget = {
      ...budget,
      id: Date.now().toString(),
    };
    
    setBudgets([...budgets, newBudget]);
    toast({
      title: "Budget added",
      description: "Your budget has been added successfully.",
    });
  };

  const getProgressColor = (spent: number, total: number) => {
    const percentage = (spent / total) * 100;
    if (percentage > 90) return "bg-destructive";
    if (percentage > 75) return "bg-orange-500";
    return "bg-primary";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Budgets</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Budget
        </Button>
      </div>

      {budgets.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-muted-foreground text-center mb-4">
              No budgets set up yet. Create your first budget to track your spending.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Your First Budget
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map((budget) => {
            const percentage = Math.round((budget.spent / budget.amount) * 100);
            const isOverBudget = budget.spent > budget.amount;
            const progressColor = getProgressColor(budget.spent, budget.amount);
            
            return (
              <Card key={budget.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="flex justify-between">
                    <span>{budget.category}</span>
                    <span className="text-sm font-normal text-muted-foreground capitalize">
                      {budget.period}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between mb-2 items-end">
                    <span className="text-2xl font-bold">${budget.spent}</span>
                    <span className="text-muted-foreground">of ${budget.amount}</span>
                  </div>
                  <Progress 
                    value={percentage > 100 ? 100 : percentage} 
                    className={`h-2 mb-1 ${isOverBudget ? "bg-muted" : ""}`}
                    // Fix: Using className instead of indicatorClassName
                    // The Progress component's indicator uses the bg-primary class by default
                  />
                  <div className="flex justify-between text-sm mt-1">
                    <span>{percentage}% used</span>
                    <span>{isOverBudget ? (
                      <span className="text-destructive flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Over budget by ${(budget.spent - budget.amount).toFixed(2)}
                      </span>
                    ) : (
                      <span>${(budget.amount - budget.spent).toFixed(2)} left</span>
                    )}</span>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/30 py-2">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: budget.color }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      <BudgetDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleAddBudget}
        categories={categories}
      />
    </div>
  );
};

export default Budgets;
