import { useEffect, useState } from "react";
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
  // console.log("‼️State_Page ==", currentPage);

  const isLoading = useSelector(selectIsLoading);
  const isError = useSelector(selectIsError);

  //обраний діаметр
  const rimsDiameters = useSelector(selectRimsDiameters);
  const rimsFilter = useSelector(selectTiresBySize);

  const [selectedDiameter, setSelectedDiameter] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  // завантажуємо всі товари категорії при першому рендері або зміні категорії
  useEffect(() => {
    if (!category) return;

    dispatch(clearTiresByCategory()); // очищаємо стан перед запитом
    dispatch(fetchTiresByCategory({ category, page: 1 }));
    dispatch(changeFilter()); // очищає стан фільтра, при переході на іншу категорію

    setSelectedDiameter(null); //скидаємо вибір діаметра
    setNotFound(false);

    if (category === "rims") {
      dispatch(fetchRimsDiameters());
    }
  }, [dispatch, category]);

  // клік по діаметру
  const handleDiametrClick = async (diameter) => {
    setSelectedDiameter(diameter);
    setNotFound(false);
    setIsFiltering(true); // показуємо loader

    const resultAction = await dispatch(
      fetchTiresBySize({ size: diameter, category: "rims" })
    );

    const data = resultAction.payload?.data || resultAction.payload;
    if (!data || data.length === 0) setNotFound(true);
    setIsFiltering(false); // ховаємо loader після завершення запиту
  };

  //що показуємо
  const isFilterActive = selectedDiameter && !notFound; //обрано діаметр і щось знайдено
  const tiresToShow = isFilterActive ? rimsFilter : tiresByCategory;
  const pagesToShow = (isFilterActive ? sizeTotalPages : totalPages) || 1; //пагінація
  const pageNow = isFilterActive ? sizePage : currentPage;

  const resetDiameters = () => {
    setSelectedDiameter(null);
    setNotFound(false);
    dispatch(changeFilter()); // очищає фільтр
  };

  // LoadMore
  const handleLoadMore = () => {
    console.log("LoadMore");

    if (isFilterActive) {
      dispatch(
        fetchTiresBySize({
          size: selectedDiameter,
          category: "rims",
          page: sizePage + 1,
          append: true,
        })
      );
    } else {
      dispatch(
        fetchTiresByCategory({ category, page: currentPage + 1, append: true })
      ); //append - додасть в кінець списку
    }
  };

  //кількість сторінок для пагінації (при фільтрі за діаметром/при всіх дисках)
  const pagesArray = Array.from({ length: pagesToShow }, (_, i) => i + 1);

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

          {/* Loader під час фільтрації */}
          {isFiltering && (
            <div className={s.loaderWrap}>
              <LoaderComponent />
            </div>
          )}

          {isLoading ? ( // якщо йде запит — показуємо Loader
            <div className={s.loaderWrap}>
              <LoaderComponent />
            </div>
          ) : isError ? ( // якщо сталася помилка
            <p className={s.errorText}>
              Сталася помилка: <span>{isError}</span>
            </p>
          ) : notFound ? ( // якщо запит повернув порожній масив
            <>
              <p className={s.emptyText}>
                Нічого не знайдено для цього діаметра.
              </p>
              <TiresCatalog tires={tiresByCategory} />
            </>
          ) : tiresToShow.length > 0 ? ( // якщо є результати для вибраного діаметра
            <TiresCatalog tires={tiresToShow} />
          ) : (
            !isFiltering && (
              <p className={s.emptyText}>
                Наразі в цій категорії немає товарів.
              </p>
            )
          )}

          <div>
            <ul className={s.pagination}>
              {pagesArray.map((pageNum) => {
                return (
                  <li key={pageNum}>
                    <button
                      className={`${s.pageButton} ${
                        pageNow === pageNum ? s.activePage : ""
                      }`}
                      onClick={() => {
                        console.log(`Button ${pageNum}`);

                        if (isFilterActive) {
                          dispatch(
                            fetchTiresBySize({
                              size: selectedDiameter,
                              category: "rims",
                              page: pageNum,
                              append: false,
                            })
                          );
                        } else {
                          dispatch(
                            fetchTiresByCategory({
                              category,
                              page: pageNum,
                              append: false,
                            })
                          );
                        }
                      }}
                    >
                      {pageNum}
                    </button>
                  </li>
                );
              })}
            </ul>

            {pageNow < pagesToShow && (
              <button onClick={handleLoadMore} className={s.loadMoreBtn}>
                Load more
              </button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default CategoryTirePage;
