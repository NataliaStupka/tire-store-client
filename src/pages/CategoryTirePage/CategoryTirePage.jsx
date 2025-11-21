import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchTiresByCategory } from "../../redux/tire/operations";
import {
  selectCurrentPage,
  selectIsError,
  selectIsLoading,
  selectTiresByCategory,
  selectTotalPages,
} from "../../redux/tire/selectors";
import { TiresCatalog } from "../../components/TiresCatalog/TiresCatalog";
import LoaderComponent from "../../components/Loader/Loader";
import { clearTiresByCategory } from "../../redux/tire/slice";
import s from "./CategoryTirePage.module.css";
import {
  fetchRimsDiameters,
  fetchTiresBySize,
} from "../../redux/filter/operations";
import {
  selectRimsDiameters,
  selectSizePage,
  selectSizeTotalPages,
  selectTiresBySize,
} from "../../redux/filter/selectors";
import { changeFilter } from "../../redux/filter/slice";
import { FilterDiametersRims } from "../../components/FilterDiametersRims/FilterDiametersRims";
import Pagination from "../../components/Pagination/Pagination";

const categoryTranslation = {
  loader: "Погрузочні шини",
  industrial: "Індустріальні шини",
  agricultural: "Сільськогосподарські шини",
  rims: "Диски",
};

const CategoryTirePage = () => {
  const dispatch = useDispatch();
  const { item: category } = useParams(); //яка категорія

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

  // клік по діаметру
  const handleDiametrClick = async (diameter) => {
    setSelectedDiameter(diameter);
    setIsFiltering(true); // показуємо loader

    await dispatch(fetchTiresBySize({ size: diameter, category: "rims" }));

    setIsFiltering(false); // ховаємо loader після завершення запиту
  };

  const resetDiameters = () => {
    setSelectedDiameter(null);
    dispatch(changeFilter()); // очищає фільтр
  };

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
    [pagesToShow]
  );
  const handlePageChange = (pageNum) => {
    if (isFilterActive) {
      dispatch(
        fetchTiresBySize({
          size: selectedDiameter,
          category: "rims",
          page: pageNum,
        })
      );
    } else {
      dispatch(
        fetchTiresByCategory({
          category,
          page: pageNum,
        })
      );
    }
  };

  return (
    <main>
      <section className={s.section}>
        <div className="container">
          <h1 className={s.title}>
            {categoryTranslation[category] || "Категорія"}
          </h1>

          {/* кнопки діаметрів */}
          {category === "rims" && (
            <FilterDiametersRims
              rimsDiameters={rimsDiameters}
              selectedDiameter={selectedDiameter}
              onSelect={handleDiametrClick}
              onReset={resetDiameters}
            />
          )}

          {/* Loader → Error → NotFound → Data → Empty */}

          {/* Loader під час фільтрації/завантаження */}
          {(isFiltering || isLoading) && (
            <div className={s.loaderWrap}>
              <LoaderComponent />
            </div>
          )}

          {!isFiltering && !isLoading && (
            <>
              {isError ? ( // Помилка
                <p className={s.errorText}>
                  Сталася помилка: <span>{isError}</span>
                </p>
              ) : notFound ? ( // Порожній результат фільтру
                <>
                  <p className={s.emptyText}>
                    Нічого не знайдено для цього діаметра.
                  </p>
                  <TiresCatalog tires={tiresByCategory} />
                </>
              ) : tiresToShow.length > 0 ? ( // якщо є результати для вибраного діаметра
                <TiresCatalog tires={tiresToShow} />
              ) : (
                <p className={s.emptyText}>
                  Наразі в цій категорії немає товарів.
                </p>
              )}
            </>
          )}

          <Pagination
            pages={pagesArray}
            currentPage={pageNow}
            onPageChange={handlePageChange}
          />
        </div>
      </section>
    </main>
  );
};

export default CategoryTirePage;
