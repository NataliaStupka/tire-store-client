import { Toaster } from "react-hot-toast";

import { Route, Routes } from "react-router-dom";
import Header from "./Header/Header";
import HomePage from "../pages/HomePage/HomePage";
import FavoritePage from "../pages/FavoritePage/FavoritePage";
import CategoryTirePage from "../pages/CategoryTirePage/CategoryTirePage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import { TireDetailsPage } from "../pages/TireDetailsPage/TireDetailsPage";

function App() {
  return (
    <>
      <Header />
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/category/:item" element={<CategoryTirePage />} />

        {/* переробити на category/loader/tire/title_size/ */}
        <Route path="/tire/:tireId" element={<TireDetailsPage />}></Route>

        <Route path="/favorite" element={<FavoritePage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
