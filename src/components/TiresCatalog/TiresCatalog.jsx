import { useSelector } from "react-redux";
import { TireItem } from "../TireItem/TireItem";
import {
  selectIsError,
  selectIsLoading,
  selectTiresByCategory,
} from "../../redux/tire/selectors";

import s from "./TiresCatalog.module.css";
import LoaderComponent from "../Loader/Loader";

export const TiresCatalog = ({ tires: propTires }) => {
  const tiresByCategory = useSelector(selectTiresByCategory);

  const tires = propTires || tiresByCategory;

  const isLoading = useSelector(selectIsLoading);
  const isError = useSelector(selectIsError);

  return (
    <section>
      <ul className={s.tireList}>
        {/* ---- перенести в окремий компонент ---- */}
        {tires.length > 0 ? (
          tires.map((tire) => (
            <li className={s.tireItem} key={tire._id}>
              <TireItem tire={tire} />
            </li>
          ))
        ) : (
          <p>Шин у цій категорії ще немає.</p>
        )}
      </ul>

      {isLoading && !tires.length && <LoaderComponent />}
      {isError && <p>Error: {isError}</p>}
    </section>
  );
};
