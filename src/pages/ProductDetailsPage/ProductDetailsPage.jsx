import { Link } from "react-router-dom";
import clsx from "clsx";
import s from "./ProductDetailsPage.module.css";

import LoaderComponent from "../../components/Loader/Loader";

import { useProductDetailsPage } from "../../hooks/useProductDetailsPage";

export const ProductDetailsPage = () => {
  const { product, isTire, isRim, isLoading, isError, goBackLink } =
    useProductDetailsPage();

  // //???
  if (isLoading) {
    return <LoaderComponent />;
  }
  if (isError || !product) {
    return (
      <div className={clsx("container", s.details)}>
        <Link to={goBackLink.current}>Повернутися назад</Link>
        <p>Не вдалося завантажити дані. Спробуйте ще раз.</p>
      </div>
    );
  }

  //відображає поле "Виробник" лише якщо воно є
  // const isProducer = !!product.producer;

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
              <img src={product.image} alt={product.size} className={s.img} />
            </div>

            <div className={s.info}>
              {isTire ? (
                <h3 className={s.name}>
                  Шина {product.size}{" "}
                  <span className={s.model}>{product.modelTire}</span>{" "}
                  <span className={s.producer}>{product.producer}</span>
                </h3>
              ) : (
                <h3 className={s.name}>
                  Диск R{product.size}{" "}
                  <span className={s.producer}>{product.producer}</span>
                </h3>
              )}

              <ul className={s.list}>
                <li>
                  <span>Розмір:</span>
                  {product.size} {isRim && "(діаметр в дюймах)"}
                </li>

                {/* {isProducer && <p className={s.name}>Виробник: {product.producer}</p>} */}
                {product.producer && (
                  <li>
                    <span>Виробник:</span> {product.producer}
                  </li>
                )}

                {isTire && product.modelTire && (
                  <li>
                    <span>Модель:</span> {product.modelTire}
                  </li>
                )}
                {isTire && product.tireType && (
                  <li>
                    <span>Тип:</span> {product.tireType}
                  </li>
                )}
                {isTire && (product.loadIndex || product.layering) && (
                  <li>
                    <span>Індекс навантаження / слойність:</span>{" "}
                    {product.loadIndex || product.layering}
                  </li>
                )}

                {product.layering && (
                  <li>
                    <span>Слойність шини:</span> {product.layering}
                  </li>
                )}

                {/* {isRim && <p className={s.name}>Модель диску: {product.diskModel}</p>} */}
                {isRim && product.diskModel && (
                  <li>
                    <span className={s.connectingSize}>
                      Найменування, приєднувальні розміри:
                    </span>{" "}
                    {product.diskModel}
                  </li>
                )}

                {/* <p className={s.name}>Ціна: {product.price}$</p> */}
                <li>
                  <span>Вартість:</span> {product.price}{" "}
                  {isTire ? "$" : "грн (з ПДВ)"}
                </li>

                {typeof product.instock === "boolean" && (
                  <li>
                    <p>
                      {product.instock ? "В наявності" : "Уточнюйте наявність"}
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
