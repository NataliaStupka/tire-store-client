import { nanoid } from "@reduxjs/toolkit";
import s from "./FilterDiametersRims.module.css";

export const FilterDiametersRims = ({
  rimsDiameters,
  selectedDiameter,
  onSelect,
  onReset,
}) => {
  return (
    <div className={s.filterBlock}>
      <p className={s.filterLabel}>Фільтр за діаметром:</p>

      <div>
        <ul className={s.diameterList}>
          {rimsDiameters.map((item) => (
            <li key={nanoid()}>
              <button
                type="button"
                className={`${s.diameterButton} ${
                  selectedDiameter === item ? s.active : ""
                }`}
                onClick={() => onSelect(item)} //handleDiametrClick
              >
                {item}
              </button>
            </li>
          ))}
        </ul>

        {/* кнопка - показати всі диски */}
        {selectedDiameter && (
          <button type="button" className={s.resetButton} onClick={onReset}>
            Показати всі диски
          </button>
        )}
      </div>
    </div>
  );
};
