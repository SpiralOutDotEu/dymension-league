import React from "react";
import { getTokenVideoUrl } from "../../utils/token";
import useCosmoShips from "../../hooks/useCosmoShips";
import { useWalletStore } from "../../store/useWalletStore";

interface TokenDisplayProps {
  tokenId: number;
}

const TokenDisplay: React.FC<TokenDisplayProps> = ({ tokenId }) => {
  const videoUrl = getTokenVideoUrl({ tokenId });
  const { account, signer } = useWalletStore();
  const { mint } = useCosmoShips();

  const handleMint = async () => {
    if (signer && tokenId) {
      await mint(tokenId, signer);
    } else {
      console.error("Signer is not available or Token ID is invalid.");
    }
  };

  return (
    <div className="p-2 border rounded shadow-sm space-y-2">
      <h2 className="text-sm font-semibold">Spaceship #{tokenId}</h2>
      <video className="w-full" controls autoPlay loop muted>
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 text-sm rounded"
        onClick={handleMint}
      >
        Mint
      </button>
    </div>
  );
};

export default TokenDisplay;
