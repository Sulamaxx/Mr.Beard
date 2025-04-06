import React from 'react';
import { Pagination } from 'react-bootstrap';
import './PaginationComponent.scss';

interface PaginationComponentProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
  showNextButton?: boolean;
  className?: string;
  maxVisiblePages?: number; // Maximum number of page buttons to show
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showNextButton = true,
  className = '',
  maxVisiblePages = 2, // Default to showing 2 pages on desktop
}) => {
  // Don't show pagination if only one page
  if (totalPages <= 1) {
    return null;
  }

  // Logic to determine which page numbers to display
  let startPage: number;
  let endPage: number;

  if (totalPages <= maxVisiblePages) {
    // If total pages is less than max visible, show all pages
    startPage = 1;
    endPage = totalPages;
  } else {
    // Calculate middle pages
    const middlePosition = Math.floor(maxVisiblePages / 2);
    
    if (currentPage <= middlePosition + 1) {
      // Near the start
      startPage = 1;
      endPage = maxVisiblePages;
    } else if (currentPage >= totalPages - middlePosition) {
      // Near the end
      startPage = totalPages - maxVisiblePages + 1;
      endPage = totalPages;
    } else {
      // Somewhere in the middle
      startPage = currentPage - middlePosition;
      endPage = currentPage + middlePosition;
    }
  }

  // Create array of visible page numbers
  const visiblePageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    visiblePageNumbers.push(i);
  }

  return (
    <div className={`pagination-container d-flex justify-content-center ${className}`}>
      <Pagination>
        {/* First page and Previous buttons */}
        {currentPage > 1 && (
          <>
            <Pagination.First onClick={() => onPageChange(1)} />
            <Pagination.Prev onClick={() => onPageChange(currentPage - 1)} />
          </>
        )}

        {/* Show first page and ellipsis if needed */}
        {startPage > 1 && (
          <>
            <Pagination.Item onClick={() => onPageChange(1)}>1</Pagination.Item>
            {startPage > 2 && <Pagination.Ellipsis disabled />}
          </>
        )}

        {/* Visible page numbers */}
        {visiblePageNumbers.map(number => (
          <Pagination.Item
            key={number}
            active={number === currentPage}
            onClick={() => onPageChange(number)}
          >
            {number}
          </Pagination.Item>
        ))}

        {/* Show last page and ellipsis if needed */}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <Pagination.Ellipsis disabled />}
            <Pagination.Item onClick={() => onPageChange(totalPages)}>
              {totalPages}
            </Pagination.Item>
          </>
        )}

        {/* Next and Last buttons */}
        {currentPage < totalPages && (
          <>
            <Pagination.Next onClick={() => onPageChange(currentPage + 1)}>
              {showNextButton && (
                <>
                  NEXT <i className="bi bi-chevron-right"></i>
                </>
              )}
            </Pagination.Next>
            {!showNextButton && (
              <Pagination.Last onClick={() => onPageChange(totalPages)} />
            )}
          </>
        )}
      </Pagination>
    </div>
  );
};

export default PaginationComponent;