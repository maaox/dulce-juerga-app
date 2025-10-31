"use client";

import { Button } from "@/components/ui/button";
import { Beer, Martini, Droplet, Wine } from "lucide-react";

interface CategoryFilterProps {
  selected: string;
  onSelect: (category: string) => void;
}

const categories = [
  { id: "todas", label: "Todas", icon: null },
  { id: "CERVEZA", label: "Cervezas", icon: Beer },
  { id: "TRAGO", label: "Tragos", icon: Martini },
  { id: "SHOT", label: "Shots", icon: Droplet },
  { id: "SIN_ALCOHOL", label: "Sin Alcohol", icon: Wine },
];

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {categories.map((category) => {
        const Icon = category.icon;
        const isSelected = selected === category.id;

        return (
          <Button
            key={category.id}
            variant={isSelected ? "default" : "outline"}
            onClick={() => onSelect(category.id)}
            className="flex-shrink-0 gap-2"
          >
            {Icon && <Icon className="h-4 w-4" />}
            {category.label}
          </Button>
        );
      })}
    </div>
  );
}
