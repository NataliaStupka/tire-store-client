import { useEffect } from "react";
import { TiresCatalog } from "../../components/TiresCatalog/TiresCatalog";
import { useSelector } from "react-redux";
import { selectFavoriteTires } from "../../redux/tire/selectors";
import s from "./FavoritePage.module.css";

const FavoritePage = () => {
  useEffect(() => {
    document.title = "Tires Store | Selected";
  }, []);

  const favoriteTires = useSelector(selectFavoriteTires);

  return (
    <section className={s.section}>
      <div className="container">
        <h1 className={s.title}>Обрані шини</h1>
        {favoriteTires.length > 0 ? (
          <TiresCatalog tires={favoriteTires} />
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
