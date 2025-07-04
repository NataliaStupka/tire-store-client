import { NavLink } from "react-router-dom";
import clsx from "clsx";
import s from "./Navigation.module.css";
import { CategoryList } from "../CategoryList/CategoryList";
import sprite from "../../assets/sprite.svg";
import { useEffect, useRef, useState } from "react";
import Modal from "../Modal/Modal";
import { AddTireForm } from "../AddTireForm/AddTireForm";
import { useModal } from "../../hooks/useModal";

const buildLinkClass = ({ isActive }) => clsx(s.link, { [s.active]: isActive });

const Navigation = () => {
  const [isOpenAdmin, setIsOpenAdmin] = useState(false);
  const { isOpenModal, openModal, closeModal } = useModal();
  const adminWrapRef = useRef(null); //для відстеження контейнера adminWrap

  const toggleAdminMenu = () => {
    setIsOpenAdmin(!isOpenAdmin);
  };

  const handleAddButton = () => {
    setIsOpenAdmin(false);
    openModal();
  };

  // Esc для закриття adminMenu
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && isOpenAdmin) {
        setIsOpenAdmin(false);
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc); //знімаємо слухач
  }, [isOpenAdmin]);

  //Закриває adminMenu, якщо клік поза межами
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        adminWrapRef.current &&
        !adminWrapRef.current.contains(e.target) &&
        isOpenAdmin
      ) {
        setIsOpenAdmin(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside); // Cleanup
  }, [isOpenAdmin]);

  return (
    <nav className={s.nav}>
      <div className={s.logoWrap}>
        <NavLink to="/" className={s.logo}>
          {/* <img src="/tire.svg" alt="Tire Store Логотип" width="40" height="40" /> */}
          LOGO
        </NavLink>

        <div className={s.adminWrap} ref={adminWrapRef}>
          <button
            type="button"
            className={s.btnAdmin}
            onClick={toggleAdminMenu}
            aria-expanded={isOpenAdmin}
          >
            Admin
            <svg className={s.btnIcon}>
              <use href={`${sprite}#icon-chevron-down`} />
            </svg>
          </button>
          <div className={`${s.adminMenu} ${isOpenAdmin ? s.open : ""}`}>
            <button className={s.addButton} onClick={handleAddButton}>
              + Додати шину/диск
            </button>
          </div>
        </div>

        {isOpenModal && (
          <Modal title="Додаємо шину/диск" onClose={closeModal}>
            <AddTireForm onClose={closeModal} />
          </Modal>
        )}
      </div>

      <div className={s.wrapNav}>
        <NavLink
          to="/"
          className={(props) => clsx(buildLinkClass(props), s.navItem)}
        >
          Головна
        </NavLink>

        <NavLink to="/favorite" className={buildLinkClass}>
          Улюблені
        </NavLink>

        <CategoryList variant="select" />
      </div>
    </nav>
  );
};

export default Navigation;
