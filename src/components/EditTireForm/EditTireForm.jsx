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
      // toast.success("Зміни збережено успішно!");
    } catch (err) {
      console.log("Помилка в handleSubmit:", err.message);
      setSubmitting(false); // Скидаємо стан у випадку помилки
      throw err; // Передаємо помилку вгору для обробки в TireItem
      // toast.error(`Помилка: ${err.message}`);
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
        producer: tire.producer || "",
        modelTire: tire.modelTire || "",
        layering: tire.layering || "",
        loadIndex: tire.loadIndex || "",
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
          <h3 className={s.formTitle}>Редагування товару</h3>

          <div className={s.grid}>
            <div className={s.group}>
              <label className={s.label}>Категорія</label>
              <Field as="select" name="category" className={s.field}>
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
              <label className={s.label}>Найменування</label>
              <Field as="select" name="title" className={s.field}>
                {/* <option value="">Оберіть тип</option> */}
                <option value="tire">Шина</option>
                <option value="rims">Диск</option>
              </Field>
              <ErrorMessage name="title" component="span" className={s.error} />
            </div>

            <div className={s.group}>
              <label className={s.label}>Ціна</label>
              <Field type="number" name="price" className={s.field} />
              <ErrorMessage name="price" component="span" className={s.error} />
            </div>

            <div className={s.group}>
              <label className={s.label}>Розмір</label>
              <Field type="text" name="size" className={s.field} />
              <ErrorMessage name="size" component="span" className={s.error} />
            </div>

            <div className={s.group}>
              <label className={s.label}>Виробник</label>
              <Field className={s.field} type="text" name="producer" />
              <ErrorMessage
                name="producer"
                component="span"
                className={s.error}
              />
            </div>

            <div className={s.group}>
              <label className={s.label}>Модель шини</label>
              <Field className={s.field} type="text" name="modelTire" />
              <ErrorMessage
                name="modelTire"
                component="span"
                className={s.error}
              />
            </div>

            <div className={s.group}>
              <label className={s.label}>Слойність шини</label>
              <span></span>
              <Field className={s.field} type="text" name="layering" />
              <ErrorMessage
                name="layering"
                component="span"
                className={s.error}
              />
            </div>

            <div className={s.group}>
              <label className={s.label}>Індекс</label>
              <Field className={s.field} type="text" name="loadIndex" />
              <ErrorMessage
                name="loadIndex"
                component="span"
                className={s.error}
              />
            </div>

            <div className={s.group}>
              <label className={s.label}>Тип шини</label>
              <Field as="select" name="tireType" className={s.field}>
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
              <Field as="select" name="instock" className={s.field}>
                <option value="true">В наявності</option>
                <option value="false">Уточнюйте наявність</option>
              </Field>
              <ErrorMessage
                name="instock"
                component="span"
                className={s.error}
              />
            </div>
          </div>

          <div className={s.group}>
            <label className={s.label}>Поточне зображення</label>
            {tire.image && (
              <img
                src={tire.image}
                alt="Поточне зображення"
                // style={{ width: "100px", marginBottom: "10px" }}
                className={s.preview}
                onError={(e) => (e.target.src = "/placeholder.jpg")}
              />
            )}
            <input
              type="file"
              name="photo"
              className={s.fileInput}
              onChange={(event) =>
                setFieldValue("photo", event.currentTarget.files[0])
              }
            />
            <ErrorMessage name="photo" component="span" className={s.error} />
          </div>

          <button type="submit" disabled={isSubmitting} className={s.button}>
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
