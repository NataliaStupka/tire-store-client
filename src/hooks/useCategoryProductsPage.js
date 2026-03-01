//вся логіка CategoryTirePage
//redux, dispatch, selectors, useParams, useEffect, локальний state, (notFound, pagesArray)

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useMemo } from "react";

import {
  selectCurrentPage,
  selectIsError,
  selectIsLoading,
  selectTotalPages,
  selectRimsDiameters,
  selectCategoryResults,
} from "../redux/catalog/selectors";
import { fetchProducts, fetchRimsDiameters } from "../redux/catalog/operations";

export const useCategoryProductsPage = () => {
  const dispatch = useDispatch();
  const { item: category } = useParams(); //яка категорія

  // ---------- STATE ------------ //

  const products = useSelector(selectCategoryResults); // ⁉️

  //page
  const currentPage = useSelector(selectCurrentPage);
  const totalPages = useSelector(selectTotalPages);

  const isLoading = useSelector(selectIsLoading);
  const isError = useSelector(selectIsError);

  //обраний діаметр
  const rimsDiameters = useSelector(selectRimsDiameters);

  const [selectedDiameter, setSelectedDiameter] = useState(null);

  // ---------- EFFECT ------------ //

  // завантажуємо всі товари категорії при першому рендері або зміні категорії
  useEffect(() => {
    if (!category) return;

    dispatch(
      fetchProducts({
        category,
        page: 1,
        target: "CATEGORY", // куди покласти результат
      }),
    );

    if (category === "rims") {
      dispatch(fetchRimsDiameters());
    }
  }, [dispatch, category]);

  // ---------- ACTIONS ------------ //

  // клік по діаметру
  const handleDiameterClick = (diameter) => {
    console.log("⁉️ diametr?", diameter);
    setSelectedDiameter(diameter);
    console.log("✅Обрали діаметр - ", selectedDiameter);
    dispatch(
      fetchProducts({
        category,
        size: diameter,
        page: 1,
        target: "CATEGORY",
      }),
    );
  };

  const resetDiameters = () => {
    setSelectedDiameter(null);
    dispatch(
      fetchProducts({
        category,
        page: 1,
        target: "CATEGORY",
      }),
    );
  };

  const handlePageChange = (pageNum) => {
    console.log("🔴:", selectedDiameter);

    dispatch(
      fetchProducts({
        category,
        size: selectedDiameter ?? undefined, //ЗВЕРНИ УВАГУ, ЧИ ПРАВИЛЬНО ТУТ??
        page: pageNum,
        target: "CATEGORY",
      }),
    );
  };

  //кількість сторінок для пагінації (при фільтрі за діаметром/при всіх дисках)
  const pagesArray = useMemo(
    () => Array.from({ length: totalPages }, (_, i) => i + 1),
    [totalPages],
  );

  // ========== RETURN ========== //
  return {
    category,
    products,
    rimsDiameters,
    isLoading,
    isError,
    selectedDiameter,
    pagesArray,
    currentPage, // pageNow: currentPage,
    handleDiameterClick,
    resetDiameters,
    handlePageChange,
  };
};
