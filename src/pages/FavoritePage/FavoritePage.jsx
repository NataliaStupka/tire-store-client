import { useEffect } from "react";
import { useSelector } from "react-redux";
import s from "./FavoritePage.module.css";

import { ProductsCatalog } from "../../components/ProductsCatalog/ProductsCatalog";
import { selectFavoriteProducts } from "../../redux/catalog/selectors";

const FavoritePage = () => {
  useEffect(() => {
    document.title = "Tires Store | Selected";
  }, []);

  const favoriteProducts = useSelector(selectFavoriteProducts);

  return (
    <section className={s.section}>
      <div className="container">
        <h1 className={s.title}>Обрані товари</h1>
        {favoriteProducts.length > 0 ? (
          <ProductsCatalog products={favoriteProducts} />
        ) : (
          <p className={s.emptyText}>
            💔 У вас поки немає обраних шин.
            <br />
            Додайте вподобані товари, натиснувши на <span>♥</span> у каталозі.
          </p>
        )}
      </div>
    </section>
  );
};

export default FavoritePage;
