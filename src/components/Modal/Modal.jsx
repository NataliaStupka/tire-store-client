import { useEffect } from "react";
import s from "./Modal.module.css";

const Modal = ({ children, title = "Default modal", onClose }) => {
  //закриття кліком по фону
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  //закриття ескейпом
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    //cleanUp - щоб не лишилося "зайвого слухача" після закриття модалки.
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div onClick={handleBackdropClick} className={s.wrapper}>
      <div className={s.content}>
        <>
          <h1 style={{ fontSize: "50px" }}>{title}</h1>
          <hr />
        </>
        <button className={s.closeBtn} onClick={onClose}>
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
