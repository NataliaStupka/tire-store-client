import toast from "react-hot-toast";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup"; //валідація форми
import s from "./EditTireForm.module.css";
import LoaderComponent from "../Loader/Loader";

export const EditTireForm = ({ tire, onSubmit }) => {
  console.log("Форма для зміни шини/диска", tire);

  //formikBag містить setSubmitting - відправ форми true/false; resetForm - скид форми; setFieldValue - Динамічно змінює значення конкретного поля;
  //setFieldError - Встановлює помилку для конкретного поля; setValues - Оновлює всі значення форми одночасно; інші
  const handleSubmit = async (values, { setSubmitting }) => {
    //values - дані з форми редагування
    const formData = new FormData();
    //Object.entries повертає масив пар ключ-значення [key, value]
    Object.entries(values).forEach(([key, value]) => {
      if (key !== "id") {
        const originalValue = tire[key];

        if (value !== originalValue) {
          //append - додає пару ключ-значення до об’єкта FormData
          console.log("Key-value:", key, value);
          if (key === "photo") {
            //перевіряє, чи користувач вибрав файл,
            if (value instanceof File && !formData.has("image")) {
              formData.append("image", value);
            }
          } else {
            formData.append(key, value.toString());
          }
        }
      }
    });

    try {
      await onSubmit(formData); // Викликаємо onSubmit з батьківського компонента
      setSubmitting(false);
    } catch (err) {
      console.log("Помилка в handleSubmit:", err.message);
      setSubmitting(false); // Скидаємо стан у випадку помилки
      throw err; // Передаємо помилку вгору для обробки в TireItem
    }
  };

  // const tireSchema = Yup.object().shape({
  //   category: Yup.string()
  //     .oneOf(["loader", "industrial", "agricultural", "rims"])
  //     .required("Обов’язкове поле"),
  //   title: Yup.string().oneOf(["tire", "rims"]).required("Обов’язкове поле"),
  //   price: Yup.number()
  //     .typeError("Ціна має бути числом")
  //     .min(0, "Ціна не може бути від'ємною")
  //     .required("Обов’язкове поле"),
  //   size: Yup.string().required("Обов’язкове поле"),
  //   producer: Yup.string().optional(), // optional - необов'язковий
  //   modelTire: Yup.string().optional(),
  //   layering: Yup.string().optional(),
  //   loadIndex: Yup.string().optional(),
  //   tireType: Yup.string().when("title", {
  //     is: "tire",
  //     then: (schema) =>
  //       schema.oneOf(["tl", "tt"]).required("Тип шини обов’язковий"),
  //     otherwise: (schema) => schema.oneOf([""]).optional(),
  //   }),
  //   instock: Yup.string().oneOf(["true", "false"]).required("Обов’язкове поле"),
  //   photo: Yup.mixed().optional(),
  // });

  return (
    <Formik
      initialValues={{
        id: tire._id || "",
        category: tire.category || "",
        title: tire.title || "",
        price: tire.price || "",
        size: tire.size || "",
        tireType: tire.tireType || "",
        instock: tire.instock?.toString() || "false",
        photo: null,
      }}
      onSubmit={handleSubmit}
      // validationSchema={tireSchema}
    >
      {/* setFieldValue - метод Formik */}
      {({ setFieldValue, isSubmitting }) => (
        <Form className={s.form}>
          <div className={s.group}>
            <label className={s.label}>Категорія</label>
            <Field as="select" name="category">
              {/* <option value="">Оберіть категорію</option> */}
              <option value="loader">Погрузочні шини</option>
              <option value="industrial">Індустріальні шини</option>
              <option value="agricultural">Сільськогосподарські шини</option>
              <option value="rims">Диски</option>
            </Field>
            <ErrorMessage
              name="category"
              component="span"
              className={s.error}
            />
          </div>
          <div className={s.group}>
            <label className={s.label}>Назва</label>
            <Field as="select" name="title">
              {/* <option value="">Оберіть тип</option> */}
              <option value="tire">Шина</option>
              <option value="rims">Диск</option>
            </Field>
            <ErrorMessage name="title" component="span" className={s.error} />
          </div>
          <div className={s.group}>
            <label className={s.label}>Ціна</label>
            <Field type="number" name="price" />
            <ErrorMessage name="price" component="span" className={s.error} />
          </div>
          <div className={s.group}>
            <label className={s.label}>Розмір</label>
            <Field type="text" name="size" />
            <ErrorMessage name="size" component="span" className={s.error} />
          </div>
          <div className={s.group}>
            <label className={s.label}>Тип шини</label>
            <Field as="select" name="tireType">
              <option value="">Не вказано</option>
              <option value="tt">TT</option>
              <option value="tl">TL</option>
            </Field>
            <ErrorMessage
              name="tireType"
              component="span"
              className={s.error}
            />
          </div>
          <div className={s.group}>
            <label className={s.label}>Наявність</label>
            <Field as="select" name="instock">
              <option value="true">В наявності</option>
              <option value="false">Немає</option>
            </Field>
            <ErrorMessage name="instock" component="span" className={s.error} />
          </div>
          <div className={s.group}>
            <label className={s.label}>Поточне фото</label>
            {tire.image && (
              <img
                src={tire.image}
                alt="Поточне зображення"
                style={{ width: "100px", marginBottom: "10px" }}
                onError={(e) => (e.target.src = "/placeholder.jpg")}
              />
            )}
            <input
              type="file"
              name="photo"
              onChange={(event) =>
                setFieldValue("photo", event.currentTarget.files[0])
              }
            />
            <ErrorMessage name="photo" component="span" className={s.error} />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={s.submitButton}
          >
            {isSubmitting ? (
              <>
                Завантажуємо <LoaderComponent size={20} color="#eaeef8" />
              </>
            ) : (
              "Оновити"
            )}
          </button>
        </Form>
      )}
    </Formik>
  );
};
