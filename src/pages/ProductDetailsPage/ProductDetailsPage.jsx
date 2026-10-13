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
      <section className={s.details}>
        <div className={clsx("container", s.errorContainer)}>
          <Link to={goBackLink.current} className={s.goBack}>
            ← Повернутися назад
          </Link>
          <p>Не вдалося завантажити дані. Спробуйте ще раз.</p>
        </div>
      </section>
    );
  }

  // const price = product.price;
  const {
    title,
    price,
    image,
    producer,
    size,
    modelTire,
    tireType,
    loadIndex,
    layering,
    diskModel,
    instock,
  } = product;

  //відображає поле "Виробник" лише якщо воно є
  // const isProducer = !!product.producer;

  return (
    <section className={s.details}>
      <div className={clsx("container", s.detailsInner)}>
        <Link to={goBackLink.current} className={s.goBack}>
          ← Назад до каталогу
        </Link>

        <h2 className={s.pageTitle}>Деталі про {isTire ? "шину" : "диск"}.</h2>

        <article className={s.detailsContainer}>
          <div className={s.imageWrapper}>
            <img
              src={image}
              alt={`${title} ${producer ?? ""}`.trim()}
              className={s.image}
            />
          </div>

          <div className={s.info}>
            {/* name */}
            {isTire ? (
              <h3 className={s.name}>
                Шина {size} <span className={s.model}>{modelTire}</span>{" "}
                <span className={s.producer}>{producer}</span>
              </h3>
            ) : (
              <h3 className={s.name}>
                Диск R{size} <span className={s.producer}>{producer}</span>
              </h3>
            )}

            {/* <div className={s.availability}>
              <span className={instock ? s.stockDot : s.stockDotUnavailable}>
                {typeof instock === "boolean" && (
                  <p>{instock ? "В наявності" : "Уточнюйте наявність"}</p>
                )}
              </span>
            </div> */}
            {typeof instock === "boolean" && (
              <div className={s.availability}>
                <span
                  className={instock ? s.stockDot : s.stockDotUnavailable}
                  aria-hidden="true"
                />
                <span>{instock ? "В наявності" : "Уточнюйте наявність"}</span>
              </div>
            )}

            <div className={s.priceBlock}>
              <span className={s.priceLabel}>Вартість:</span>
              <p className={s.price}>
                {price} {isTire ? "$" : "грн (з ПДВ)"}
              </p>
            </div>

            <div className={s.specifications}>
              <h3 className={s.specificationsTitle}>Характеристики</h3>
              <dl className={s.list}>
                {size && (
                  <div className={s.specRow}>
                    <dt>Розмір</dt>
                    <dd>
                      {product.size} {isRim && "(діаметр в дюймах)"}
                    </dd>
                  </div>
                )}

                {producer && (
                  <div className={s.specRow}>
                    <dt>Виробник:</dt>
                    <dd>{producer}</dd>
                  </div>
                )}

                {isTire && modelTire && (
                  <div className={s.specRow}>
                    <dt>Модель:</dt>
                    <dd>{modelTire}</dd>
                  </div>
                )}

                {isTire && tireType && (
                  <div className={s.specRow}>
                    <dt>Тип:</dt>
                    <dd>{tireType}</dd>
                  </div>
                )}

                {/* ???????????? окремо? */}
                {isTire && (loadIndex || layering) && (
                  <div className={s.specRow}>
                    <dt className={s.longLabel}>
                      Індекс навантаження / слойність:
                    </dt>
                    <dd> {loadIndex || layering}</dd>
                  </div>
                )}
                {/* 
                {isTire && loadIndex && (
                  <div className={s.specRow}>
                    <dt>Індекс навантаження</dt>
                    <dd>{loadIndex}</dd>
                  </div>
                )}

                {isTire && layering && (
                  <div className={s.specRow}>
                    <dt>Слойність шини</dt>
                    <dd>{layering}</dd>
                  </div>
                )} */}

                {/* тут ↓ перевірити чи не задіяно layering в дисках???? чи це тільки для шини, тоді видалити */}
                {/* {layering && (
                  <div className={s.specRow}>
                    <dt>Слойність шини:</dt>
                    <dd>{layering}</dd>
                  </div>
                )} */}

                {isRim && diskModel && (
                  <div className={s.specRow}>
                    <dt>Найменування та приєднувальні розміри</dt>
                    <dd>{diskModel}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};
