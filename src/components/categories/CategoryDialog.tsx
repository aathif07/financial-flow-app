
import React, { useState, useEffect } from "react";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Category, TransactionType } from "@/contexts/ExpenseContext";

interface CategoryDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (category: Omit<Category, "id">) => void;
}

const PRESET_COLORS = [
  "#FF5733", "#33FF57", "#3357FF", "#F033FF", "#33FFF0",
  "#FFD700", "#C0C0C0", "#90EE90", "#FF6347", "#4682B4",
  "#9370DB", "#3CB371", "#FF7F50", "#6495ED", "#8A2BE2",
];

export const CategoryDialog: React.FC<CategoryDialogProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState("");
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [type, setType] = useState<TransactionType>("expense");

  useEffect(() => {
    if (open) {
      // Reset form for new category
      setName("");
      setColor(PRESET_COLORS[0]);
      setType("expense");
    }
  }, [open]);

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
          <DialogTitle>Add New Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Category Name
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
              <label className="block text-sm font-medium mb-1">
                Color
              </label>
              <div className="grid grid-cols-5 gap-2">
                {PRESET_COLORS.map((presetColor) => (
                  <div
                    key={presetColor}
                    onClick={() => setColor(presetColor)}
                    className={cn(
                      "h-8 w-8 rounded-full cursor-pointer border-2",
                      color === presetColor ? "border-primary" : "border-transparent"
                    )}
                    style={{ backgroundColor: presetColor }}
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
              Add Category
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryDialog;
