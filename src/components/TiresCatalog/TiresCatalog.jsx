import { useSelector } from "react-redux";
import { TireItem } from "../TireItem/TireItem";
import {
  selectIsError,
  selectIsLoading,
  selectTiresByCategory,
} from "../../redux/tire/selectors";

import s from "./TiresCatalog.module.css";
import LoaderComponent from "../Loader/Loader";
import { nanoid } from "@reduxjs/toolkit";

export const TiresCatalog = ({ tires: propTires }) => {
  const tiresByCategory = useSelector(selectTiresByCategory);

  const tires = propTires || tiresByCategory;

  const isLoading = useSelector(selectIsLoading);
  const isError = useSelector(selectIsError);

  // console.log("🎃 tires/disks -=-", ...tires);

  return (
    <section>
      <ul className={s.tireList}>
        {/* ---- перенести в окремий компонент ---- */}
        {tires.length > 0 ? (
          tires.map((tire) => (
            <li key={tire._id}>
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

// tire:

// category: "loader";
// createdAt: "2025-10-20T16:50:43.025Z";
// diskModel: "";
// image: "https://res.cloudinary.com/deussughu/image/upload/v1761649465/tires/fsoknnoiqx0alcjuggba.jpg";
// imagePublicId: "tires/fsoknnoiqx0alcjuggba";
// instock: false;
// layering: "";
// loadIndex: "";
// modelTire: "CL403S (STD)";
// price: 67;
// producer: "WEST LAKE ";
// size: "4.00-8";
// tireType: "";
// title: "tire";
// updatedAt: "2025-10-29T08:52:38.732Z";
// _id: "68f668631fea0b46ffcb5894";
