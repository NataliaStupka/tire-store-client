import { useDispatch, useSelector } from "react-redux";
import { TireItem } from "../TireItem/TireItem";
import {
  selectIsError,
  selectIsLoading,
  selectTiresByCategory,
} from "../../redux/tire/selectors";

import s from "./TiresCatalog.module.css";
import LoaderComponent from "../Loader/Loader";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { fetchTiresByCategory } from "../../redux/tire/operations";
import { clearTiresByCategory } from "../../redux/tire/slice";

export const TiresCatalog = () => {
  const dispatch = useDispatch();
  const tiresByCategory = useSelector(selectTiresByCategory);
  const { category } = useParams(); // Отримуємо категорію з URL

  useEffect(() => {
    if (category) {
      dispatch(clearTiresByCategory()); // Скидаємо стан перед запитом
      dispatch(fetchTiresByCategory(category));
    }
  }, [dispatch, category]);

  const isLoading = useSelector(selectIsLoading);
  const isError = useSelector(selectIsError);

  return (
    <section>
      <button className={s.button}>Add tire</button>

      <ul className={s.tireList}>
        {/* ---- перенести в окремий компонент ---- */}
        {tiresByCategory.map((tire) => (
          <li
            className={s.tireItem}
            key={tire._id}
            style={{ border: "1px solid red", marginBottom: "20px" }}
          >
            <TireItem tire={tire} />
          </li>
        ))}
      </ul>

      {isLoading && <LoaderComponent />}
      {isError && <p>Error: {isError}</p>}
    </section>
  );
};
