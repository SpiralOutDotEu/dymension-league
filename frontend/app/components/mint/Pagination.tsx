import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const maxPageNumberVisible = 5;  // Maximum page numbers visible at once
    let startPage = Math.max(currentPage - 2, 1);
    let endPage = startPage + maxPageNumberVisible - 1;
  
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(endPage - maxPageNumberVisible + 1, 1);
    }
  
    const pages = [];
    for (let page = startPage; page <= endPage; page++) {
      pages.push(page);
    }
  
    return (
      <div className="flex justify-center items-center mt-4 mb-8">
        <button onClick={() => onPageChange(1)} disabled={currentPage === 1} className="mx-1 text-lg px-3 py-1 rounded bg-gray-300 text-gray-800 hover:bg-gray-400">
          First
        </button>
        {startPage > 1 && <div className="text-lg px-3 py-1">...</div>}
        {pages.map(page => (
          <button key={page} onClick={() => onPageChange(page)} className={`mx-1 px-3 py-1 rounded text-lg ${currentPage === page ? 'bg-gray-400 text-white' : 'bg-gray-300 text-gray-800 hover:bg-gray-400'}`}>
            {page}
          </button>
        ))}
        {endPage < totalPages && <div className="text-lg px-3 py-1">...</div>}
        <button onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages} className="mx-1 text-lg px-3 py-1 rounded bg-gray-300 text-gray-800 hover:bg-gray-400">
          Last
        </button>
      </div>
    );
  };
  
  export default Pagination;