import toast from "react-hot-toast";
import { Formik, Form, Field, ErrorMessage } from "formik";
import s from "./EditTireForm.module.css";
import LoaderComponent from "../Loader/Loader";
// import { useDispatch } from "react-redux";

export const EditTireForm = ({ tire, onSubmit }) => {
  console.log("Форма для зміни шини/диска", tire);

  //   const dispatch = useDispatch();

  //setSubmitting, resetForm - ?
  const handleSubmit = async (values, { setSubmitting }) => {
    //values - дані з форми редагування
    console.log("HandleFromEdit - НОВІ ЗНАЧЕННЯ", values);

    const formData = new FormData();
    //Object.entries повертає масив пар ключ-значення [key, value]
    Object.entries(values).forEach(([key, value]) => {
      console.log(`${key}: ${value} (${typeof value})`);

      if (key !== "id") {
        const originalValue = tire[key];
        console.log(
          `originalValue - ${originalValue} (${typeof originalValue})`
        );

        if (value !== originalValue) {
          //append - додає пару ключ-значення до об’єкта FormData
          console.log("це записалось ??", key, value);
          if (key === "photo") {
            //перевіряє, чи користувач вибрав файл,
            if (value instanceof File && !formData.has("image")) {
              formData.append("image", value);
            }
          } else {
            formData.append(key, value.toString());
          }
          console.log("newValues", values);
          console.log("-------------------------------");
        }
      }
    });

    console.log("===============================");
    console.log("Що ПЕРЕдається ?? FormData:", Array.from(formData.entries()));

    try {
      await onSubmit(formData); // Викликаємо onSubmit з батьківського компонента
      console.log("?????????", Array.from(formData.entries()));
      setSubmitting(false);
    } catch (err) {
      console.log("Помилка в handleSubmit:", err.message);
      setSubmitting(false); // Скидаємо стан у випадку помилки
      throw err; // Передаємо помилку вгору для обробки в TireItem
    }
  };

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
    >
      {/* setFieldValue - метод Formik */}
      {({ setFieldValue, isSubmitting }) => (
        <Form className={s.form}>
          <div className={s.group}>
            <label className={s.label}>Категорія</label>
            <Field as="select" name="category">
              {/* <option value="">Оберіть категорію</option> */}
              <option value="loader">Loader</option>
              <option value="industrial">Industrial</option>
              <option value="agricultural">Agricultural</option>
              <option value="rims">Rims</option>
            </Field>
          </div>
          <div className={s.group}>
            <label className={s.label}>Назва</label>
            <Field as="select" name="title">
              {/* <option value="">Оберіть тип</option> */}
              <option value="tire">Шина</option>
              <option value="rims">Диск</option>
            </Field>
          </div>
          <div className={s.group}>
            <label className={s.label}>Ціна</label>
            <Field type="number" name="price" />
          </div>
          <div className={s.group}>
            <label className={s.label}>Розмір</label>
            <Field type="text" name="size" />
          </div>
          <div className={s.group}>
            <label className={s.label}>Тип шини</label>
            <Field as="select" name="tireType">
              <option value="">Не вказано</option>
              <option value="tt">TT</option>
              <option value="tl">TL</option>
            </Field>
          </div>
          <div className={s.group}>
            <label className={s.label}>Наявність</label>
            <Field as="select" name="instock">
              <option value="true">В наявності</option>
              <option value="false">Немає</option>
            </Field>
          </div>
          <div className={s.group}>
            <label className={s.label}>Фото</label>
            <input
              type="file"
              name="photo"
              onChange={(event) =>
                setFieldValue("photo", event.currentTarget.files[0])
              }
            />
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
