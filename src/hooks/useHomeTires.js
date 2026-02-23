import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import {
  selectFilterLoading,
  selectSizePage,
  selectSizeTotalPages,
  selectTiresBySize,
} from "../redux/filter/selectors";

import { fetchAllTires } from "../redux/tire/operations";
import { selectAllTires } from "../redux/tire/selectors";

export const useHomeTires = () => {
  const dispatch = useDispatch();

  // ---------- STATE ------------ //
  const tiresBySize = useSelector(selectTiresBySize);
  const allTires = useSelector(selectAllTires);

  // pagination
  const currentPage = useSelector(selectSizePage);
  const totalPages = useSelector(selectSizeTotalPages);

  const isLoading = useSelector(selectFilterLoading); //filter

  const [searchSize, setSearchSize] = useState(""); // Стан для size

  // ---------- EFFECT ------------ //
  useEffect(() => {
    // document.title = "Tire Store | Home"; ////???
    //робимо запит якщо в Redux не має даних
    if (!allTires.length) {
      dispatch(fetchAllTires());
    }
  }, [dispatch, allTires.length]);

  // ========== RETURN ========== //
  return {
    tiresBySize,
    isLoading,
    searchSize,
    setSearchSize,
    currentPage,
    totalPages,
  };
};
