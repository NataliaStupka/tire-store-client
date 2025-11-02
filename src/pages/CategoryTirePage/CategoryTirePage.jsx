import { useEffect, useState } from "react";
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

  //обраний діаметр
  const [selectedDiameter, setSelectedDiameter] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  const rimsFilter = useSelector(selectTiresBySize);

  // завантажуємо всі товари категорії при першому рендері або зміні категорії
  useEffect(() => {
    if (category) {
      dispatch(clearTiresByCategory()); // очищаємо стан перед запитом
      dispatch(fetchTiresByCategory(category));
      dispatch(changeFilter()); // очищає стан фільтра, при переході на іншу категорію

      setSelectedDiameter(null); //скидаємо вибір діаметра
      setNotFound(false);
    }
  }, [dispatch, category]);

  // при виборі діаметра
  const handleDiametrClick = async (diameter) => {
    setSelectedDiameter(diameter);
    setNotFound(false);
    setIsFiltering(true); // показуємо loader
    const resultAction = await dispatch(
      fetchTiresBySize({ size: diameter, category: "rims" })
    );

    console.log("🔥 resultAction", resultAction);
    const data = resultAction.payload?.data || resultAction.payload;
    if (!data || data.length === 0) {
      setNotFound(true);
    }

    setIsFiltering(false); // ховаємо loader після завершення запиту
  };

  //що показуємо
  const tiresToShow =
    selectedDiameter && !notFound ? rimsFilter : tiresByCategory;

  return (
    <main>
      <section className={s.section}>
        <div className="container">
          <h1 className={s.title}>
            {categoryTranslation[category] || "Категорія"}
          </h1>

          {/* кнопки діаметрів */}
          {category === "rims" && (
            <div className={s.filterBlock}>
              <p className={s.filterLabel}>Фільтр за діаметром:</p>
              <div>
                <ul className={s.diameterList}>
                  {diametrRims.map((item) => (
                    <li key={nanoid()}>
                      <button
                        type="button"
                        className={`${s.diameterButton} ${
                          selectedDiameter === item ? s.active : ""
                        }`}
                        onClick={() => handleDiametrClick(item)}
                      >
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>

                {/* кнопка - показати всі диски */}
                {selectedDiameter && (
                  <button
                    type="button"
                    className={s.resetButton}
                    onClick={() => {
                      setSelectedDiameter(null);
                      setNotFound(false);
                      dispatch(changeFilter()); // очищає фільтр
                    }}
                  >
                    Показати всі диски
                  </button>
                )}
              </div>
            </div>
          )}

          {/* 🌀 Loader під час фільтрації */}
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
        </div>
      </section>
    </main>
  );
};

export default CategoryTirePage;
