// Page збирає все разом
import { useMemo } from "react";

import { useCategoryProductsPage } from "../../hooks/useCategoryProductsPage"; //redux, dispatch, selectors, useParams, useEffect, локальний state, (notFound pagesArray)

import s from "./CategoryProductsPage.module.css";

import { ProductsCatalog } from "../../components/ProductsCatalog/ProductsCatalog";
import LoaderComponent from "../../components/Loader/Loader";
import { FilterDiametersRims } from "../../components/FilterDiametersRims/FilterDiametersRims";
import Pagination from "../../components/Pagination/Pagination";
import { Seo } from "../../components/Seo/Seo";

const categoryDescriptions = {
  loader:
    "Шини, гума та колеса для різних видів навантажувачів і складської техніки. Надійні покришки для інтенсивної роботи, допомога з підбором. Висока зносостійкість, прямі поставки від виробників. Доставка по Україні.",
  industrial:
    "Індустріальні та промислові шини для спецтехніки, будівельних і дорожніх машин. Офіційна гарантія, допомога з підбором розміру. Доставка по Україні.",
  agricultural:
    "Сільськогосподарські шини (сільгоспгума) для різних видів агротехніки та причіпного обладнання. Надійні покришки від перевірених виробників з доставкою по Україні.",
  car: "Шини для легкових автомобілів у великому асортименті. Підбір за типорозміром та маркою, відправка по Україні.",
  rims: "Колісні диски різних діаметрів для авто, вантажного транспорту та спецтехніки. Різні діаметри та кріплення. Доставка по Україні.",
};

const categoryTranslation = {
  loader: "Шини для навантажувачів",
  industrial: "Індустріальні шини",
  agricultural: "Сільськогосподарські шини",
  car: "Шини для легкових автомобілів",
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

  const categoryTitle = categoryTranslation[category] || "Каталог товарів";
  const categoryDesc = categoryDescriptions[category];

  return (
    <main>
      <section className={s.section}>
        
        <Seo
          title={`${categoryTitle} — купити в Україні, каталог`}
          description={categoryDesc}
          canonicalPath={`/category/${category}`}
        />

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
