
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Category } from "@/contexts/ExpenseContext";

type Budget = {
  category: string;
  amount: number;
  spent: number;
  color: string;
  period: "weekly" | "monthly" | "yearly";
};

interface BudgetDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (budget: Omit<Budget, "spent">) => void;
  categories: Category[];
  budget?: Budget;
}

export const BudgetDialog: React.FC<BudgetDialogProps> = ({
  open,
  onClose,
  onSubmit,
  categories,
  budget,
}) => {
  const [category, setCategory] = useState("");
  const [color, setColor] = useState("");
  const [amount, setAmount] = useState("");
  const [period, setPeriod] = useState<"weekly" | "monthly" | "yearly">("monthly");

  const isEditing = !!budget;

  const filteredCategories = categories.filter(cat => cat.type === "expense");

  // Reset form or populate with budget data when dialog opens
  useEffect(() => {
    if (open) {
      if (budget) {
        setCategory(budget.category);
        setColor(budget.color);
        setAmount(budget.amount.toString());
        setPeriod(budget.period);
      } else {
        // Reset form for new budget
        if (filteredCategories.length > 0) {
          setCategory(filteredCategories[0].name);
          setColor(filteredCategories[0].color);
        } else {
          setCategory("");
          setColor("");
        }
        setAmount("");
        setPeriod("monthly");
      }
    }
  }, [open, budget, filteredCategories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category || !amount || parseFloat(amount) <= 0) return;
    
    const newBudget: Omit<Budget, "spent"> = {
      category,
      amount: parseFloat(amount),
      color: color || (filteredCategories.find(c => c.name === category)?.color || "#6E56CF"),
      period,
    };
    
    onSubmit(newBudget);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Budget" : "Add New Budget"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-1">
                Category
              </label>
              {filteredCategories.length > 0 ? (
                <Select 
                  value={category} 
                  onValueChange={setCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredCategories.map((cat) => (
                      <SelectItem 
                        key={cat.name} 
                        value={cat.name}
                        onClick={() => setColor(cat.color)}
                      >
                        <div className="flex items-center">
                          <div 
                            className="h-3 w-3 rounded-full mr-2"
                            style={{ backgroundColor: cat.color }} 
                          />
                          {cat.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No expense categories found. Please create categories first.
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="amount" className="block text-sm font-medium mb-1">
                Budget Amount
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                  $
                </span>
                <Input
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  type="number"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="pl-7"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="period" className="block text-sm font-medium mb-1">
                Period
              </label>
              <Select value={period} onValueChange={(value: "weekly" | "monthly" | "yearly") => setPeriod(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? "Update" : "Add"} Budget
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BudgetDialog;
