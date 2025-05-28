import { useDispatch, useSelector } from "react-redux";
import { TireItem } from "../TireItem/TireItem";
import { selectIsError, selectIsLoading } from "../../redux/tire/selectors";

import s from "./TiresCatalog.module.css";
import LoaderComponent from "../Loader/Loader";

export const TiresCatalog = ({ tires }) => {
  console.log("TIRES", tires);

  const isLoading = useSelector(selectIsLoading);
  const isError = useSelector(selectIsError);

  return (
    <section>
      <button className={s.button}>Add tire</button>

      {isLoading && <LoaderComponent />}
      {isError && <p>Error: {isError}</p>}

      <ul className={s.tireList}>
        {/* ---- перенести в окремий компонент ---- */}
        {tires.map((tire) => (
          <li className={s.tireItem} key={tire._id}>
            <TireItem tire={tire} />
          </li>
        ))}
      </ul>
    </section>
  );
};
