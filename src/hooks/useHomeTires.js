import { useDispatch, useSelector } from "react-redux";
import {
  selectFilterLoading,
  selectTiresBySize,
} from "../redux/filter/selectors";
import { useEffect, useState } from "react";
import { fetchAllTires } from "../redux/tire/operations";
import { selectAllTires } from "../redux/tire/selectors";

export const useHomeTires = () => {
  const dispatch = useDispatch();

  // ---------- STATE ------------ //
  const tiresBySize = useSelector(selectTiresBySize);
  const allTires = useSelector(selectAllTires);

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
  return { tiresBySize, isLoading, searchSize, setSearchSize };
};
