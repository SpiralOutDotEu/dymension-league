"use client";
import React, { useState } from "react";
import TokenDisplay from "../../components/mint/TokenDisplay";
import Pagination from "../../components/mint/Pagination";

const TOKENS_PER_PAGE = 12;
const TOTAL_TOKENS = 1500;

export default function Mint() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(TOTAL_TOKENS / TOKENS_PER_PAGE);

  const tokensStartIndex = (currentPage - 1) * TOKENS_PER_PAGE;
  const tokensEndIndex = tokensStartIndex + TOKENS_PER_PAGE;

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: TOKENS_PER_PAGE }, (_, i) => {
          const tokenId = tokensStartIndex + i;
          if (tokenId >= TOTAL_TOKENS) return null;
          return <TokenDisplay key={tokenId} tokenId={tokenId} />;
        })}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
