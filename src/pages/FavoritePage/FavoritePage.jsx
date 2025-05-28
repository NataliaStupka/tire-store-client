import { useEffect } from "react";

const FavoritePage = () => {
  useEffect(() => {
    document.title = "Tires Store | Selected";
  }, []);

  return (
    <>
      <h1>Обрані шини</h1>
    </>
  );
};

export default FavoritePage;
