import React, { createContext, useContext, useState } from "react";

type CategoryId = "real talk" | "relationships" | "sex" | "dating" | "vibes";

interface CategoryContextProps {
  selectedCategories: Record<CategoryId, boolean>;
  toggleCategory: (categoryId: CategoryId) => void;
}

const CategoryContext = createContext<CategoryContextProps | undefined>(
  undefined
);

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedCategories, setSelectedCategories] = useState<
    Record<CategoryId, boolean>
  >({
    "real talk": false,
    relationships: false,
    sex: false,
    dating: false,
    vibes: false,
  });

  const toggleCategory = (categoryId: CategoryId) => {
    setSelectedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  return (
    <CategoryContext.Provider value={{ selectedCategories, toggleCategory }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategory = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategory must be used within a CategoryProvider");
  }
  return context;
};

export default CategoryContext;
