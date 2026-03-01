import s from "./AddProductForm.module.css";

import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup"; //валідація форми

import { useDispatch } from "react-redux";
import { addProduct } from "../../redux/catalog/operations";
import toast from "react-hot-toast";
import { useEffect } from "react";

export const AddProductForm = ({ onClose }) => {
  const initialValues = {
    category: "",
    title: "",
    price: "",
    size: "",
    producer: "",
    modelTire: "",
    layering: "",
    loadIndex: "",
    tireType: "",
    image: "",
    diskModel: "",
    instock: "",
  };

  const dispatch = useDispatch();

  //values це initialValues
  const handleSubmit = async (values, options) => {
    options.setSubmitting(true);
    try {
      console.log("🟡 Formik values:", values);

      const newProduct = {
        //   id - автоматично генерується на бекенді (MongoDB)
        category: values.category,
        title: values.title,
        price: Number(values.price),
        size: values.size,
        producer: values.producer || "",
        modelTire: values.modelTire || "",
        layering: values.layering || "",
        loadIndex: values.loadIndex || "",
        tireType: values.title === "tire" ? values.tireType : "", // '' - щоб було порожнім для дисків
        diskModel: values.diskModel || "",
        instock: values.instock, //// Конвертуємо у Boolean true/false
      };

      const formData = new FormData();

      // Додаємо всі поля з newProduct до FormData
      Object.entries(newProduct).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });
      // Додаємо image окремо, якщо воно є
      if (values.image) {
        formData.append("image", values.image); // Завантаження зображення на бекенд
      }

      console.log("🟢 FormData entries:");
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      await dispatch(addProduct(formData)).unwrap();
      toast.success(
        `${newProduct.title} ${newProduct.size} додано в категорію ${newProduct.category}.`,
      );
      options.resetForm(); // очистка форми
      onClose(); // Закриваємо модалку
    } catch (error) {
      toast.error("Помилка при додаванні шини");
      console.error("Error:", error);
    } finally {
      options.setSubmitting(false); // скидаємо стан відправки
    }
    //   dublicate ?? попередження якщо вже така шина є??
    //як шина нова то повідамлення що додали
  };

  //валідація для Form через Formik - ПЕРЕВІРИТИ НА ПРАКТИЦІ КОЛИ БУДУ ЗАПОВНЮВАТИ ШИНИ
  const productSchema = Yup.object().shape({
    category: Yup.string()
      .oneOf(["loader", "industrial", "agricultural", "rims"])
      .required("Це поле обов'язкове"), //обираємо з чотирьох
    title: Yup.string().oneOf(["tire", "rims"]).required("Це поле обов'язкове"), //обираємо з двох
    price: Yup.number()
      .typeError("Ціна має бути числом")
      .min(0, "Ціна не може бути від'ємною")
      .required("Це поле обов'язкове"),
    size: Yup.string().required("Це поле обов'язкове"),
    producer: Yup.string().optional(), //?? optional - необов'язковий
    modelTire: Yup.string().optional(), //??
    layering: Yup.string().optional(), //??
    loadIndex: Yup.string().optional(), //??
    tireType: Yup.string()
      .nullable() // дозволяє null
      .oneOf(["tl", "tt", "", null], "Невірний тип шини")
      .when("title", {
        is: "tire",
        then: (schema) => schema.notRequired(),
        // then: (schema) => schema.oneOf(["tl", "tt"]),
        otherwise: (schema) => schema.strip(), // повністю прибирає поле з результату, якщо це не "tire"
      }),
    // ЗАГРУЗКА ФОТО
    image: Yup.mixed()
      .test("fileSize", "Файл занадто великий", (value) => {
        if (!value) return true; // Дозволяємо порожнє значення
        return value.size <= 5 * 1024 * 1024; // Максимум 5MB
      })
      .test("fileType", "Підтримуються лише зображення", (value) => {
        if (!value) return true;
        return ["image/jpeg", "image/png", "image/gif"].includes(value.type);
      })
      .optional(),
    diskModel: Yup.string().optional(),
    instock: Yup.string()
      .oneOf(["true", "false"], "Оберіть наявність")
      .required("Це поле обов’язкове"), //???????
  });

  return (
    <div>
      {/* Formik має 2 обов'язкові поля: onSubmit={}, obj={initialValues}, +validationSchema */}
      <Formik
        onSubmit={handleSubmit}
        initialValues={initialValues}
        validationSchema={productSchema}
      >
        {({ values, setFieldValue, isSubmitting }) => {
          // автоматично
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
              <h2 className={s.formTitle}>Додавання товару</h2>

              <div className={s.group}>
                <label className={s.label}>Категорія</label>
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
                <label className={s.label}>Найменування</label>
                <Field className={s.input} as="select" name="title">
                  <option disabled value="">
                    Оберіть з варіантів:
                  </option>
                  {/* перевірити як буде записувати в базу даних, можливо брати value? */}
                  <option value="tire">Шина</option>
                  <option value="rims">Диск</option>
                </Field>
                <ErrorMessage
                  name="title"
                  component="span"
                  className={s.error}
                />
              </div>

              <div className={s.group}>
                <label className={s.label}>Ціна</label>
                <Field className={s.input} type="number" name="price" />
                <ErrorMessage
                  name="price"
                  component="span"
                  className={s.error}
                />
              </div>

              <div className={s.group}>
                <label className={s.label}>Розмір</label>
                <Field className={s.input} type="text" name="size" />
                <ErrorMessage
                  name="size"
                  component="span"
                  className={s.error}
                />
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
                  {/* <Field className={s.input} type="text" name="tireType" /> */}

                  <Field className={s.input} as="select" name="tireType">
                    <option disabled value="">
                      Оберіть з варіантів:
                    </option>
                    {/* перевірити як буде записувати в базу даних, можливо брати value? */}
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
                <label className={s.label}>Навність </label>
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

              {/* ЗОБРАЖЕННЯ ПІДГРУЖАЄМО !!! */}
              <div className={s.group}>
                <label className={s.label}>Зображення</label>
                <input
                  className={s.input}
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={(event) =>
                    setFieldValue("image", event.currentTarget.files[0])
                  }
                />
                <ErrorMessage
                  name="image"
                  component="span"
                  className={s.error}
                />
              </div>

              {/* className={s.button} */}
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className={s.loader}>Завантаження...</span>
                ) : (
                  "Додати"
                )}
              </button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};
