
import React, { useState } from "react";
import TransactionsTable from "@/components/transactions/TransactionsTable";
import TransactionDialog from "@/components/transactions/TransactionDialog";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useExpense, Transaction } from "@/contexts/ExpenseContext";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const Transactions = () => {
  const {
    transactions,
    categories,
    addTransaction,
    editTransaction,
    deleteTransaction,
  } = useExpense();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(
    null
  );
  const [filterType, setFilterType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const handleAddTransaction = (transactionData: any) => {
    addTransaction(transactionData);
    toast({
      title: "Transaction added",
      description: "Your transaction has been added successfully.",
    });
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsDialogOpen(true);
  };

  const handleUpdateTransaction = (transactionData: any) => {
    if (editingTransaction) {
      editTransaction(editingTransaction.id, transactionData);
      toast({
        title: "Transaction updated",
        description: "Your transaction has been updated successfully.",
      });
      setEditingTransaction(null);
    }
  };

  const handleDeleteTransaction = (id: string) => {
    deleteTransaction(id);
    toast({
      title: "Transaction deleted",
      description: "Your transaction has been deleted successfully.",
      variant: "destructive",
    });
  };

  const openAddDialog = () => {
    setEditingTransaction(null);
    setIsDialogOpen(true);
  };

  const filteredTransactions = transactions.filter((transaction) => {
    // Apply type filter
    if (filterType !== "all" && transaction.type !== filterType) {
      return false;
    }
    
    // Apply search filter (case insensitive)
    if (
      searchTerm &&
      !transaction.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !transaction.notes?.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
        <Button onClick={openAddDialog}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-1/3">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="expense">Expenses</SelectItem>
              <SelectItem value="income">Income</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-2/3">
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <TransactionsTable
        transactions={filteredTransactions}
        onEditTransaction={handleEditTransaction}
        onDeleteTransaction={handleDeleteTransaction}
      />

      <TransactionDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={editingTransaction ? handleUpdateTransaction : handleAddTransaction}
        categories={categories}
        transaction={editingTransaction ?? undefined}
      />
    </div>
  );
};

export default Transactions;
