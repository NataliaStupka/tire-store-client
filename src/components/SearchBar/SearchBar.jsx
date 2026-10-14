import { ErrorMessage, Field, Formik, Form } from "formik";
import { useDispatch } from "react-redux";
import { useEffect, useMemo } from "react";
import debounce from "lodash.debounce";

import clsx from "clsx";
import s from "./SearchBar.module.css";

import { resetFilter, setFilter } from "../../redux/filter/slice";

import { clearSearchResult, resetPagination } from "../../redux/catalog/slice";

export const SearchBar = () => {
  const dispatch = useDispatch();

  //пошук при веденні символів
  const handleSearch = useMemo(() => {
    return debounce((size, category) => {
      dispatch(setFilter({ size, category }));
      dispatch(resetPagination());
    }, 500);
  }, [dispatch]);
  // скасовує всі заплановані debounce виклики, якщо компонент зник або debounce змінився
  useEffect(() => {
    return () => {
      handleSearch.cancel();
    };
  }, [handleSearch]);

  const handleReset = () => {
    dispatch(resetFilter());
    dispatch(clearSearchResult());
    dispatch(resetPagination());
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
        enableReinitialize //коли initialValues змінюється — форма перезавантажиться.
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
