import s from "./Pagination.module.css";

const Pagination = ({ pages, currentPage, onPageChange }) => {
  return (
    <div>
      <ul className={s.pagination}>
        {pages.map((pageNum) => {
          return (
            <li key={pageNum}>
              <button
                className={`${s.pageButton} ${
                  currentPage === pageNum ? s.activePage : ""
                }`}
                onClick={() => {
                  onPageChange(pageNum);
                }}
              >
                {pageNum}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Pagination;
