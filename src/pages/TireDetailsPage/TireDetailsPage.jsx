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
    <section className={clsx("section", s.details)}>
      <div className="container">
        <Link to={goBackLink.current} className={s.goBack}>
          ← Назад
        </Link>

        <h2 className={s.pageTitle}>Деталі про {isTire ? "шину" : "диск"}.</h2>

        <div className={s.detailsContainer}>
          <div className={s.imageWrapper}>
            <img src={tire.image} alt={tire.size} className={s.img} />
          </div>

          <div className={s.info}>
            <h3 className={s.name}>
              {tire.title} {tire.producer} {tire.size}{" "}
              {tire.modelTire || tire.diskModel}
            </h3>

            <ul className={s.list}>
              <li>
                <span>Розмір:</span>
                {tire.size}
              </li>

              {/* {isProducer && <p className={s.name}>Виробник: {tire.producer}</p>} */}
              {tire.producer && (
                <li>
                  <span>Виробник:</span> {tire.producer}
                </li>
              )}

              {/* {isTire && (
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
            )} */}
              {isTire && tire.modelTire && (
                <li>
                  <span>Модель:</span> {tire.modelTire}
                </li>
              )}
              {isTire && tire.tireType && (
                <li>
                  <span>Тип:</span> {tire.tireType}
                </li>
              )}
              {isTire && (tire.loadIndex || tire.layering) && (
                <li>
                  <span>Індекс навантаження / слойність:</span>{" "}
                  {tire.loadIndex || tire.layering}
                </li>
              )}

              {/* {isRim && <p className={s.name}>Модель диску: {tire.diskModel}</p>} */}
              {isRim && tire.diskModel && (
                <li>
                  <span>Модель диску:</span> {tire.diskModel}
                </li>
              )}

              {/* <p className={s.name}>Ціна: {tire.price}$</p> */}
              <li>
                <span>Ціна:</span> {tire.price}$
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
