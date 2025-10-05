import { useDispatch, useSelector } from "react-redux";
import { selectIsLoggedIn, selectUserRole } from "../../redux/auth/selectors";
import { login } from "../../redux/auth/operations";
import s from "./LoginForm.module.css";
import { Field, Formik, Form } from "formik";

const LoginForm = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn); //стан залогованності юзера
  const userRole = useSelector(selectUserRole);
  const dispatch = useDispatch();

  const handleSubmit = (values, { resetForm }) => {
    console.log("LoginForm=", values);
    dispatch(login(values));
    resetForm();
  };

  const initialValues = {
    email: "",
    password: "",
  };

  //  if (isLoggedIn && userRole === "admin") {
  //    return null; // Або виведи повідомлення: "Ви вже авторизовані як адмін"
  //  }

  return (
    <div className={s.wrapper}>
      <Formik onSubmit={handleSubmit} initialValues={initialValues}>
        <Form className={s.form}>
          <Field name="email" placeholder="Email адміністратора" />
          <Field name="password" type="password" placeholder="Введіть пароль" />
          <button type="submit">Вхід</button>
        </Form>
      </Formik>
    </div>
  );
};

export default LoginForm;
