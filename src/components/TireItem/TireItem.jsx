import { Link } from "react-router-dom";
import s from "./TireItem.module.css";
import { useDispatch } from "react-redux";
import { deleteTire } from "../../redux/tire/operations";
import toast from "react-hot-toast";

export const TireItem = ({
  tire: { _id, title, size, model, producer, price },
}) => {
  const dispatch = useDispatch();

  const handleDelete = () => {
    // console.log("Delit", _id, title, size, producer);
    dispatch(deleteTire(_id))
      .then(() => {
        toast(`${title} ${size} ${model} видалено.`);
      })
      .catch((error) => {
        toast.error(`Помилка видалення: ${error.message}`);
      });
  };

  return (
    <>
      {/* додати яка категорія - category/loader/tire/title_size/ */}
      <Link to={`/tire/${_id}`}>
        <h3>
          ☑️ {title} {size} {model} {producer}
        </h3>
        <p>{price}$</p>
      </Link>

      <div className={s.adminBtn}>
        <button
          className={s.button}
          onClick={() => {
            console.log("Click Edit");
          }}
        >
          Edit
        </button>
        <button className={s.button} onClick={() => handleDelete()}>
          Delete
        </button>
      </div>
    </>
  );
};
