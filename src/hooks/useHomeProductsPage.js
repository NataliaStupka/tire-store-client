import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import {
  selectCurrentPage,
  selectIsLoading,
  selectSearchResults,
  selectTotalPages,
} from "../redux/catalog/selectors";
import { fetchProducts } from "../redux/catalog/operations";
import { clearSearchResult } from "../redux/catalog/slice";

export const useHomeProductsPage = () => {
  const dispatch = useDispatch();
  // ---------- STATE ------------ //
  const products = useSelector(selectSearchResults); //⁉️

  // pagination
  const currentPage = useSelector(selectCurrentPage);
  const totalPages = useSelector(selectTotalPages);

  const isLoading = useSelector(selectIsLoading); //filter

  const { size, category, diameter } = useSelector((state) => state.filter);
  const perPage = useSelector((state) => state.catalog.perPage);

  const [searchSize, setSearchSize] = useState(""); // Стан для size

  useEffect(() => {
    dispatch(clearSearchResult());
  }, [dispatch]);

  // ========== RETURN ========== //
  return {
    products,
    isLoading,
    searchSize,
    setSearchSize,
    currentPage,
    totalPages,
    size,
    category,
    diameter,
    perPage,
  };
};
