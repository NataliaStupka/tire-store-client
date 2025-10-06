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
    debounce((size) => {
      if (size) {
        console.log("Searching for size:", size);
        dispatch(fetchTiresBySize(size));

        if (onSizeChange) onSizeChange(size); // Викликаємо колбек для передачі size
      }
    }, 500), // Затримка 500 мс
    [dispatch]
  );

  const handleReset = () => {
    console.log("Скидуємо фільтр");
    dispatch(changeFilter());
  };

  const initialValues = {
    size: "", // Початкове значення для поля
  };

  return (
    <div className="container">
      <Formik
        // onSubmit={handleSubmit} //якщо пошук після натискання кнопки
        initialValues={initialValues}
        // validationSchema={validationSchema}
      >
        {/* ({ resetForm }) */}
        {({ values, setFieldValue }) => (
          <Form className={s.form}>
            <div className={s.group}>
              <label className={s.label}>
                <Field
                  type="text"
                  name="size"
                  className={clsx(s.searchInput)}
                  placeholder="Введіть розмір"
                  aria-label="Пошук шин за розміром"
                  autoComplete="off" // Відключає автозаповнення
                  onChange={(e) => {
                    const size = e.target.value;
                    setFieldValue("size", size); // Оновлюємо значення в Formik
                    handleSearch(size); //викликаємо пошук
                  }}
                />
              </label>
              <ErrorMessage name="size" component="div" className={s.error} />
            </div>

            {/* <button type="submit" className={clsx("button", s.btnSearch)}>
              Пошук
            </button> */}

            <button
              type="button"
              onClick={() => {
                handleReset();
                setFieldValue("size", ""); // Скидаємо поле
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
