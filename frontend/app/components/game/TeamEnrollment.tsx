"use client";
import React, { useEffect, useState } from "react";
import { useGameLeague } from "../../hooks/useGameLeague";
import { useWalletStore } from "../../store/useWalletStore";
import { getTokenVideoUrl } from "@/app/utils/token"; 
import { ethers } from "ethers";

export const TeamEnrollment: React.FC = () => {
  const { account, provider } = useWalletStore();
  const { enrollToLeague, getTeamsByOwner } = useGameLeague();
  const [teams, setTeams] = useState<{
    teamIds: string[];
    teamNames: string[];
    tokenIndexes: string[][];
  }>({ teamIds: [], teamNames: [], tokenIndexes: [] });

  useEffect(() => {
    if (account && provider) {
      getTeamsByOwner(account, provider as ethers.providers.Web3Provider)
        .then((data) => {
          const { teamIds, teamNames, tokenIndexes } = data;
          setTeams({
            teamIds: teamIds.map((id) => id.toString()),
            teamNames,
            tokenIndexes: tokenIndexes.map((indexArray) =>
              indexArray.map((index) => index.toString())
            ), 
          });
        })
        .catch(console.error);
    }
  }, [account, getTeamsByOwner, provider]);

  const handleEnroll = async (teamId: string) => {
    try {
      await enrollToLeague(parseInt(teamId)); 
      alert(`Team ${teamId} enrolled successfully!`);
    } catch (error) {
      alert(
        `Failed to enroll team: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 mt-8 bg-gray-800 text-white">
      <h2 className="text-lg mb-4">My Teams</h2>
      <ul>
        {teams.teamIds.map((teamId, index) => (
          <li
            key={teamId}
            className="mb-6 last:mb-0 bg-gray-700 p-4 rounded shadow-lg" 
          >
            <div className="flex justify-between items-center">
              <span className="flex-grow">
                {teams.teamNames[index]} - Team ID: {teamId}
              </span>
              <div className="flex flex-grow justify-center space-x-4">
                {teams.tokenIndexes[index].map((tokenId) => (
                  <div key={tokenId} className="flex flex-col items-center">
                    <video
                      className="w-128 h-64 object-contain"
                      src={getTokenVideoUrl({ tokenId: parseInt(tokenId, 10) })}
                      autoPlay
                      loop
                      muted
                    />
                    <p className="text-white text-sm mt-1">
                      Spaceship {tokenId}
                    </p>
                  </div>
                ))}
              </div>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex-grow-0"
                onClick={() => handleEnroll(teamId)}
              >
                Enroll to League
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeamEnrollment;
