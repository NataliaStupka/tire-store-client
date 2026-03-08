import { ProductForm } from "../ProductForm/ProductForm";

export const EditProductForm = ({ product, onSubmit }) => {
  const initialValues = {
    id: product._id || "",
    category: product.category || "",
    title: product.title || "",
    price: product.price || "",
    size: product.size || "",
    producer: product.producer || "",
    modelTire: product.modelTire || "",
    layering: product.layering || "",
    loadIndex: product.loadIndex || "",
    tireType: product.tireType || "",
    diskModel: product.diskModel || "",
    // instock: product.instock?.toString() || "false",
    instock: product.instock ?? false, //  "false" ??

    image: "",
  };

  //formikBag містить setSubmitting - відправ форми true/false; resetForm - скид форми; setFieldValue - Динамічно змінює значення конкретного поля;
  //setFieldError - Встановлює помилку для конкретного поля; setValues - Оновлює всі значення форми одночасно; інші
  const handleSubmit = async (values, { setSubmitting }) => {
    //values - дані з форми редагування
    const formData = new FormData();

    //Object.entries повертає масив пар ключ-значення [key, value]
    Object.entries(values).forEach(([key, value]) => {
      if (key === "id") return;
      const originalValue = product[key];

      if (key === "image") {
        //перевіряє, чи користувач вибрав файл,
        if (value instanceof File) {
          formData.append("image", value); // бекенд очікує photo ⁉️
        }
      } else if (String(value) !== String(originalValue)) {
        formData.append(key, value.toString());
      }
    });

    try {
      await onSubmit(formData); // Викликаємо onSubmit з батьківського компонента
      setSubmitting(false);
      // toast.success("Зміни збережено успішно!");
    } catch (err) {
      console.log("Помилка в handleSubmit:", err.message);
      setSubmitting(false); // Скидаємо стан у випадку помилки
      throw err; // Передаємо помилку вгору для обробки в ProductItem
      // toast.error(`Помилка: ${err.message}`);
    }
  };

  return (
    <ProductForm
      formType="edit"
      title="Редагування товару"
      initialValues={initialValues}
      onSubmit={handleSubmit}
      existingImage={product.image}
    />
  );
};
