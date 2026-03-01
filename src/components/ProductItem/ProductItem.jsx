import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import s from "./ProductItem.module.css";
import clsx from "clsx";
import sprite from "../../assets/sprite.svg";

import { EditProductForm } from "../EditProductForm/EditProductForm";
import Modal from "../Modal/Modal";

import { selectUserRole } from "../../redux/auth/selectors";
import { useProductActions } from "../../hooks/useProductActions";

import { routes } from "../../routes/routes";

export const ProductItem = ({ product }) => {
  const {
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    removeProduct,
    updateProduct,
    isOpenModal,
    openModal,
    closeModal,
  } = useProductActions(product);

  const location = useLocation();

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
  } = product;

  return (
    <div className={s.productItem}>
      {/* location -  pathname, search, hash , та ін. */}
      {/* location.pathname - /category/agricultural - шлях, звідки прийшов */}
      <Link
        // to={`/product/${_id}`}
        to={routes.product(_id)}
        state={{ from: location.pathname }}
        className={s.link}
      >
        <img src={image} alt={size} className={s.image} />

        <div className={s.info}>
          {title === "tire" ? (
            <h3>
              Шина {size} <span className={s.model}>{model}</span>{" "}
              <span className={s.producer}>{producer}</span>
            </h3>
          ) : (
            <h3>
              Диск R{size} <span className={s.producer}>{producer}</span>
            </h3>
          )}
          {tireType && <p>Тип шини: {tireType} </p>}
          {layering && <p>Слойність шини: {layering} </p>}
          {loadIndex && <p>Індекс: {loadIndex} </p>}
          {product.category === "rims" && (
            <p>
              <span className={s.connectingSize}>Приєднувальні розміри:</span>{" "}
              {diskModel}{" "}
            </p>
          )}

          <p className={s.price}>
            Ціна: {price} {title === "tire" ? "$" : "грн"}
          </p>
          {typeof instock === "boolean" && (
            <p>{instock ? "В наявності" : "Уточнюйте наявність"} </p>
          )}
        </div>
      </Link>

      <button
        className={s.heart}
        onClick={isFavorite ? removeFromFavorites : addToFavorites}
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
            onClick={removeProduct}
          >
            Delete
          </button>
        </div>
      )}

      {isOpenModal && (
        <Modal title="Редагування" onClose={closeModal}>
          <EditProductForm
            product={{
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
              diskModel,
              instock,
            }}
            onSubmit={updateProduct}
          />
        </Modal>
      )}
      {/*  </Link> */}
    </div>
  );
};

//product:
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
