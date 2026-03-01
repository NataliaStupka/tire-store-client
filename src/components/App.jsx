import { Toaster } from "react-hot-toast";

import { Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import Header from "./Header/Header";
import { Footer } from "./Footer/Footer";
import LoaderComponent from "./Loader/Loader";

// PAGES
import HomePage from "../pages/HomePage/HomePage";
import FavoritePage from "../pages/FavoritePage/FavoritePage";
import CategoryProductsPage from "../pages/CategoryProductsPage/CategoryProductsPage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import { ProductDetailsPage } from "../pages/ProductDetailsPage/ProductDetailsPage";
// STATE
import { selectIsLoggedIn } from "../redux/auth/selectors";
import { refreshUser } from "../redux/auth/operations";

function App() {
  const dispatch = useDispatch();
  // const isLoggedIn = useSelector(selectIsLoggedIn);

  useEffect(() => {
    dispatch(refreshUser());
    // .then(() => {
    //   // console.log("Refresh completed, isLoggedIn:", isLoggedIn);
    // })
    // .catch((err) => {
    //   console.error("Refresh failed:", err.message);
    // });
  }, [dispatch]);

  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/category/:item" element={<CategoryProductsPage />} />

        {/* переробити на category/loader/product/title_size/ */}
        <Route
          path="/product/:productId"
          element={<ProductDetailsPage />}
        ></Route>

        <Route path="/favorite" element={<FavoritePage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
