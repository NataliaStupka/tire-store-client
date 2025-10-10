import s from "./HomePage.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAllTires,
  selectIsError,
  // selectIsLoading,
} from "../../redux/tire/selectors";
import { selectFilterLoading } from "../../redux/filter/selectors";
import { useEffect, useState } from "react";
import { fetchAllTires } from "../../redux/tire/operations";
import LoaderComponent from "../../components/Loader/Loader";
import { CategoryList } from "../../components/CategoryList/CategoryList";
import { SearchBar } from "../../components/SearchBar/SearchBar";
import { selectTiresBySize } from "../../redux/filter/selectors";
import { TiresCatalog } from "../../components/TiresCatalog/TiresCatalog";
// import { Helmet } from "react-helmet";

// const category = ["loader", "industrial", "agricultural", "rims"];

const HomePage = () => {
  //
  const dispatch = useDispatch();
  const allTires = useSelector(selectAllTires);
  const tiresBySize = useSelector(selectTiresBySize);

  const isLoading = useSelector(selectFilterLoading); //filter
  const isError = useSelector(selectIsError);

  const [searchSize, setSearchSize] = useState(""); // Стан для size

  useEffect(() => {
    // document.title = "Tire Store | Home"; ////???
    dispatch(fetchAllTires());
  }, [dispatch]);

  return (
    <main>
      <div className={s.homePage}>
        <section className={s.hero}>
          <h1>Шини для будь-якої техніки</h1>
          <p>
            Великий вибір шин для навантажувачів, сільськогосподарської та
            промислової техніки.
          </p>
        </section>

        <section className={s.category}>
          <CategoryList />
        </section>

        <section>
          <SearchBar onSizeChange={setSearchSize} />

          {/* searchSize - користувач ввів щось у поле? */}
          {isLoading ? (
            <LoaderComponent />
          ) : tiresBySize.length > 0 ? (
            <>
              <h2>Знайдені шини:</h2>
              <TiresCatalog tires={tiresBySize} />
            </>
          ) : (
            searchSize && <p>Нічого не знайдено.</p>
          )}
        </section>
      </div>
    </main>
  );
};

export default HomePage;
