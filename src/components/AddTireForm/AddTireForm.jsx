import s from "./AddTireForm.module.css";

import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup"; //валідація форми

import { useDispatch } from "react-redux";
import { addTire } from "../../redux/tire/operations";
import toast from "react-hot-toast";

export const AddTireForm = () => {
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
    try {
      const newTire = {
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

      // Додаємо всі поля з newTire до FormData
      Object.entries(newTire).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });
      // Додаємо image окремо, якщо воно є
      if (values.image) {
        formData.append("image", values.image); // Завантаження зображення на бекенд
      }
      await dispatch(addTire(formData)).unwrap();
      toast.success(
        `${newTire.title} ${newTire.size} додано в категорію ${newTire.category}.`
      );
      options.resetForm(); // очистка форми
    } catch (error) {
      toast.error("Помилка при додаванні шини");
      console.error("Error:", error);
    }
    //   dublicate ?? попередження якщо вже така шина є??
    //як шина нова то повідамлення що додали

    ////   дублюється
    // dispatch(addTire(newTire));
    // toast.success(`${newTire.title} ${newTire.size} додано.`);
  };

  //валідація для Form через Formik - ПЕРЕВІРИТИ НА ПРАКТИЦІ КОЛИ БУДУ ЗАПОВНЮВАТИ ШИНИ
  const tireSchema = Yup.object().shape({
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
    tireType: Yup.string().when("title", {
      is: "tire",
      then: (schema) =>
        schema.oneOf(["tl", "tt"]).required("Тип шини обов’язковий"),
      otherwise: (schema) => schema.oneOf([""]).optional(),
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
        validationSchema={tireSchema}
      >
        {({ values, setFieldValue }) => (
          <Form className={s.form}>
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
              <ErrorMessage name="title" component="span" className={s.error} />
            </div>

            <div className={s.group}>
              <label className={s.label}>Ціна</label>
              <Field className={s.input} type="number" name="price" />
              <ErrorMessage name="price" component="span" className={s.error} />
            </div>

            <div className={s.group}>
              <label className={s.label}>Розмір</label>
              <Field className={s.input} type="string" name="size" />
              <ErrorMessage name="size" component="span" className={s.error} />
            </div>

            <div className={s.group}>
              <label className={s.label}>Виробник</label>
              <Field className={s.input} type="string" name="producer" />
              <ErrorMessage
                name="producer"
                component="span"
                className={s.error}
              />
            </div>

            <div className={s.group}>
              <label className={s.label}>Модель шини</label>
              <Field className={s.input} type="string" name="modelTire" />
              <ErrorMessage
                name="modelTire"
                component="span"
                className={s.error}
              />
            </div>

            <div className={s.group}>
              <label className={s.label}>Слойність</label>
              <span></span>
              <Field className={s.input} type="string" name="layering" />
              <ErrorMessage
                name="layering"
                component="span"
                className={s.error}
              />
            </div>

            <div className={s.group}>
              <label className={s.label}>Індекс</label>
              <Field className={s.input} type="string" name="loadIndex" />
              <ErrorMessage
                name="loadIndex"
                component="span"
                className={s.error}
              />
            </div>

            {values.title === "tire" && (
              <div className={s.group}>
                <label className={s.label}>Тип шини</label>
                {/* <Field className={s.input} type="string" name="tireType" /> */}

                <Field className={s.input} as="select" name="tireType">
                  <option disabled value="">
                    Оберіть з варіантів:
                  </option>
                  {/* перевірити як буде записувати в базу даних, можливо брати value? */}
                  <option value="tt">tt</option>
                  <option value="tl">tl</option>
                </Field>
                <ErrorMessage
                  name="tireType"
                  component="span"
                  className={s.error}
                />
              </div>
            )}

            <div className={s.group}>
              <label className={s.label}>Модель диску</label>
              <Field className={s.input} type="string" name="diskModel" />
              <ErrorMessage
                name="diskModel"
                component="span"
                className={s.error}
              />
            </div>

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
              <ErrorMessage name="image" component="span" className={s.error} />
            </div>

            {/* className={s.button} */}
            <button type="submit">Додати</button>
          </Form>
        )}
      </Formik>
    </div>
  );
};
