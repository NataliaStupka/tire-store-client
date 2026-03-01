import { useSelector } from "react-redux";
import { ProductItem } from "../ProductItem/ProductItem";

import s from "./ProductsCatalog.module.css";
import LoaderComponent from "../Loader/Loader";

import {
  // selectCatalog,
  selectIsError,
  selectIsLoading,
} from "../../redux/catalog/selectors";

import { nanoid } from "@reduxjs/toolkit";

export const ProductsCatalog = ({ products: propProducts }) => {
  const products = propProducts ?? [];

  const isLoading = useSelector(selectIsLoading);
  const isError = useSelector(selectIsError);

  return (
    <section>
      <ul className={s.productsList}>
        {/* ---- перенести в окремий компонент ---- */}
        {products.length > 0 ? (
          products.map((product) => (
            <li key={product._id}>
              <ProductItem product={product} />
            </li>
          ))
        ) : (
          <p>Шин у цій категорії ще немає.</p>
        )}
      </ul>

      {isLoading && !products.length && <LoaderComponent />}
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
