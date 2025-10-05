import { useDispatch, useSelector } from "react-redux";
import { selectIsLoggedIn, selectUserRole } from "../../redux/auth/selectors";
import s from "./Footer.module.css";
import { logout } from "../../redux/auth/operations";
import { useModal } from "../../hooks/useModal";
import Modal from "../Modal/Modal";
import LoginForm from "../LoginForm/LoginForm";

export const Footer = () => {
  const dispatch = useDispatch();
  const { isOpenModal, openModal, closeModal } = useModal();

  const userRole = useSelector(selectUserRole);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const handleLogout = () => {
    dispatch(logout());
  };

  const showLoginButton = !isLoggedIn;
  const showLogoutButton = isLoggedIn && userRole === "admin";

  return (
    <div className={s.loginFooter}>
      {showLoginButton && (
        <button
          className={s.btnAdmin}
          onClick={() => {
            openModal();
          }}
        >
          Вхід в систему - адміністратор.
        </button>
      )}

      {isOpenModal && (
        <Modal title="Адміністратор" onClose={closeModal}>
          <LoginForm />
        </Modal>
      )}

      {showLogoutButton && (
        <div className={s.logoutButton}>
          <button className={s.btnAdmin} onClick={handleLogout}>
            Вихід із системи
          </button>
        </div>
      )}
    </div>
  );
};
