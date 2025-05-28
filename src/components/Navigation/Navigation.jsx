import { NavLink } from "react-router-dom";
import clsx from "clsx";
import s from "./Navigation.module.css";

const buildLinkClass = ({ isActive }) => clsx(s.link, { [s.active]: isActive });

const Navigation = () => {
  return (
    <nav className={s.nav}>
      <NavLink to="/">
        {/* <img src="/tire.svg" alt="Tire Store Логотип" width="40" height="40" /> */}
        LOGO
      </NavLink>
      <div>
        <NavLink
          to="/"
          className={(props) => clsx(buildLinkClass(props), s.navItem)}
        >
          Головна
        </NavLink>

        <NavLink to="/favorite" className={buildLinkClass}>
          Улюблені
        </NavLink>
      </div>
    </nav>
  );
};

export default Navigation;
