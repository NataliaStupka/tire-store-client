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
      <h2>FOTER -- </h2>

      {/* <p>Міні-блог / поради з вибору шин — корисний для SEO</p> */}
      <p>📦 Доставка і оплата (коротко про умови)</p>
      <p>🕒 Графік роботи:</p>
      <p>📍 Карта / місце розташування (Google Maps iframe).</p>
      <p>
        📞 Контактний блок (Email, Посилання на Viber / Telegram / WhatsApp)
      </p>

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
