import s from "./HomePage.module.css";

import LoaderComponent from "../../components/Loader/Loader";
import { CategoryList } from "../../components/CategoryList/CategoryList";
import { SearchBar } from "../../components/SearchBar/SearchBar";
import { ProductsCatalog } from "../../components/ProductsCatalog/ProductsCatalog";

import { useHomeProductsPage } from "../../hooks/useHomeProductsPage";
// import { Helmet } from "react-helmet";

// const category = ["loader", "industrial", "agricultural", "rims"];

const HomePage = () => {
  const {
    products,
    isLoading,
    searchSize,
    setSearchSize,
    currentPage,
    totalPages,
  } = useHomeProductsPage();

  return (
    <main>
      {/* <div className={s.homePage}> */}

      <section className={s.searchBar}>
        <SearchBar onSizeChange={setSearchSize} />

        {/* searchSize - користувач ввів щось у поле? */}
        {isLoading ? (
          <LoaderComponent />
        ) : products.length > 0 ? (
          <div className="container">
            <ProductsCatalog products={products} />
          </div>
        ) : (
          searchSize && products.length === 0 && <p>Нічого не знайдено.</p>
        )}
      </section>

      <section className={s.hero}>
        <div className="container">
          <h1>Шини для будь-якої техніки</h1>
          <p>
            Великий вибір шин для навантажувачів, сільськогосподарської та
            промислової техніки.
          </p>
        </div>
      </section>

      <section className={s.category}>
        <CategoryList />
      </section>

      {/* </div> */}
    </main>
  );
};

export default HomePage;
