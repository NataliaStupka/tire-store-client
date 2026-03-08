//formikBag містить: setSubmitting - відправ форми true/false; resetForm - скид форми; setFieldValue - Динамічно змінює значення конкретного поля;
//setFieldError - Встановлює помилку для конкретного поля; setValues - Оновлює всі значення форми одночасно; інші
// enableReinitialize - Якщо initialValues змінився — перезапусте форму заново.

import { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import s from "./ProductForm.module.css";

import { getProductSchema } from "../../validation/productSchema"; // валідація форми
import { REQUIRED_FIELDS } from "../../constant/productFormFields";

export const ProductForm = ({
  formType = "create",
  initialValues,
  onSubmit,
  title,
  existingImage, // наявна зображення
}) => {
  const isEdit = formType === "edit";

  const renderLabel = (name, text) => (
    <label className={s.label}>
      {text}
      {REQUIRED_FIELDS[name] && <span className={s.required}>*</span>}
    </label>
  );

  return (
    //   {/* Formik має 2 обов'язкові поля: onSubmit={}, obj={initialValues}, +validationSchema */}
    <Formik
      enableReinitialize // Якщо initialValues змінився — перезапусте форму заново.
      onSubmit={onSubmit}
      initialValues={initialValues}
      validationSchema={getProductSchema(formType)}
    >
      {/* Formik передає один об'єкт, */}
      {({ values, setFieldValue, isSubmitting }) => {
        // автоматично обирає title
        useEffect(() => {
          if (values.category === "rims") {
            setFieldValue("title", "rims");
          } else if (
            values.category === "loader" ||
            values.category === "industrial" ||
            values.category === "agricultural"
          ) {
            setFieldValue("title", "tire");
          }
        }, [values.category, setFieldValue]);

        return (
          <Form className={s.form}>
            <h2 className={s.formTitle}>{title}</h2>
            {/* <p className={s.requiredInfo}>* — обов'язкові поля</p> */}

            <div className={s.group}>
              {renderLabel("category", "Категорія")}
              <Field className={s.input} as="select" name="category">
                {/* disabled - не можемо обрати */}
                <option disabled value="">
                  Оберіть з варіантів:
                </option>
                <option value="loader">Шини для навантажувачів</option>
                <option value="industrial">Шини індустріальні</option>
                <option value="agricultural">
                  Шини для сільскогосподарскої техніки
                </option>
                <option value="rims">Диски</option>
              </Field>
              <ErrorMessage
                name="category"
                component="span"
                className={s.error}
              />
            </div>

            <div className={s.group}>
              {renderLabel("title", "Найменування")}
              <Field className={s.input} as="select" name="title">
                <option disabled value="">
                  Оберіть з варіантів:
                </option>
                <option value="tire">Шина</option>
                <option value="rims">Диск</option>
              </Field>
              <ErrorMessage name="title" component="span" className={s.error} />
            </div>

            <div className={s.group}>
              {renderLabel("price", "Ціна")}
              <Field className={s.input} type="number" name="price" />
              <ErrorMessage name="price" component="span" className={s.error} />
            </div>

            <div className={s.group}>
              {renderLabel("size", "Розмір")}
              <Field className={s.input} type="text" name="size" />
              <ErrorMessage name="size" component="span" className={s.error} />
            </div>

            <div className={s.group}>
              <label className={s.label}>Виробник</label>
              <Field className={s.input} type="text" name="producer" />
              <ErrorMessage
                name="producer"
                component="span"
                className={s.error}
              />
            </div>

            <div className={s.group}>
              <label className={s.label}>Модель шини</label>
              <Field className={s.input} type="text" name="modelTire" />
              <ErrorMessage
                name="modelTire"
                component="span"
                className={s.error}
              />
            </div>

            <div className={s.group}>
              <label className={s.label}>Слойність шини</label>
              <span></span>
              <Field className={s.input} type="text" name="layering" />
              <ErrorMessage
                name="layering"
                component="span"
                className={s.error}
              />
            </div>

            <div className={s.group}>
              <label className={s.label}>Індекс</label>
              <Field className={s.input} type="text" name="loadIndex" />
              <ErrorMessage
                name="loadIndex"
                component="span"
                className={s.error}
              />
            </div>

            {values.title === "tire" && (
              <div className={s.group}>
                <label className={s.label}>Тип шини</label>
                <Field className={s.input} as="select" name="tireType">
                  <option disabled value="">
                    Оберіть з варіантів:
                  </option>
                  <option value="tt">TT</option>
                  <option value="tl">TL</option>
                </Field>
                <ErrorMessage
                  name="tireType"
                  component="span"
                  className={s.error}
                />
              </div>
            )}

            {values.category === "rims" && (
              <div className={s.group}>
                <label className={s.label}>Модель диску</label>
                <Field className={s.input} type="text" name="diskModel" />
                <ErrorMessage
                  name="diskModel"
                  component="span"
                  className={s.error}
                />
              </div>
            )}

            <div className={s.group}>
              {renderLabel("instock", "Навність")}
              <Field className={s.input} as="select" name="instock">
                <option disabled value="">
                  Оберіть з варіантів:
                </option>
                <option value="true">Є в наявності</option>
                <option value="false">Уточнюйте наявність</option>
              </Field>
              <ErrorMessage
                name="instock"
                component="span"
                className={s.error}
              />
            </div>

            {/* ЗОБРАЖЕННЯ */}
            <div className={s.group}>
              <label className={s.label}>Зображення</label>

              {isEdit && existingImage && !values.image && (
                <img
                  src={existingImage}
                  alt="Поточне зображення"
                  className={s.preview}
                  onError={(e) => (e.target.src = "placeholder.jpg")}
                />
              )}
              <input
                className={s.input}
                type="file"
                name="image"
                accept="image/*"
                onChange={(event) =>
                  setFieldValue("image", event.currentTarget.files[0])
                }
              />
              <ErrorMessage name="image" component="span" className={s.error} />
            </div>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className={s.loader}>Завантаження...</span>
              ) : isEdit ? (
                "Оновити"
              ) : (
                "Додати"
              )}
            </button>
          </Form>
        );
      }}
    </Formik>
  );
};
