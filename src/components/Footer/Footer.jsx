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
    <footer className={s.footer}>
      <div className="container">
        <h2 className={s.logo}>
          Tire<span className={s.accent}>S</span>tore
        </h2>

        {/* <p>Міні-блог / поради з вибору шин — корисний для SEO</p> */}
        {/* <p>📦 Доставка і оплата (коротко про умови)</p> */}
        <p>🕒 Графік роботи: Пн–Пт 09:00–17:00</p>
        {/* <p>📍 Карта / місце розташування (Google Maps iframe).</p> */}
        <p>
          📞 Контакти: <a href="mailto:info@tyrestore.ua">info@tyrestore.ua</a>{" "}
          | <a href="viber://chat?number=+380991234567">Viber</a> |{" "}
          <a href="https://t.me/tyrestore" target="_blank" rel="noreferrer">
            Telegram
          </a>
        </p>

        {showLoginButton && (
          <button
            className={s.btnAdmin}
            onClick={() => {
              openModal();
            }}
          >
            Вхід для адміністратора.
          </button>
        )}

        {isOpenModal && (
          <Modal title="Адміністратор" onClose={closeModal}>
            <LoginForm closeModal={closeModal} />
          </Modal>
        )}

        {showLogoutButton && (
          <div className={s.logoutButton}>
            <button className={s.btnAdmin} onClick={handleLogout}>
              Вийти з системи
            </button>
          </div>
        )}

        <div className={s.footerBottom}>
          <p>© {new Date().getFullYear()} TyreStore. Усі права захищено.</p>
        </div>
      </div>
    </footer>
  );
};
