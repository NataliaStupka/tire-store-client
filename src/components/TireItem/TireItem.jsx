import { Link } from "react-router-dom";
import s from "./TireItem.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteTire,
  editTire,
  fetchTiresByCategory,
} from "../../redux/tire/operations";
import toast from "react-hot-toast";
import {
  selectFavoriteTires,
  selectTireById,
} from "../../redux/tire/selectors";
import { addFavoriteTire, deleteFavoriteTire } from "../../redux/tire/slice";
import { EditTireForm } from "../EditTireForm/EditTireForm";
import { useEffect, useState } from "react";
import Modal from "../Modal/Modal";
import { useModal } from "../../hooks/useModal";
import { selectUserRole } from "../../redux/auth/selectors";
import clsx from "clsx";
import sprite from "../../assets/sprite.svg";

export const TireItem = ({ tire }) => {
  const dispatch = useDispatch();
  const tireDetails = useSelector(selectTireById); // Не використовується, якщо ініціалізуємо з props
  const { isOpenModal, openModal, closeModal } = useModal();
  const userRole = useSelector(selectUserRole);

  // Розпаковуємо поля для зручності рендеру
  const {
    _id,
    title,
    size,
    modelTire: model = "",
    producer,
    price,
    category,
    tireType,
    loadIndex,
    layering,
    instock,
    diskModel,
    image,
  } = tire;

  // -- ♥️ --
  const favoriteTires = useSelector(selectFavoriteTires);
  const isFavorite = favoriteTires.some((tire) => tire._id === _id);

  const handleAddFavorite = () => {
    dispatch(addFavoriteTire(tire));
    console.log("♥️ Favorite +", favoriteTires);
  };
  const handleRemoveFavorite = () => {
    dispatch(deleteFavoriteTire(_id));
    console.log("♥️ Favorite -", favoriteTires);
  };
  //=======

  const handleDelete = () => {
    //визначаємо в якій категорії ця шина, щоб обновити та перемалювати сторінку
    const categoryMatch = window.location.pathname.match(/\/category\/(.+)/); //['/category/loader', 'loader'] - наприклад якщо знаходимось на loader

    dispatch(deleteTire(_id))
      .then(() => {
        if (categoryMatch) {
          const category = categoryMatch[1];

          dispatch(fetchTiresByCategory(category)); // Оновлюємо категорію
        }
        toast(`${title} ${size} ${model} видалено.`);
      })
      .catch((error) => {
        toast.error(`Помилка видалення: ${error.message}`);
      });
  };

  const handleEdit = async (formData) => {
    //formData - [['size', '+++++'], ['tireType', '']]

    try {
      await dispatch(editTire({ id: _id, formData })).unwrap();

      const categoryMatch = window.location.pathname.match(/\/category\/(.+)/); //['/category/loader', 'loader'] - наприклад якщо знаходимось на loader

      if (categoryMatch) {
        const category = categoryMatch[1];
        dispatch(fetchTiresByCategory(category)); // Оновлюємо список
      }
      toast.success(`${title} ${size} ${model} оновлено.`);
      closeModal();
    } catch (err) {
      toast.error(`Помилка оновлення: ${err.message}`);
    }
  };

  return (
    <div className={s.tireItem}>
      {/* location -  pathname, search, hash , та ін. */}
      {/* location.pathname - /category/agricultural - шлях, звідки прийшов */}
      <Link
        to={`/tire/${_id}`}
        state={{ from: location.pathname }}
        className={s.link}
      >
        <img src={image} alt={size} className={s.image} />

        <div className={s.info}>
          <h3>
            {title === "tire" ? "Шина" : "Диск"} {size} {model} {producer}
          </h3>
          {tireType && <p>Тип шини: {tireType} </p>}
          {layering && <p>Слойність шини: {layering} </p>}
          {loadIndex && <p>Індекс: {loadIndex} </p>}
          {tire.category === "rims" && <p>Модель диску: {diskModel} </p>}

          <p className={s.price}>Ціна: {price}$</p>
          {typeof instock === "boolean" && (
            <p>{instock ? "В наявності" : "Уточнюйте наявність"} </p>
          )}
        </div>
      </Link>

      <button
        className={s.heart}
        onClick={isFavorite ? handleRemoveFavorite : handleAddFavorite}
        type="button"
      >
        <svg className={isFavorite ? clsx(s.svg, s.svgFavorite) : s.svg}>
          <use href={`${sprite}#${"icon-heart"}`} />
        </svg>
      </button>

      {userRole === "admin" && (
        <div className={s.adminBtns}>
          <button className={`${s.button} ${s.editBtn}`} onClick={openModal}>
            Edit
          </button>
          <button
            className={`${s.button} ${s.deleteBtn}`}
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      )}

      {isOpenModal && (
        <Modal title="Редагування" onClose={closeModal}>
          <EditTireForm
            tire={{
              _id,
              title,
              size,
              modelTire: model,
              producer,
              price,
              category,
              image, // Додаємо image для коректного відображення
              layering,
              loadIndex,
              tireType,
              instock,
            }}
            onSubmit={handleEdit}
          />
        </Modal>
      )}
      {/*  </Link> */}
    </div>
  );
};

//tire:
// category: "rims";
// createdAt: "2025-06-06T16:56:23.806Z";
// diskModel: "Kолесо дискове сталеве 16х17 160185 (6х205, dia 161, et -35)";
// // image: "https://res.cloudinary.com/deussughu/image/upload/v1749228984/tires/fxfgtkxhs20egkmhlpcb.jpg";
// imagePublicId: "tires/fxfgtkxhs20egkmhlpcb";
// instock: false;
// layering: "";
// loadIndex: "";
// // modelTire: "";
// // price: 16000;
// // producer: "DISK-img";
// // size: "today-7";
// tireType: "tt";
// // title: "tire";
// updatedAt: "2025-06-07T16:45:29.270Z";
// _id: "68431db7f78d402280db8805";
