"use client";
import React, { useEffect, useState } from "react";
import { useGameLeague } from "../../hooks/useGameLeague";
import  useCosmoShips  from "../../hooks/useCosmoShips";
import { useWalletStore } from "@/app/store/useWalletStore";
import { getTokenVideoUrl } from "@/app/utils/token";
import { GAMELEAGUE_ADDRESS } from '../../utils/constants';
import { ethers } from "ethers";

export const CreateTeam: React.FC = () => {
  const { account, provider, signer } = useWalletStore();
  const [teamName, setTeamName] = useState("");
  const [tokens, setTokens] = useState<number[]>([]);
  const [selectedTokens, setSelectedTokens] = useState<number[]>([]);
  const { getTokenIdsByOwner, setApproveForAll } = useCosmoShips();
  const { createTeam } = useGameLeague();

  useEffect(() => {
    if (account && provider) {
      getTokenIdsByOwner(account, provider)
        .then(setTokens)
        .catch(console.error);
    }
  }, [account, provider, getTokenIdsByOwner]);

  const toggleTokenSelection = (tokenId: number) => {
    setSelectedTokens((prev) => {
      if (prev.includes(tokenId)) {
        return prev.filter((id) => id !== tokenId); // Deselect if already selected
      } else if (prev.length < 3) {
        return [...prev, tokenId]; // Select if less than 3 selected
      }
      return prev;
    });
  };

  const handleCreateTeam = async () => {
    try {
      if (selectedTokens.length !== 3) {
        alert("Please select exactly three tokens.");
        return;
      }
       // First, set approval for all tokens for the GameLeague contract
       await setApproveForAll(GAMELEAGUE_ADDRESS, true, signer as ethers.Signer);
       alert('Approval granted. Now creating the team...');

      const tx = await createTeam(selectedTokens, teamName);
      await tx.wait();
      alert("Team created successfully!");
    } catch (error) {
      alert(
        `Failed to create team: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 mt-8 bg-gray-800 text-white">
      <h2 className="text-lg mb-4">Create Team</h2>
      <input
        type="text"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
        placeholder="Team Name"
        className="text-black mb-2 p-1 w-full"
      />
      <div className="grid grid-cols-3 gap-4 mb-4">
        {tokens.map(tokenId => (
          <div key={tokenId} onClick={() => toggleTokenSelection(tokenId)} className={`p-1 border-2 ${selectedTokens.includes(tokenId) ? "border-blue-500 border-8 shadow-lg" : "border-gray-500"} cursor-pointer`}>
            <video className="w-full h-40 object-cover" src={getTokenVideoUrl({ tokenId })} autoPlay loop muted />
            <p className="text-center">Token #{tokenId}</p>
          </div>
        ))}
      </div>
      <button
        onClick={handleCreateTeam}
        disabled={selectedTokens.length !== 3}
        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full ${selectedTokens.length !== 3 ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        Create Team
      </button>
    </div>
  );
};