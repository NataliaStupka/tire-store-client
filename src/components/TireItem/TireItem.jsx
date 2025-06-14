import { Link } from "react-router-dom";
import s from "./TireItem.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteTire,
  editTire,
  fetchTiresByCategory,
  fetchTiresById,
} from "../../redux/tire/operations";
import toast from "react-hot-toast";
import { selectTireById } from "../../redux/tire/selectors";
import { EditTireForm } from "../EditTireForm/EditTireForm";
import { useEffect, useState } from "react";
import Modal from "../Modal/Modal";
import { useModal } from "../../hooks/useModal";

export const TireItem = ({
  tire: {
    _id,
    title,
    size,
    modelTire: model = "",
    producer,
    price,
    category,
    image,
  },
}) => {
  const dispatch = useDispatch();
  const tireDetails = useSelector(selectTireById);
  const { isOpenModal, openModal, closeModal } = useModal();

  useEffect(() => {
    if (isOpenModal) {
      console.log("Fetching tire by ID:", _id);
      dispatch(fetchTiresById(_id)); // Завантажуємо деталі шини при відкритті модалки
    }
  }, [dispatch, _id, isOpenModal]);

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
    console.log(
      "Перед відправкою в editTire, FormData",
      Array.from(formData.entries())
    ); //[['size', '+++++'], ['tireType', '']]

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
    <>
      {/* додати яка категорія - category/loader/tire/title_size/ */}
      <Link to={`/tire/${_id}`}>
        <img src={image} alt={size} style={{ width: "80px" }} />
        <div>
          <h3>
            ☑️ {title} {size} {model} {producer}
          </h3>
          <p>{price}$</p>
        </div>
      </Link>

      <div className={s.adminBtn}>
        <button className={s.button} onClick={openModal}>
          Edit
        </button>
        <button className={s.button} onClick={handleDelete}>
          Delete
        </button>
      </div>

      {isOpenModal && (
        <Modal title="Редагування" onClose={closeModal}>
          <EditTireForm
            tire={
              tireDetails?.tire || {
                _id,
                title,
                size,
                model,
                producer,
                price,
                category,
              }
            }
            onSubmit={handleEdit}
          />
        </Modal>
      )}
    </>
  );
};

//tire:
// category: "rims";
// createdAt: "2025-06-06T16:56:23.806Z";
// diskModel: "Kолесо дискове сталеве 16х17 160185 (6х205, dia 161, et -35)";
// image: "https://res.cloudinary.com/deussughu/image/upload/v1749228984/tires/fxfgtkxhs20egkmhlpcb.jpg";
// imagePublicId: "tires/fxfgtkxhs20egkmhlpcb";
// instock: false;
// layering: "";
// loadIndex: "";
// modelTire: "";
// price: 16000;
// producer: "DISK-img";
// size: "today-7";
// tireType: "tt";
// title: "tire";
// updatedAt: "2025-06-07T16:45:29.270Z";
// _id: "68431db7f78d402280db8805";
