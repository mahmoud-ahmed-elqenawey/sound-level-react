import React from "react";
import { useUnit } from "./UnitProvider";

const UnitToggle: React.FC = () => {
  const { unit, toggleUnit } = useUnit();

  return (
    <button
      onClick={toggleUnit}
      className="px-2 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-300"
    >
      عرض {unit === "LV" ? "dB" : "LV"}
    </button>
  );
};

export default UnitToggle;
