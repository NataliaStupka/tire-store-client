import { useSelector } from "react-redux";
import { TireItem } from "../TireItem/TireItem";
import {
  selectIsError,
  selectIsLoading,
  selectTiresByCategory,
} from "../../redux/tire/selectors";

import s from "./TiresCatalog.module.css";
import LoaderComponent from "../Loader/Loader";

export const TiresCatalog = () => {
  const tiresByCategory = useSelector(selectTiresByCategory);

  const isLoading = useSelector(selectIsLoading);
  const isError = useSelector(selectIsError);

  return (
    <section>
      <ul className={s.tireList}>
        {/* ---- перенести в окремий компонент ---- */}
        {tiresByCategory.length > 0 ? (
          tiresByCategory.map((tire) => (
            <li
              className={s.tireItem}
              key={tire._id}
              style={{ border: "1px solid red", marginBottom: "20px" }}
            >
              <TireItem tire={tire} />
            </li>
          ))
        ) : (
          <p>Шин у цій категорії ще немає.</p>
        )}
      </ul>

      {isLoading && !tiresByCategory.length && <LoaderComponent />}
      {isError && <p>Error: {isError}</p>}
    </section>
  );
};
