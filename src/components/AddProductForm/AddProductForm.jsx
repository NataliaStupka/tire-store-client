import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

import { addProduct } from "../../redux/catalog/operations";
import { ProductForm } from "../ProductForm/ProductForm.jsx";

export const AddProductForm = ({ onClose }) => {
  const dispatch = useDispatch();

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
    image: "", // null ?? файл, а не строка
    diskModel: "",
    instock: false,
  };

  //values це initialValues
  const handleSubmit = async (values, options) => {
    options.setSubmitting(true);
    try {
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
        instock: values.instock === true || values.instock === "true", // boolean // Конвертуємо у Boolean true/false
      };

      const formData = new FormData();

      // Додаємо всі поля з newProduct до FormData
      Object.entries(newProduct).forEach(([key, value]) => {
        //if (key !== "image") {formData.append(key, value.toString());} //???
        formData.append(key, value.toString());
      });
      // Додаємо image окремо, якщо воно є
      if (values.image) {
        formData.append("image", values.image); // Завантаження зображення на бекенд, очікує photo
      }

      // //подивитися, що в всередині formData,
      // console.log("🟠🟠", [...formData.entries()]);

      await dispatch(addProduct(formData)).unwrap();
      toast.success(
        `${newProduct.title} ${newProduct.size} додано в категорію ${newProduct.category}.`,
      );
      options.resetForm(); // очистка форми
      onClose(); // Закриваємо модалку
    } catch (error) {
      toast.error("Помилка при додаванні продукту");
      console.error("Error:", error);
    } finally {
      options.setSubmitting(false); // скидаємо стан відправки
    }
  };

  return (
    <ProductForm
      formType="create"
      title="Додавання товару"
      initialValues={initialValues}
      onSubmit={handleSubmit}
    />
  );
};
