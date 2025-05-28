import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchTiresByCategory } from "../../redux/tire/operations";
import { selectTiresByCategory } from "../../redux/tire/selectors";
import { TiresCatalog } from "../../components/TiresCatalog/TiresCatalog";

const CategoryTirePage = () => {
  const dispatch = useDispatch();
  const tiresByCategory = useSelector(selectTiresByCategory);

  const { item } = useParams(); //яка категорія

  useEffect(() => {
    dispatch(fetchTiresByCategory(item));
  }, [dispatch]);

  return (
    <main>
      <div className="container">
        <h2>Шини для категорії: '{item}'.</h2>
        <TiresCatalog tires={tiresByCategory} />
      </div>
    </main>
  );
};

export default CategoryTirePage;
