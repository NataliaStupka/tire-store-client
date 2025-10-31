import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchTiresByCategory } from "../../redux/tire/operations";
import {
  selectIsError,
  selectIsLoading,
  selectTiresByCategory,
} from "../../redux/tire/selectors";
import { TiresCatalog } from "../../components/TiresCatalog/TiresCatalog";
import LoaderComponent from "../../components/Loader/Loader";
import { clearTiresByCategory } from "../../redux/tire/slice";
import s from "./CategoryTirePage.module.css";
import { nanoid } from "@reduxjs/toolkit";
import { fetchTiresBySize } from "../../redux/filter/operations";
import { selectTiresBySize } from "../../redux/filter/selectors";
import { changeFilter } from "../../redux/filter/slice";

const categoryTranslation = {
  loader: "Погрузочні шини",
  industrial: "Індустріальні шини",
  agricultural: "Сільськогосподарські шини",
  rims: "Диски",
};

const diametrRims = [13, 15, 16, 17, 18, 20, 22, 26, 28, 30, 32, 38, 42];

const CategoryTirePage = () => {
  const dispatch = useDispatch();
  const tiresByCategory = useSelector(selectTiresByCategory);

  const { item: category } = useParams(); //яка категорія

  const isLoading = useSelector(selectIsLoading);
  const isError = useSelector(selectIsError);

  const rimsFilter = useSelector(selectTiresBySize);

  useEffect(() => {
    if (category) {
      dispatch(clearTiresByCategory()); // очищаємо стан перед запитом
      dispatch(fetchTiresByCategory(category));
      dispatch(changeFilter()); // очищає стан фільтра, при переході на іншу категорію
    }
  }, [dispatch, category]);

  return (
    <main>
      <section className={s.section}>
        <div className="container">
          <h1 className={s.title}>
            {categoryTranslation[category] || "Категорія"}
          </h1>

          {category === "rims" && (
            <div className={s.filterBlock}>
              <p className={s.filterLabel}>Фільтр за діаметром:</p>
              <ul className={s.diameterList}>
                {diametrRims.map((item) => (
                  <li key={nanoid()}>
                    <button
                      type="button"
                      className={s.diameterButton}
                      onClick={() =>
                        dispatch(
                          fetchTiresBySize({ size: item, category: "rims" })
                        )
                      }
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {isLoading ? (
            <div className={s.loaderWrap}>
              <LoaderComponent />
            </div>
          ) : isError ? (
            <p className={s.errorText}>
              Сталася помилка: <span>{isError}</span>
            </p>
          ) : rimsFilter.length > 0 ? (
            <TiresCatalog tires={rimsFilter} />
          ) : tiresByCategory.length > 0 ? (
            <TiresCatalog tires={tiresByCategory} />
          ) : (
            <p className={s.emptyText}>Наразі в цій категорії немає товарів.</p>
          )}
        </div>
      </section>
    </main>
  );
};

export default CategoryTirePage;
