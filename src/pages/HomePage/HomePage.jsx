import { Link, NavLink } from "react-router-dom";
import s from "./HomePage.module.css";
import { nanoid } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAllTires,
  selectIsError,
  selectIsLoading,
} from "../../redux/tire/selectors";
import { useEffect } from "react";
import { fetchAllTires } from "../../redux/tire/operations";
import { TireItem } from "../../components/TireItem/TireItem";
import LoaderComponent from "../../components/Loader/Loader";
import { AddTireForm } from "../../components/AddTireForm/AddTireForm";
// import { Helmet } from "react-helmet";

const category = ["loader", "industrial", "agricultural", "rims"];

const HomePage = () => {
  //
  const dispatch = useDispatch();
  const allTires = useSelector(selectAllTires);

  const isLoading = useSelector(selectIsLoading);
  const isError = useSelector(selectIsError);

  useEffect(() => {
    // document.title = "Tire Store | Home"; ////???
    dispatch(fetchAllTires());
  }, [dispatch]);

  return (
    <main>
      {/* ???? */}
      {/* <Helmet>
        <title>Категорії шин | Магазин Tire Store</title>
        <meta
          name="description"
          content="Вибір шин для спецтехніки та сільгосптехніки."
        />
      </Helmet> */}

      <div className={s.homePage}>
        <section>
          <h1 className={s.titleText}>Категорії Шин</h1>

          <ul className={s.categoryList}>
            {category.map((item) => {
              return (
                <li key={nanoid()} className={s.categoryItem}>
                  <NavLink to={`/category/${item}`}>
                    <div className={s.imageWrapper}>
                      <img src="/tire.jpg" alt={item} />
                    </div>
                    <div>
                      <h3 className={s.categoryTitle}>{item}</h3>
                    </div>
                  </NavLink>
                </li>
              );
            })}
          </ul>

          <p className={s.filterBlock}>БЛОК ФІЛЬТРАЦІЇ</p>
        </section>

        {/* TiresCatalog */}
        <section>
          <h2>All tires:</h2>
          {/* <button className={s.button}>Add tire</button> */}
          <p>Додаємо Шину/Диск в базу даних</p>
          <AddTireForm />

          {isLoading && <LoaderComponent />}
          {isError && <p>Error: {isError}</p>}

          <ul className={s.tireList}>
            {/* ---- перенести в окремий компонент ---- */}
            {allTires.map((tire) => (
              <li className={s.tireItem} key={tire._id}>
                <TireItem tire={tire} />
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Про компанію/магазин</h2>
        </section>
      </div>
    </main>
  );
};

export default HomePage;
