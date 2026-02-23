import { nanoid } from "@reduxjs/toolkit";
import s from "./FilterDiametersRims.module.css";

export const FilterDiametersRims = ({
  rimsDiameters,
  selectedDiameter,
  onSelect,
  onReset,
}) => {
  // console.log("???==DIM", rimsDiameters); // [13, 15.3, 15.5, 16, 17, 18, 20, 22.5]
  return (
    // фільтр діаметр диску на сторінці диски
    <div className={s.filterBlock}>
      <p className={s.filterLabel}>Фільтр за діаметром:</p>

      <div>
        <ul className={s.diameterList}>
          {rimsDiameters.map((item) => (
            // <li key={nanoid()}>
            <li key={item}>
              <button
                type="button"
                className={`${s.diameterButton} ${
                  selectedDiameter === item ? s.active : ""
                }`}
                onClick={() => onSelect(item)} //handleDiameterClick
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
