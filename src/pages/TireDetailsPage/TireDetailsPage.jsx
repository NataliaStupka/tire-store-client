import { Link, useLocation, useParams } from "react-router-dom";
import s from "./TireDetailsPage.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { fetchTiresById } from "../../redux/tire/operations";
import {
  selectIsError,
  selectIsLoading,
  selectTireById,
} from "../../redux/tire/selectors";
import LoaderComponent from "../../components/Loader/Loader";
import clsx from "clsx";

export const TireDetailsPage = () => {
  const dispatch = useDispatch();

  const { tireId } = useParams();
  console.log(`Деталі про шину id - ${tireId}.`);

  const location = useLocation();
  const tire = useSelector(selectTireById);
  console.log("tire", tire);

  const isLoading = useSelector(selectIsLoading);
  const isError = useSelector(selectIsError);

  useEffect(() => {
    if (tireId) {
      dispatch(fetchTiresById(tireId));
    }
  }, [dispatch, tireId]);

  // const { title, size, modelTire, producer, price, category, image } = tire;

  const goBackLink = useRef(location.state?.from || "/");
  // const goBackLink = location.state?.from || "/";
  console.log("goBackLink -", goBackLink);
  // if (!tire) {
  //   return <h2>Завантажуємо ...</h2>;
  // }
  // //???
  if (isLoading) {
    return <LoaderComponent />;
  }
  if (isError || !tire) {
    return (
      <div className={clsx("container", s.details)}>
        <Link to={goBackLink.current}>Повернутися назад</Link>
        <p>Не вдалося завантажити дані. Спробуйте ще раз.</p>
      </div>
    );
  }

  // ЯКЩО ДИСК ТО ІНША РОЗМІТКА  ????
  const isTire = tire.title === "tire";
  const isRim = tire.title === "rims";
  //відображає поле "Виробник" лише якщо воно є
  const isProducer = !!tire.producer;

  return (
    <main>
      <div className={clsx("container", s.details)}>
        <Link to={goBackLink.current}>Go back</Link>
        <h2 className={s.title}>Деталі про {isTire ? "шину" : "диск"}.</h2>
        <div className={s.detailsContainer}>
          <div className={s.wrapper}>
            <img src={tire.image} alt={tire.size} className={s.img} />
          </div>

          <div>
            <div className={s.titleTire}>
              <h2 className={s.nameTire}>
                {tire.title} {tire.producer} {tire.size}{" "}
                {tire.modelTire || tire.diskModel}
              </h2>
            </div>
            <p className={s.name}>
              Розмір: <span className={s.value}>{tire.size}</span>
            </p>
            {isProducer && <p className={s.name}>Виробник: {tire.producer}</p>}

            {isTire && (
              <>
                {}
                {tire.modelTire && (
                  <p className={s.name}>Модель: {tire.modelTire}</p>
                )}
                {tire.tireType && (
                  <p className={s.name}>Наявність камери: {tire.tireType}</p>
                )}
                {tire.loadIndex ||
                  (tire.layering && (
                    <p className={s.name}>
                      Індекс навантаження/слойність:{" "}
                      {tire.loadIndex || tire.layering}
                    </p>
                  ))}
              </>
            )}
            {/* ???????? ПЕРЕВІРИТИ*/}
            {isRim && <p className={s.name}>Модель диску: {tire.diskModel}</p>}
            <p className={s.name}>Ціна: {tire.price}$</p>
            {/* <p>Артикул ????: {tire._id || "Немає артикулу"}</p> */}
          </div>
        </div>
      </div>
    </main>
  );
};
