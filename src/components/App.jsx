import { Toaster } from "react-hot-toast";

import { Route, Routes } from "react-router-dom";
import Header from "./Header/Header";
import HomePage from "../pages/HomePage/HomePage";
import FavoritePage from "../pages/FavoritePage/FavoritePage";
import CategoryTirePage from "../pages/CategoryTirePage/CategoryTirePage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import { TireDetailsPage } from "../pages/TireDetailsPage/TireDetailsPage";
import { useDispatch, useSelector } from "react-redux";
import { selectIsLoggedIn } from "../redux/auth/selectors";
import { useEffect } from "react";
import { refreshUser } from "../redux/auth/operations";
import { Footer } from "./Footer/Footer";

function App() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);

  useEffect(() => {
    dispatch(refreshUser())
      .then(() => {
        // console.log("Refresh completed, isLoggedIn:", isLoggedIn);
      })
      .catch((err) => {
        console.error("Refresh failed:", err.message);
      });
  }, [dispatch]);

  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/category/:item" element={<CategoryTirePage />} />

        {/* переробити на category/loader/tire/title_size/ */}
        <Route path="/tire/:tireId" element={<TireDetailsPage />}></Route>

        <Route path="/favorite" element={<FavoritePage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
