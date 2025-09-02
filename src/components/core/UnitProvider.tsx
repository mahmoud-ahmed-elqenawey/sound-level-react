import React, { createContext, useContext, useState } from "react";

type Unit = "LV" | "dB";

interface UnitContextProps {
  unit: Unit;
  toggleUnit: () => void;
}

const UnitContext = createContext<UnitContextProps | undefined>(undefined);

export const UnitProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [unit, setUnit] = useState<Unit>("LV");

  const toggleUnit = () => {
    setUnit((prev) => (prev === "LV" ? "dB" : "LV"));
  };

  return (
    <UnitContext.Provider value={{ unit, toggleUnit }}>
      {children}
    </UnitContext.Provider>
  );
};

export const useUnit = () => {
  const context = useContext(UnitContext);
  if (!context) {
    throw new Error("useUnit must be used inside UnitProvider");
  }
  return context;
};
