import s from "./CategoryList.module.css";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { routes } from "../../routes/routes";
import sprite from "../../assets/sprite.svg";

// поміняти з масиву на об'єкт
// const categories = [
//   { key: "loader", title: "Погрузочні шини", image: "/images/loader.jpg" },
//   {
//     key: "industrial",
//     title: "Індустріальні шини",
//     image: "/images/industrial.jpg",
//   },
//   {
//     key: "agricultural",
//     title: "Сільськогосподарські шини",
//     image: "/images/agricultural.jpg",
//   },
//   { key: "rims", title: "Диски", image: "/images/rims.jpg" },
// ];

 const categoryTranslation = {
    loader: "Шини для навантажувачів",
    industrial: "Індустріальні шини",
    agricultural: "Сільськогосподарські шини",
    car: "Шини для легкових автомобілів",
    rims: "Диски",
  };

export const CategoryList = ({
  variant = "list",
  categories = ["loader", "industrial", "agricultural", "car", "rims"],
}) => {
  const navigate = useNavigate();
  const location = useLocation(); //pathname, search, hash, key, state
  const selectRef = useRef(null); //current

 

  // Поточна категорію з URL
  const currentCategory = location.pathname.match(/\/category\/([^/]+)/)?.[1];

  const handleChange = (e) => {
    const category = e.target.value;
    if (category) {
      navigate(`/category/${category}`);
    }
  };

  // Скидання значення select при поверненні на 'головну' сторінку чи переході на 'favorite'
  useEffect(() => {
    const isMainOrFavorite =
      location.pathname === "/" || location.pathname === "/favorite";
    if (isMainOrFavorite && selectRef.current) {
      selectRef.current.value = ""; // Скидаємо до початкового значення
    } else if (selectRef.current && currentCategory) {
      // Встановлюємо вибрану категорію в select, синхронізує <select> із поточним маршрутом.
      selectRef.current.value = currentCategory;
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
              {categoryTranslation[category] ?? category}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className={s.categoryText}>Переглянути каталог</h2>

      <ul className={s.categoryList}>
        {categories.map((item) => {
          return (
            <li key={item} className={s.categoryItem}>
              <NavLink
                // to={`/category/${item}`}
                to={routes.category(item)}
                aria-label={`Переглянути категорію ${categoryTranslation[item]}`}
                title={`Категорія: ${categoryTranslation[item]}`}
                className={s.categoryLink}
              >
                <div className={s.iconWrapper}>
                  <svg className={s.categoryIcon}>
                    <use href={`${sprite}#icon-${item}`}></use>
                  </svg>
                </div>

                <div className={s.categoryFooter}>
                  <h3 className={s.categoryTitle}>
                    {categoryTranslation[item]}
                  </h3>

                  {/* -> */}
                  <svg className={s.categoryArrow}>
                    <use href={`${sprite}#icon-arrow-right`}></use>
                  </svg>
                </div>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
