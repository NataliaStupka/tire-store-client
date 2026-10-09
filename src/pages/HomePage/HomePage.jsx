import s from "./HomePage.module.css";

import LoaderComponent from "../../components/Loader/Loader";
import { CategoryList } from "../../components/CategoryList/CategoryList";
import { SearchBar } from "../../components/SearchBar/SearchBar";
import { ProductsCatalog } from "../../components/ProductsCatalog/ProductsCatalog";

import { useHomeProductsPage } from "../../hooks/useHomeProductsPage";
import Pagination from "../../components/Pagination/Pagination";
import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearSearchResult } from "../../redux/catalog/slice";
// import { Helmet } from "react-helmet";

// const category = ["loader", "industrial", "agricultural", "rims"];

const HomePage = () => {
  const {
    products, // []
    hasSearched,
    isLoading,
    currentPage,
    totalPages, //всього сторінок
    handlePageChange,
  } = useHomeProductsPage();

  // //кількість сторінок для пагінації (при фільтрі за діаметром/при всіх дисках)
  // const pagesArray = useMemo(
  //   () => Array.from({ length: totalPages }, (_, i) => i + 1),
  //   [totalPages],
  // );
  const pagesArray = [...Array(totalPages)].map((_, i) => i + 1);

  const location = useLocation();
  const dispatch = useDispatch();

  // useEffect(() => {
  //   console.log("🦊", location.pathname);
  //   if (location.pathname === "/") {
  //     dispatch(clearSearchResult());
  //   }
  // }, [location.pathname, dispatch]);

  useEffect(() => {
    dispatch(clearSearchResult());
  }, [dispatch]);

  return (
    <main>
      {/* <div className={s.homePage}> */}

      <section className={s.hero}>
        <div className="container">
          <h1>
            Шини для будь-якої <span>техніки</span>
          </h1>
          <p>
            Великий вибір шин для навантажувачів, сільськогосподарської та
            промислової техніки.
          </p>
        </div>
      </section>

      <section className={s.category}>
        <CategoryList />
      </section>

      <section className={s.searchBar}>
        <SearchBar />

        {isLoading ? (
          <LoaderComponent />
        ) : products.length > 0 ? (
          <div className="container">
            <ProductsCatalog products={products} />

            <Pagination
              pages={pagesArray}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        ) : (
          hasSearched && products.length === 0 && <p>Нічого не знайдено.</p>
        )}
      </section>

      <section>
        <div className="container">
          <h2>Товар дня:</h2>
        </div>
      </section>

      {/* </div> */}
    </main>
  );
};

export default HomePage;
