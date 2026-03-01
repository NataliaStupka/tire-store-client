import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useRef } from "react";

import {
  selectIsError,
  selectIsLoading,
  selectProductById,
} from "../redux/catalog/selectors";
import { fetchProductById } from "../redux/catalog/operations";

export const useProductDetailsPage = () => {
  // ---------- ACTIONS ------------ //
  const dispatch = useDispatch();

  // ---------- ROUTER STATE ------------ //
  const { tireId, productId } = useParams();
  // console.log(`Деталі про шину id - ${tireId}.`);
  const id = productId || tireId;

  const location = useLocation();

  // ---------- STATE ------------ //
  const product = useSelector(selectProductById);

  const isLoading = useSelector(selectIsLoading);
  const isError = useSelector(selectIsError);

  // ЯКЩО ДИСК ТО ІНША РОЗМІТКА  ????
  const isTire = product?.title === "tire";
  const isRim = product?.title === "rims";

  // ---------- EFFECT ------------ //
  useEffect(() => {
    //   запобігає зайвим запитам
    if (id && (!product || product._id !== id)) {
      dispatch(fetchProductById(id));
    }
  }, [dispatch, id, product]);

  // ==========  LOCAL STATE ========== //
  const goBackLink = useRef(location.state?.from || "/");

  // ========== RETURN ========== //
  return { product, isTire, isRim, isLoading, isError, goBackLink };
};
