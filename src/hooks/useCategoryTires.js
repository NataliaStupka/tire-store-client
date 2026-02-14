//вся логіка CategoryTirePage
//redux, dispatch, selectors, useParams, useEffect, локальний state, (notFound, tiresToShow, pagesArray)

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  selectCurrentPage,
  selectIsError,
  selectIsLoading,
  selectTiresByCategory,
  selectTotalPages,
} from "../redux/tire/selectors";
import { clearTiresByCategory } from "../redux/tire/slice";
import { fetchTiresByCategory } from "../redux/tire/operations";

import {
  selectRimsDiameters,
  selectSizePage,
  selectSizeTotalPages,
  selectTiresBySize,
} from "../redux/filter/selectors";
import { changeFilter } from "../redux/filter/slice";
import {
  fetchRimsDiameters,
  fetchTiresBySize,
} from "../redux/filter/operations";
import { useMemo } from "react";

export const useCategoryTires = () => {
  const dispatch = useDispatch();
  const { item: category } = useParams(); //яка категорія

  // ---------- STATE ------------ //

  const tiresByCategory = useSelector(selectTiresByCategory);

  //page
  const currentPage = useSelector(selectCurrentPage);
  const totalPages = useSelector(selectTotalPages);
  //page-filter
  const sizeTotalPages = useSelector(selectSizeTotalPages);
  const sizePage = useSelector(selectSizePage);

  const isLoading = useSelector(selectIsLoading);
  const isError = useSelector(selectIsError);

  //обраний діаметр
  const rimsDiameters = useSelector(selectRimsDiameters);
  const rimsFilter = useSelector(selectTiresBySize);

  const [selectedDiameter, setSelectedDiameter] = useState(null);
  const [isFiltering, setIsFiltering] = useState(false);

  // ---------- EFFECT ------------ //

  // завантажуємо всі товари категорії при першому рендері або зміні категорії
  useEffect(() => {
    if (!category) return;

    dispatch(clearTiresByCategory()); // очищаємо стан перед запитом
    dispatch(fetchTiresByCategory({ category, page: 1 }));
    dispatch(changeFilter()); // очищає стан фільтра, при переході на іншу категорію

    setSelectedDiameter(null); //скидаємо вибір діаметра

    if (category === "rims") {
      dispatch(fetchRimsDiameters());
    }
  }, [dispatch, category]);

  // ---------- ACTIONS ------------ //

  // клік по діаметру
  const handleDiameterClick = async (diameter) => {
    setSelectedDiameter(diameter);
    setIsFiltering(true); // показуємо loader
    await dispatch(fetchTiresBySize({ size: diameter, category: "rims" }));
    setIsFiltering(false); // ховаємо loader після завершення запиту
  };

  const resetDiameters = () => {
    setSelectedDiameter(null);
    dispatch(changeFilter()); // очищає фільтр
  };

  const handlePageChange = (pageNum) => {
    //обрано діаметр і щось знайдено
    if (selectedDiameter !== null) {
      dispatch(
        fetchTiresBySize({
          size: selectedDiameter,
          category: "rims",
          page: pageNum,
        }),
      );
    } else {
      dispatch(fetchTiresByCategory({ category, page: pageNum }));
    }
  };

  // ---------- DERIVED STATE ------------ //

  //що показуємо
  const isFilterActive = selectedDiameter !== null; //обрано діаметр і щось знайдено
  const tiresToShow = isFilterActive ? rimsFilter : tiresByCategory;
  // Pagination logic
  const pagesToShow = (isFilterActive ? sizeTotalPages : totalPages) || 1;
  const pageNow = isFilterActive ? sizePage : currentPage;

  // Порожній результат + фільтр активний + невідбувається завантаження/фільтрація
  const notFound =
    isFilterActive && !isFiltering && !isLoading && rimsFilter?.length === 0;

  //кількість сторінок для пагінації (при фільтрі за діаметром/при всіх дисках)
  const pagesArray = useMemo(
    () => Array.from({ length: pagesToShow }, (_, i) => i + 1),
    [pagesToShow],
  );

  // ========== RETURN ========== //
  return {
    category,
    tiresToShow,
    tiresByCategory,
    rimsDiameters,
    isLoading,
    isFiltering,
    isError,
    selectedDiameter,
    notFound,
    pagesArray,
    pageNow,
    handleDiameterClick,
    resetDiameters,
    handlePageChange,
  };
};
