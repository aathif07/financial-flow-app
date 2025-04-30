
import React from "react";
import BalanceSummary from "@/components/dashboard/BalanceSummary";
import TransactionList from "@/components/dashboard/TransactionList";
import ExpenseChart from "@/components/dashboard/ExpenseChart";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useExpense } from "@/contexts/ExpenseContext";
import TransactionDialog from "@/components/transactions/TransactionDialog";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { transactions, categories, addTransaction, balance, income, expenses } =
    useExpense();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const { toast } = useToast();

  const handleAddTransaction = (transactionData: any) => {
    addTransaction(transactionData);
    toast({
      title: "Transaction added",
      description: "Your transaction has been added successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
      </div>

      <BalanceSummary
        balance={balance}
        income={income}
        expenses={expenses}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TransactionList transactions={transactions} />
        <ExpenseChart transactions={transactions} categories={categories} />
      </div>

      <TransactionDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleAddTransaction}
        categories={categories}
      />
    </div>
  );
};

export default Dashboard;
