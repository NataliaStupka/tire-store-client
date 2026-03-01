import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";

import { useModal } from "./useModal";

import { selectFavoriteProducts } from "../redux/catalog/selectors";
import {
  deleteProduct,
  editProduct,
  fetchProducts,
} from "../redux/catalog/operations";
import {
  addFavoriteProduct,
  deleteFavoriteProduct,
} from "../redux/catalog/slice";

export const useProductActions = (product) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { _id, title, size, modelTire: model = "" } = product;
  const { isOpenModal, openModal, closeModal } = useModal();

  // -- 💙 FAVORITES --
  const favoriteProducts = useSelector(selectFavoriteProducts);
  const isFavorite = favoriteProducts.some((item) => item._id === _id);

  const addToFavorites = () => {
    dispatch(addFavoriteProduct(product));
  };
  const removeFromFavorites = () => {
    dispatch(deleteFavoriteProduct(_id));
  };
  //=======

  //--- CATEGORY REFRESH --
  const getCategoryFromPath = () => {
    const categoryMatch = location.pathname.match(/\/category\/(.+)/); //['/category/loader', 'loader'] - наприклад якщо знаходимось на loader
    return categoryMatch?.[1];
  };
  const refreshCategoryProducts = () => {
    const category = getCategoryFromPath();
    if (!category) return;

    dispatch(fetchProducts({ category, page: 1, target: "CATEGORY" })); // Оновлюємо список
  };

  // -- EDIT --
  const updateProduct = async (formData) => {
    //formData - [['size', '+++++'], ['tireType', '']]
    try {
      await dispatch(editProduct({ id: _id, formData })).unwrap();

      refreshCategoryProducts();

      toast.success(`${title} ${size} ${model} оновлено.`);
    } catch (err) {
      toast.error(`Помилка оновлення: ${err.message}`);
    }
  };

  // ---- DELETE ---
  const removeProduct = async () => {
    try {
      await dispatch(deleteProduct(_id)).unwrap();

      refreshCategoryProducts();
      dispatch(deleteFavoriteProduct(_id)); //також видаляємо і з favorite 💙

      toast.success(`${title} ${size} ${model} видалено.`);
    } catch (err) {
      toast.error(`Помилка видалення: ${err.message}`);
    }
  };

  // ---- RETURN --- //
  return {
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    updateProduct,
    removeProduct,
    isOpenModal,
    openModal,
    closeModal,
  };
};
