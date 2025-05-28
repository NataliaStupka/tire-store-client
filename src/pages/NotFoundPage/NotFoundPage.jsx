import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <main>
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
