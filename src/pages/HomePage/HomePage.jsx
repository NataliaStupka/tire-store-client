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
import { CategoryList } from "../../components/CategoryList/CategoryList";
// import { Helmet } from "react-helmet";

// const category = ["loader", "industrial", "agricultural", "rims"];

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
      <div className={s.homePage}>
        <section>
          <CategoryList />
        </section>

        <section>
          <h2 className={s.filterBlock}>БЛОК ПОШУКУ</h2>
        </section>

        {/* Add tire */}
        {/* <section>
          <p>Додаємо Шину/Диск в базу даних</p>
          <AddTireForm />

          {isLoading && <LoaderComponent />}
          {isError && <p>Error: {isError}</p>}
        </section> */}

        <section>
          <h2>Про компанію/магазин</h2>
        </section>
      </div>
    </main>
  );
};

export default HomePage;
