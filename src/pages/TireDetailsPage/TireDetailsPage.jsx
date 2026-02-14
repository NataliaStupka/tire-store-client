import { Link } from "react-router-dom";
import s from "./TireDetailsPage.module.css";

import LoaderComponent from "../../components/Loader/Loader";
import clsx from "clsx";
import { useTireDetails } from "../../hooks/useTireDetails";

export const TireDetailsPage = () => {
  const { tire, isTire, isRim, isLoading, isError, goBackLink } =
    useTireDetails();

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

  //відображає поле "Виробник" лише якщо воно є
  // const isProducer = !!tire.producer;

  return (
    <section className={s.details}>
      <div className="container">
        <Link to={goBackLink.current} className={s.goBack}>
          ← Назад
        </Link>
        <div>
          <h2 className={s.pageTitle}>
            Деталі про {isTire ? "шину" : "диск"}.
          </h2>

          <div className={s.detailsContainer}>
            <div className={s.imageWrapper}>
              <img src={tire.image} alt={tire.size} className={s.img} />
            </div>

            <div className={s.info}>
              {isTire ? (
                <h3 className={s.name}>
                  Шина {tire.size}{" "}
                  <span className={s.model}>{tire.modelTire}</span>{" "}
                  <span className={s.producer}>{tire.producer}</span>
                </h3>
              ) : (
                <h3 className={s.name}>
                  Диск R{tire.size}{" "}
                  <span className={s.producer}>{tire.producer}</span>
                </h3>
              )}

              <ul className={s.list}>
                <li>
                  <span>Розмір:</span>
                  {tire.size} {isRim && "(діаметр в дюймах)"}
                </li>

                {/* {isProducer && <p className={s.name}>Виробник: {tire.producer}</p>} */}
                {tire.producer && (
                  <li>
                    <span>Виробник:</span> {tire.producer}
                  </li>
                )}

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

                {tire.layering && (
                  <li>
                    <span>Слойність шини:</span> {tire.layering}
                  </li>
                )}

                {/* {isRim && <p className={s.name}>Модель диску: {tire.diskModel}</p>} */}
                {isRim && tire.diskModel && (
                  <li>
                    <span className={s.connectingSize}>
                      Найменування, приєднувальні розміри:
                    </span>{" "}
                    {tire.diskModel}
                  </li>
                )}

                {/* <p className={s.name}>Ціна: {tire.price}$</p> */}
                <li>
                  <span>Вартість:</span> {tire.price}{" "}
                  {isTire ? "$" : "грн (з ПДВ)"}
                </li>

                {typeof tire.instock === "boolean" && (
                  <li>
                    <p>
                      {tire.instock ? "В наявності" : "Уточнюйте наявність"}
                    </p>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
