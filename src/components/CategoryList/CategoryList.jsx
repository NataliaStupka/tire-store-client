import { nanoid } from "@reduxjs/toolkit";
import s from "./CategoryList.module.css";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";

export const CategoryList = ({
  variant = "list",
  categories = ["loader", "industrial", "agricultural", "rims"],
}) => {
  const navigate = useNavigate();
  const location = useLocation(); //pathname, search, hash, key, state
  const selectRef = useRef(null); //current

  const categoryTranslation = {
    loader: "Погрузочні шини",
    industrial: "Індустріальні шини",
    agricultural: "Сільськогосподарські шини",
    rims: "Диски",
  };

  // Поточна категорію з URL
  const currentCategory = location.pathname.match(/\/category\/([^/]+)/)?.[1];

  const handleChange = (e) => {
    const category = e.target.value;
    if (category) {
      navigate(`/category/${category}`);
    }
  };

  // Скидання значення select при поверненні на головну сторінку
  useEffect(() => {
    if (location.pathname === "/" && selectRef.current) {
      selectRef.current.value = ""; // Скидаємо до початкового значення
    } else if (selectRef.current && currentCategory) {
      // Встановлюємо вибрану категорію в select, синхронізує <select> із поточним маршрутом.
      selectRef.current.value = currentCategory;
      console.log("Set select to:", currentCategory);
    }
  }, [location.pathname, currentCategory]);

  if (variant === "select") {
    return (
      <div className={s.selectWrapper}>
        <select
          className={s.select}
          onChange={handleChange}
          defaultValue=""
          ref={selectRef}
          aria-label="Оберіть категорію шин"
        >
          <option value="" disabled>
            Категорія
          </option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {categoryTranslation[category]}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <ul className={s.categoryList}>
      {categories.map((item) => {
        return (
          <li key={nanoid()} className={s.categoryItem}>
            <NavLink
              to={`/category/${item}`}
              aria-label={`Переглянути категорію ${item.title}`}
              title={`Категорія: ${item.title}`}
              className={s.categoryLink}
            >
              <div className={s.imageWrapper}>
                {/* src={item.image} */}
                <img src="/tire.jpg" alt={item} />
              </div>
              <div>
                <h3 className={s.categoryTitle}>{categoryTranslation[item]}</h3>
              </div>
            </NavLink>
          </li>
        );
      })}
    </ul>
  );
};
