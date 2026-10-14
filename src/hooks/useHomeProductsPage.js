import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import {
  selectCurrentPage,
  selectHasSearched,
  selectIsLoading,
  selectSearchResults,
  selectTotalPages,
} from "../redux/catalog/selectors";
import { fetchProducts } from "../redux/catalog/operations";
import { setPage } from "../redux/catalog/slice";
import {
  selectCategory,
  selectDiameter,
  selectSize,
} from "../redux/filter/selectors";

export const useHomeProductsPage = () => {
  const dispatch = useDispatch();

  const size = useSelector(selectSize);
  const category = useSelector(selectCategory);
  const diameter = useSelector(selectDiameter);

  // ---------- STATE ------------ //
  const products = useSelector(selectSearchResults); //⁉️
  const hasSearched = useSelector(selectHasSearched);

  // pagination
  const currentPage = useSelector(selectCurrentPage);
  const totalPages = useSelector(selectTotalPages);

  const isLoading = useSelector(selectIsLoading);

  //searchBar
  useEffect(() => {
    if (size || category) {
      dispatch(
        fetchProducts({ size, category, page: currentPage, target: "SEARCH" }),
      );
    }
  }, [size, category, currentPage, dispatch]);

  const handlePageChange = (page) => {
    dispatch(setPage(page));
  };

  // ========== RETURN ========== //
  return {
    products,
    hasSearched,
    isLoading,
    currentPage,
    totalPages,
    category,
    diameter,
    // perPage,
    handlePageChange,
  };
};
