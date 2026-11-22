import { Link } from "react-router-dom";
import { Seo } from "../../components/Seo/Seo";

const NotFoundPage = () => {
  return (
    <main>
      <Seo title="Сторінку не знайдено" noindex={true} />

      <div className="container">
        <h1>404 - Сторінку не знайдено</h1>
        <p>Сторінка, яку ви шукаєте, не існує.</p>
        <Link to="/" className="button">
          Повернутися на головну
        </Link>
      </div>
    </main>
  );
};

export default NotFoundPage;
