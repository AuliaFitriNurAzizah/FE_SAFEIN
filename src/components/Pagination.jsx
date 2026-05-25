import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange, itemsPerPage, onItemsPerPageChange, showItemsPerPage = true }) => {
  if (totalPages <= 0) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <nav className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-3 gap-3">
      <div className="d-flex align-items-center gap-3">
        <div className="text-muted small">
          Showing page {currentPage} of {totalPages}
        </div>
        {showItemsPerPage && (
          <div className="d-flex align-items-center gap-2">
            <span className="text-muted small">Data per halaman:</span>
            <select 
              className="form-select form-select-sm shadow-none" 
              style={{ width: 'auto' }}
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
          </div>
        )}
      </div>
      <ul className="pagination pagination-sm mb-0">
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button
            className="page-link shadow-none"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
        </li>
        {pages.map((page) => (
          <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
            <button
              className="page-link shadow-none"
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          </li>
        ))}
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button
            className="page-link shadow-none"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
