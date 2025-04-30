
import React, { useState } from "react";
import CategoryList from "@/components/categories/CategoryList";
import CategoryDialog from "@/components/categories/CategoryDialog";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useExpense } from "@/contexts/ExpenseContext";
import { useToast } from "@/hooks/use-toast";

const Categories = () => {
  const { categories, addCategory } = useExpense();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAddCategory = (categoryData: any) => {
    addCategory(categoryData);
    toast({
      title: "Category added",
      description: "Your category has been added successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryList categories={categories} type="expense" />
        <CategoryList categories={categories} type="income" />
      </div>

      <CategoryDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleAddCategory}
      />
    </div>
  );
};

export default Categories;
