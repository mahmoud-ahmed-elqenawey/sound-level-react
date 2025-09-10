import { useUnit } from "./UnitProvider";

const SoundValue = ({ lv }: any) => {
  const { unit } = useUnit();

  // const toDb = (lv: number) => Number(lv) / 1.55;

  // const displayValue = unit === "LV" ? Number(lv) : toDb(lv);

  //////////

  function convertRange(
    value: number,
    r1: [number, number],
    r2: [number, number]
  ): number {
    return ((value - r1[0]) * (r2[1] - r2[0])) / (r1[1] - r1[0]) + r2[0];
  }

  let converted = convertRange(lv, [40, 300], [30, 130]);

  if (!lv) {
    return "-";
  }
  return (
    <span>
      {unit === "LV" ? lv.toFixed(2) : converted.toFixed(2)} {unit}
    </span>
  );
};

export default SoundValue;
