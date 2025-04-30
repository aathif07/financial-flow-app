
import React from "react";
import BalanceSummary from "@/components/dashboard/BalanceSummary";
import TransactionList from "@/components/dashboard/TransactionList";
import ExpenseChart from "@/components/dashboard/ExpenseChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusIcon, IndianRupeeIcon, DollarSignIcon, EuroIcon, PoundSterlingIcon, BanknoteIcon } from "lucide-react";
import { useExpense } from "@/contexts/ExpenseContext";
import TransactionDialog from "@/components/transactions/TransactionDialog";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const Dashboard = () => {
  const { 
    transactions, 
    categories, 
    addTransaction, 
    balance, 
    income, 
    expenses,
    currency,
    setCurrency,
    getSavingSuggestions
  } = useExpense();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const { toast } = useToast();
  const savingSuggestions = getSavingSuggestions();

  const handleAddTransaction = (transactionData: any) => {
    addTransaction(transactionData);
    toast({
      title: "Transaction added",
      description: "Your transaction has been added successfully.",
    });
  };

  const getCurrencyIcon = (currencyType: string) => {
    switch (currencyType) {
      case "inr": return <IndianRupeeIcon className="h-4 w-4" />;
      case "usd": return <DollarSignIcon className="h-4 w-4" />;
      case "eur": return <EuroIcon className="h-4 w-4" />;
      case "gbp": return <PoundSterlingIcon className="h-4 w-4" />;
      default: return <IndianRupeeIcon className="h-4 w-4" />;
    }
  };

  const handleChangeCurrency = (newCurrency: any) => {
    setCurrency(newCurrency);
    toast({
      title: "Currency Updated",
      description: `Your currency has been set to ${newCurrency.toUpperCase()}.`,
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BanknoteIcon className="h-4 w-4 mr-2" />
              Money Saving Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {savingSuggestions.map((suggestion, index) => (
              <div key={index} className="pb-3 border-b last:border-0 last:pb-0">
                <h4 className="font-medium text-sm">{suggestion.category}</h4>
                <p className="text-sm text-muted-foreground">{suggestion.description}</p>
              </div>
            ))}
            <div className="pt-3 space-y-2">
              <p className="text-sm font-medium">Quick Currency Access:</p>
              <div className="flex flex-wrap gap-2">
                <Badge 
                  variant={currency === "inr" ? "default" : "outline"}
                  className="cursor-pointer flex items-center"
                  onClick={() => handleChangeCurrency("inr")}
                >
                  <IndianRupeeIcon className="h-3 w-3 mr-1" /> INR
                </Badge>
                <Badge 
                  variant={currency === "usd" ? "default" : "outline"}
                  className="cursor-pointer flex items-center"
                  onClick={() => handleChangeCurrency("usd")}
                >
                  <DollarSignIcon className="h-3 w-3 mr-1" /> USD
                </Badge>
                <Badge 
                  variant={currency === "eur" ? "default" : "outline"}
                  className="cursor-pointer flex items-center"
                  onClick={() => handleChangeCurrency("eur")}
                >
                  <EuroIcon className="h-3 w-3 mr-1" /> EUR
                </Badge>
                <Badge 
                  variant={currency === "gbp" ? "default" : "outline"}
                  className="cursor-pointer flex items-center"
                  onClick={() => handleChangeCurrency("gbp")}
                >
                  <PoundSterlingIcon className="h-3 w-3 mr-1" /> GBP
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
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
