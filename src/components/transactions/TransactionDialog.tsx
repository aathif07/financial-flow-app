
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, IndianRupeeIcon, BanknoteIcon } from "lucide-react";
import { formatISO } from "date-fns";
import { Transaction, Category, TransactionType, useExpense } from "@/contexts/ExpenseContext";

interface TransactionDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (transaction: Omit<Transaction, "id">) => void;
  categories: Category[];
  transaction?: Transaction;
}

export const TransactionDialog: React.FC<TransactionDialogProps> = ({
  open,
  onClose,
  onSubmit,
  categories,
  transaction,
}) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<TransactionType>("expense");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [notes, setNotes] = useState("");
  const { getCurrencySymbol, getSavingSuggestions } = useExpense();
  const currencySymbol = getCurrencySymbol();
  const savingSuggestions = getSavingSuggestions();

  const isEditing = !!transaction;

  // Reset form or populate with transaction data when dialog opens
  useEffect(() => {
    if (open) {
      if (transaction) {
        setTitle(transaction.title);
        setAmount(transaction.amount.toString());
        setType(transaction.type);
        setCategory(transaction.category);
        setDate(new Date(transaction.date));
        setNotes(transaction.notes || "");
      } else {
        // Reset form for new transaction
        setTitle("");
        setAmount("");
        setType("expense");
        setCategory("");
        setDate(new Date());
        setNotes("");
      }
    }
  }, [open, transaction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newTransaction: Omit<Transaction, "id"> = {
      title,
      amount: parseFloat(amount),
      type,
      category,
      date: formatISO(date),
      notes: notes.trim() || undefined,
    };
    
    onSubmit(newTransaction);
    onClose();
  };

  // Filter categories based on selected transaction type
  const filteredCategories = categories.filter(c => c.type === type);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Transaction" : "Add New Transaction"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Transaction title"
                required
              />
            </div>
            
            <div>
              <label htmlFor="amount" className="block text-sm font-medium mb-1">
                Amount ({currencySymbol})
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  {currencySymbol}
                </span>
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="pl-8"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="type" className="block text-sm font-medium mb-1">
                Type
              </label>
              <Select 
                value={type} 
                onValueChange={(value: TransactionType) => {
                  setType(value);
                  setCategory(""); // Reset category when type changes
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-1">
                Category
              </label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {filteredCategories.length === 0 ? (
                    <SelectItem value="" disabled>
                      No categories available
                    </SelectItem>
                  ) : (
                    filteredCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name}>
                        {cat.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <label htmlFor="notes" className="block text-sm font-medium mb-1">
                Notes (Optional)
              </label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add additional notes here"
                rows={3}
              />
            </div>

            {type === "expense" && !isEditing && (
              <div className="bg-muted p-3 rounded-lg">
                <h4 className="font-medium text-sm mb-2 flex items-center">
                  <BanknoteIcon className="h-4 w-4 mr-2" />
                  Saving Suggestions
                </h4>
                <ul className="space-y-2 text-sm">
                  {savingSuggestions.map((suggestion, index) => (
                    <li key={index} className="text-muted-foreground">
                      {suggestion.description}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? "Update" : "Add"} Transaction
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDialog;
