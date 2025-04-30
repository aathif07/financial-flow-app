
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Category } from "@/contexts/ExpenseContext";
import { cn } from "@/lib/utils";

interface CategoryListProps {
  categories: Category[];
  type: "income" | "expense";
}

export const CategoryList: React.FC<CategoryListProps> = ({ categories, type }) => {
  const filteredCategories = categories.filter((cat) => cat.type === type);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="capitalize">{type} Categories</CardTitle>
        <CardDescription>
          Available categories for {type} transactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        {filteredCategories.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No {type} categories available
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-fade-in">
            {filteredCategories.map((category) => (
              <div
                key={category.id}
                className="flex items-center p-3 rounded-md border"
              >
                <div
                  className={cn("h-4 w-4 rounded-full mr-3")}
                  style={{ backgroundColor: category.color }}
                />
                <span>{category.name}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryList;
