import React from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';

const PaginationStyles = styled.div`
  display: flex;
  align-content: center;
  align-items: center;
  justify-items: center;
  border: 1px solid var(--grey);
  margin: 2rem 0;
  border-radius: 5px;
  text-align: center;
  & > * {
    padding: 1rem;
    flex: 1;
    border-right: 1px solid var(--grey);
    text-decoration: none;
    &[aria-current],
    &.current {
      color: var(--red);
      background: var(--grey);
    }
    &[disabled] {
      pointer-events: none;
      color: var(--grey);
    }
  }
  @media (max-width: 800px) {
    .word {
      display: none;
    }
    font-size: 1.4rem;
  }
`;

export default function Pagination({
  pageSize,
  totalCount,
  currentPage,
  skip,
  base,
}) {
  // Make some variables
  const totalPages = Math.ceil(totalCount / pageSize);
  const prevPage = currentPage - 1;
  const nextPage = currentPage + 1;
  const hasPrevPage = prevPage >= 1;
  const hasNextPage = nextPage <= totalPages;
  return (
    <PaginationStyles>
      <Link title="Prev Page" disabled={!hasPrevPage} to={`${base}/${prevPage}`}>
        ← <span className="word">Prev</span>
      </Link>
      {Array.from({ length: totalPages }).map((_, i) => (
        <Link
          key={`page${i}`}
          className={currentPage === 1 && i === 0 ? 'current' : ''}
          to={`${base}/${i > 0 ? i + 1 : ''}`}
        >
          {i + 1}
        </Link>
      ))}
      {/* <Link disabled={!hasNextPage} to={`${base}/${nextPage}`}> */}
      <Link title="Next Page" disabled={!hasNextPage} to={`${base}/${nextPage}`}>
        <span className="word">Next</span> &#8594;
      </Link>
    </PaginationStyles>
  );
}
// ← : &#8592;
// → : &#8594;
