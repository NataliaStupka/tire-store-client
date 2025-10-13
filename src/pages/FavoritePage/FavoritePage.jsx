import { useEffect } from "react";

const FavoritePage = () => {
  useEffect(() => {
    document.title = "Tires Store | Selected";
  }, []);

  return (
    <section style={{ padding: "60px 0px" }}>
      <div className="container">
        <h1>Обрані шини</h1>
      </div>
    </section>
  );
};

export default FavoritePage;
