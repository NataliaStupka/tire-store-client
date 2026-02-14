// Page збирає все разом
import { useCategoryTires } from "../../hooks/useCategoryTires"; //redux, dispatch, selectors, useParams, useEffect, локальний state, (notFound, tiresToShow, pagesArray)

import { TiresCatalog } from "../../components/TiresCatalog/TiresCatalog";
import LoaderComponent from "../../components/Loader/Loader";
import s from "./CategoryTirePage.module.css";

import { FilterDiametersRims } from "../../components/FilterDiametersRims/FilterDiametersRims";
import Pagination from "../../components/Pagination/Pagination";

const categoryTranslation = {
  loader: "Погрузочні шини",
  industrial: "Індустріальні шини",
  agricultural: "Сільськогосподарські шини",
  rims: "Диски",
};

const CategoryTirePage = () => {
  const {
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
  } = useCategoryTires();

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
              onSelect={handleDiameterClick}
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
