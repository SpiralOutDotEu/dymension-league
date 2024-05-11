"use client";
import React, { useState, useEffect } from "react";
import useCosmoShips from "../hooks/useCosmoShips";
import { useWalletStore } from "../store/useWalletStore";  

const CosmoShipsInteraction: React.FC = () => {
  const { account, signer } = useWalletStore();
  const { mint } = useCosmoShips();
  const [tokenId, setTokenId] = useState("");


  useEffect(() => {
    console.log("Account is: ", account);
    console.log("Signer is: ", signer);
  }, [account, signer]);

  const handleMint = async () => {
    if (signer && tokenId) {
      await mint(parseInt(tokenId), signer);
    } else {
      console.error("Signer is not available or Token ID is invalid.");
    }
  };

  return (
    <div>
      <input
        value={tokenId}
        onChange={(e) => setTokenId(e.target.value)}
        placeholder="Token ID"
      />

      <button onClick={handleMint}>Mint</button>
    </div>
  );
};

export default CosmoShipsInteraction;
