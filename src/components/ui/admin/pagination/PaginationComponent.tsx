import React from 'react';
import { Pagination } from 'react-bootstrap';
import './PaginationComponent.scss';

interface PaginationComponentProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
  showNextButton?: boolean;
  className?: string;
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showNextButton = true,
  className = '',
}) => {
  // Generate page numbers for pagination
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={`pagination-container d-flex justify-content-center ${className}`}>
      <Pagination>
        {pageNumbers.map(number => (
          <Pagination.Item
            key={number}
            active={number === currentPage}
            onClick={() => onPageChange(number)}
          >
            {number}
          </Pagination.Item>
        ))}
        {showNextButton && currentPage < totalPages && (
          <Pagination.Next onClick={() => onPageChange(currentPage + 1)}>
            NEXT <i className="bi bi-chevron-right"></i>
          </Pagination.Next>
        )}
      </Pagination>
    </div>
  );
};

export default PaginationComponent;