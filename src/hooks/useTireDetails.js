import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import {
  selectIsError,
  selectIsLoading,
  selectTireById,
} from "../redux/tire/selectors";
import { useEffect, useRef } from "react";
import { fetchTiresById } from "../redux/tire/operations";

export const useTireDetails = () => {
  // ---------- ACTIONS ------------ //
  const dispatch = useDispatch();

  // ---------- ROUTER STATE ------------ //
  const { tireId } = useParams();
  // console.log(`Деталі про шину id - ${tireId}.`);

  const location = useLocation();

  // ---------- STATE ------------ //
  const tire = useSelector(selectTireById);

  const isLoading = useSelector(selectIsLoading);
  const isError = useSelector(selectIsError);

  // ЯКЩО ДИСК ТО ІНША РОЗМІТКА  ????
  const isTire = tire?.title === "tire";
  const isRim = tire?.title === "rims";

  // ---------- EFFECT ------------ //
  useEffect(() => {
    //   запобігає зайвим запитам
    if (tireId && (!tire || tire._id !== tireId)) {
      dispatch(fetchTiresById(tireId));
    }
  }, [dispatch, tireId, tire]);

  // ==========  LOCAL STATE ========== //
  const goBackLink = useRef(location.state?.from || "/");

  // ========== RETURN ========== //
  return { tire, isTire, isRim, isLoading, isError, goBackLink };
};
