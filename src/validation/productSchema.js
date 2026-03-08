import * as Yup from "yup";

const TIRE_CATEGORIES = ["loader", "industrial", "agricultural"];
const RIM_CATEGORY = "rims";

export const getProductSchema = (formType = "create") =>
  Yup.object({
    category: Yup.string()
      .oneOf([...TIRE_CATEGORIES, RIM_CATEGORY])
      .required("Обов’язкове поле"), //обираємо з чотирьох

    title: Yup.string().oneOf(["tire", "rims"]).required("Обов’язкове поле"), //обираємо з двох

    price: Yup.number()
      .transform((value, originalValue) =>
        originalValue === "" ? undefined : value,
      ) // обробляє порожній рядок
      .typeError("Ціна має бути числом")
      .min(0, "Ціна не може бути від'ємною")
      .required("Обов’язкове поле"),

    size: Yup.string()
      .trim() // обрізає пробіли
      .required("Обов’язкове поле"),

    producer: Yup.string().trim(),
    modelTire: Yup.string().trim(),
    layering: Yup.string().trim(),
    loadIndex: Yup.string().trim(),

    tireType: Yup.string()
      .nullable()
      .when("title", {
        is: "tire",
        then: (schema) => schema.oneOf(["tl", "tt"]).notRequired(),
        otherwise: (schema) => schema.strip(),
      }),

    diskModel: Yup.string()
      .trim()
      .when("category", {
        is: RIM_CATEGORY,
        then: (schema) => schema.notRequired(),
        otherwise: (schema) => schema.strip(), // повністю прибирає поле з результату, якщо це не "rims"
      }),

    instock: Yup.boolean()
      .transform((value, originalValue) => {
        if (originalValue === "true") return true;
        if (originalValue === "false") return false;
        return value;
      })
      .required("Обов’язкове поле"),
    // instock: Yup.boolean().oneOf([true, false]).required("Обов’язкове поле"),

    // 🌃 ЗАГРУЗКА ФОТО
    image: Yup.mixed()
      .nullable()
      .test("fileSize", "Файл занадто великий", (file) => {
        if (!file) return true; // Дозволяємо порожнє значення
        return file.size <= 5 * 1024 * 1024; // Максимум 5MB
      })
      .test("fileType", "Підтримуються лише зображення", (file) => {
        if (!file || file === "") return true;
        return ["image/jpeg", "image/png", "image/gif"].includes(file.type);
      })
      .notRequired(),
  });

// .notRequired() - undefined ✅, "" ❌ (бо це рядок), null ❌
// .nullable() - undefined ❌ (якщо не notRequired), "" ❌, null ✅
