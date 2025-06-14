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

const categoryTranslation = {
  loader: "Погрузочні шини",
  industrial: "Індустріальні шини",
  agricultural: "Сільськогосподарські шини",
  rims: "Диски",
};

const CategoryTirePage = () => {
  const dispatch = useDispatch();
  const tiresByCategory = useSelector(selectTiresByCategory);

  const { item: category } = useParams(); //яка категорія

  const isLoading = useSelector(selectIsLoading);
  const isError = useSelector(selectIsError);

  useEffect(() => {
    if (category) {
      dispatch(clearTiresByCategory()); // очищаємо стан перед запитом
      dispatch(fetchTiresByCategory(category));
    }
  }, [dispatch, category]);

  return (
    <main>
      <div className="container">
        <h2>Шини для категорії '{categoryTranslation[category]}'.</h2>

        {isLoading ? (
          <LoaderComponent />
        ) : isError ? (
          <p>Error: {isError}</p>
        ) : (
          <TiresCatalog tires={tiresByCategory} />
        )}
      </div>
    </main>
  );
};

export default CategoryTirePage;
