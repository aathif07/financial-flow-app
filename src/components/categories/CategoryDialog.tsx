
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
import { Category, TransactionType } from "@/contexts/ExpenseContext";

interface CategoryDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (category: Omit<Category, "id">) => void;
  category?: Category;
}

const DEFAULT_COLORS = [
  "#FF5733", "#33FF57", "#3357FF", "#F033FF", "#33FFF0", 
  "#FFD700", "#C0C0C0", "#90EE90", "#FFA07A", "#87CEFA"
];

export const CategoryDialog: React.FC<CategoryDialogProps> = ({
  open,
  onClose,
  onSubmit,
  category,
}) => {
  const [name, setName] = useState("");
  const [color, setColor] = useState(DEFAULT_COLORS[0]);
  const [type, setType] = useState<TransactionType>("expense");

  const isEditing = !!category;

  // Reset form or populate with category data when dialog opens
  useEffect(() => {
    if (open) {
      if (category) {
        setName(category.name);
        setColor(category.color);
        setType(category.type);
      } else {
        // Reset form for new category
        setName("");
        setColor(DEFAULT_COLORS[0]);
        setType("expense");
      }
    }
  }, [open, category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newCategory: Omit<Category, "id"> = {
      name,
      color,
      type,
    };
    
    onSubmit(newCategory);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Category" : "Add New Category"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Name
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Category name"
                required
              />
            </div>
            
            <div>
              <label htmlFor="type" className="block text-sm font-medium mb-1">
                Type
              </label>
              <Select 
                value={type} 
                onValueChange={(value: TransactionType) => setType(value)}
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
              <label className="block text-sm font-medium mb-2">
                Color
              </label>
              <div className="grid grid-cols-5 gap-2">
                {DEFAULT_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={cn(
                      "h-8 w-8 rounded-full border-2",
                      color === c ? "border-primary" : "border-transparent"
                    )}
                    style={{ backgroundColor: c }}
                    onClick={() => setColor(c)}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? "Update" : "Add"} Category
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryDialog;
