import { useUnit } from "./UnitProvider";

const SoundValue = ({ lv }: any) => {
  const { unit } = useUnit();

  const toDb = (lv: number) => Number(lv) / 1.55;

  const displayValue = unit === "LV" ? lv : toDb(lv);

  return (
    <span>
      {displayValue?.toFixed(2)} {unit}
    </span>
  );
};

export default SoundValue;
