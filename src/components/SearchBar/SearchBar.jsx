import { ErrorMessage, Field, Formik, Form } from "formik";
import s from "./SearchBar.module.css";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import { selectAllTires } from "../../redux/tire/selectors";
import { useCallback, useEffect } from "react";
import { fetchAllTires } from "../../redux/tire/operations";
import { fetchTiresBySize } from "../../redux/filter/operations";
import { selectTiresBySize } from "../../redux/filter/selectors";
import debounce from "lodash.debounce";
import { changeFilter } from "../../redux/filter/slice";

export const SearchBar = ({ onSizeChange }) => {
  const dispatch = useDispatch();

  //пошук при веденні символів
  const handleSearch = useCallback(
    debounce((size, category) => {
      if (size || category) {
        // console.log("🟢 Searching for size+category:", size, category);
        dispatch(fetchTiresBySize({ size, category }));

        if (onSizeChange) onSizeChange(size); // Викликаємо колбек для передачі size
      }
    }, 500), // Затримка 500 мс
    [dispatch, onSizeChange]
  );

  const handleReset = () => {
    // console.log("Скидуємо фільтр");
    dispatch(changeFilter());
  };

  const initialValues = {
    size: "", // Початкове значення для поля
    category: "",
  };

  return (
    <div className="container">
      <h2 className={s.filterText}>Пошук по розміру.</h2>
      <Formik
        // onSubmit={handleSubmit} //якщо пошук після натискання кнопки
        initialValues={initialValues}
        // validationSchema={validationSchema}
      >
        {/* ({ resetForm }) */}
        {({ values, setFieldValue, resetForm }) => (
          <Form className={s.form}>
            <div className={s.group}>
              <label className={s.label}>
                <Field
                  type="text"
                  name="size"
                  className={s.searchInput}
                  placeholder="Введіть розмір"
                  aria-label="Пошук шин за розміром"
                  autoComplete="off" // Відключає автозаповнення
                  onChange={(e) => {
                    const size = e.target.value;
                    setFieldValue("size", size); // Оновлюємо значення в Formik
                    handleSearch(size, values.category); //викликаємо пошук
                  }}
                />
              </label>
              <ErrorMessage name="size" component="div" className={s.error} />

              <label className={s.label}>
                <Field
                  // type="text"
                  as="select"
                  name="category"
                  className={s.searchInput}
                  placeholder="Оберіть категорію"
                  aria-label="Пошук за
                  категорією"
                  onChange={(e) => {
                    const category = e.target.value;
                    setFieldValue("category", category); // Оновлюємо значення в Formik
                    handleSearch(values.size, category); //викликаємо пошук
                  }}
                >
                  <option disabled value="">
                    Оберіть категорію:
                  </option>
                  <option value="tire">Шини</option>
                  <option value="rims">Диски</option>
                </Field>
              </label>
            </div>

            {/* <button type="submit" className={clsx("button", s.btnSearch)}>
              Пошук
            </button> */}

            <button
              type="button"
              onClick={(e) => {
                handleReset();
                // setFieldValue("size", ""); // Скидаємо поле
                // setFieldValue("category", "");
                resetForm(); // скидає всі поля
                if (onSizeChange) onSizeChange(""); // очистить відображення результатів
              }}
              className={clsx("button", s.btnReset)}
            >
              Скидання фільтру
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};
