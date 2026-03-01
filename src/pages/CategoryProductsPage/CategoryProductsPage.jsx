// Page збирає все разом
import { useCategoryProductsPage } from "../../hooks/useCategoryProductsPage"; //redux, dispatch, selectors, useParams, useEffect, локальний state, (notFound pagesArray)

import s from "./CategoryProductsPage.module.css";

import { ProductsCatalog } from "../../components/ProductsCatalog/ProductsCatalog";
import LoaderComponent from "../../components/Loader/Loader";
import { FilterDiametersRims } from "../../components/FilterDiametersRims/FilterDiametersRims";
import Pagination from "../../components/Pagination/Pagination";

const categoryTranslation = {
  loader: "Погрузочні шини",
  industrial: "Індустріальні шини",
  agricultural: "Сільськогосподарські шини",
  rims: "Диски",
};

const CategoryProductsPage = () => {
  const {
    category,
    products, // ДАТИ ІНШУ НАЗВУ???????
    rimsDiameters,
    selectedDiameter,
    isLoading,
    isError,
    pagesArray,
    currentPage,
    handleDiameterClick,
    resetDiameters,
    handlePageChange,
  } = useCategoryProductsPage();

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
          {isLoading && (
            <div className={s.loaderWrap}>
              <LoaderComponent />
            </div>
          )}

          {!isLoading && (
            <>
              {isError ? ( // Помилка
                <p className={s.errorText}>
                  Сталася помилка: <span>{isError}</span>
                </p>
              ) : products.length === 0 ? ( // Порожній результат фільтру
                <>
                  <p className={s.emptyText}>
                    Нічого не знайдено для цього діаметра.
                  </p>
                  <ProductsCatalog products={products} />
                </>
              ) : products.length > 0 ? ( // якщо є результати для вибраного діаметра
                <ProductsCatalog products={products} />
              ) : (
                <p className={s.emptyText}>
                  Наразі в цій категорії немає товарів.
                </p>
              )}
            </>
          )}

          <Pagination
            pages={pagesArray}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </section>
    </main>
  );
};

export default CategoryProductsPage;
