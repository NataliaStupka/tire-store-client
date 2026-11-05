import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectProductsOfDay } from "../../redux/catalog/selectors";
import { fetchProductsOfDay } from "../../redux/catalog/operations";
import { ProductsCatalog } from "../ProductsCatalog/ProductsCatalog";

export const ProductsOfDay = () => {
  const dispatch = useDispatch();

  const productsOfDay = useSelector(selectProductsOfDay);
  console.log("?/?? ProdOfDay", productsOfDay.length);

  useEffect(() => {
    dispatch(fetchProductsOfDay());
  }, [dispatch]);

  return (
    productsOfDay.length > 0 && (
      <>
        <h2>Товар дня:</h2>
        <ProductsCatalog products={productsOfDay} />
      </>
    )
  );
};
