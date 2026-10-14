// Page збирає все разом
import { useMemo } from "react";

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
    totalPages,
    currentPage,
    handleDiameterClick,
    resetDiameters,
    handlePageChange,
  } = useCategoryProductsPage();

  // //кількість сторінок для пагінації (при фільтрі за діаметром/при всіх дисках)
  // const pagesArray = useMemo(
  //   () => Array.from({ length: totalPages }, (_, i) => i + 1),
  //   [totalPages],
  // );
  const pagesArray = [...Array(totalPages)].map((_, i) => i + 1);

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
              ) : products.length === 0 && category === "rims" ? ( // Порожній результат фільтру
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

// {
//   !isLoading && (
//     <>
//       {isError ? (
//         <p className={s.errorText}>
//           Сталася помилка: <span>{isError}</span>
//         </p>
//       ) : products.length > 0 ? (
//         <ProductsCatalog products={products} />
//       ) : category === "rims" && selectedDiameter ? (
//         <p className={s.emptyText}>Нічого не знайдено для цього діаметра.</p>
//       ) : category === "rims" ? (
//         <p className={s.emptyText}>Дисків у цій категорії ще немає.</p>
//       ) : (
//         <p className={s.emptyText}>Шин у цій категорії ще немає.</p>
//       )}
//     </>
//   );
// }
