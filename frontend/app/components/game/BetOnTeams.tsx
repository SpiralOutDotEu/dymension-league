"use client";
import React, { useState, useEffect } from "react";
import { useGameLeague } from "../../hooks/useGameLeague";
import { useWalletStore } from "../../store/useWalletStore";
import { ethers } from "ethers";
import { getTokenVideoUrl } from "@/app/utils/token"; // Ensure this utility function is correct

const BetOnTeams: React.FC = () => {
  const { getEnrolledTeams, getTeam, placeBet } = useGameLeague();
  const { signer } = useWalletStore();
  const [teams, setTeams] = useState<
    { teamId: string; teamName: string; owner: string; tokenIds: string[] }[]
  >([]);
  const [bets, setBets] = useState<{ [key: string]: string }>({});
  const [leagueId, setLeagueId] = useState<string>("1");

  useEffect(() => {
    const fetchTeams = async () => {
      if (!signer) {
        console.error("Signer not available");
        return;
      }
      try {
        const teamsData = await getEnrolledTeams();
        if (teamsData) {
          const [teamIds, teamNames, teamOwners] = teamsData;
          const teamDetailsPromises = teamIds.map(
            async (id: number, index: string | number) => {
              const teamDetails = await getTeam(id);
              const [teamName, teamTokens, teamOwner] = teamDetails;
              return {
                teamId: id.toString(),
                teamName: teamNames[index],
                owner: teamOwners[index],
                tokenIds: teamTokens.map((tokenId: { toString: () => any }) =>
                  tokenId.toString()
                ),
              };
            }
          );
          const detailedTeams = await Promise.all(teamDetailsPromises);
          setTeams(detailedTeams);
        } else {
          throw new Error("Invalid or unexpected team data format");
        }
      } catch (error) {
        console.error("Failed to fetch teams:", error);
      }
    };

    fetchTeams();
  }, [signer, getEnrolledTeams, getTeam]);

  const handleBetChange = (teamId: string, value: string) => {
    setBets((prev) => ({ ...prev, [teamId]: value }));
  };

  const placeBetOnTeam = async (teamId: string) => {
    const betAmount = bets[teamId];
    if (!betAmount) return alert("Please enter a bet amount.");

    try {
      const amount = ethers.utils.parseEther(betAmount);
      await placeBet(parseInt(leagueId), parseInt(teamId), amount);
      alert(`Bet placed: ${betAmount} ETH on team ${teamId}`);
    } catch (error) {
      console.error("Error placing bet:", error);
      alert("Failed to place bet.");
    }
  };

  return (
    <div className="p-4 bg-gray-800 text-white">
      <h1 className="text-2xl font-bold mb-6">Enrolled Teams</h1>
      <div className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((team) => (
          <div key={team.teamId} className="p-4 bg-gray-700 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold">{team.teamName}</h2>
            <p className="mb-1">Owner: {team.owner}</p>
            <p className="mb-3">Team ID: {team.teamId}</p>
            <div className="flex justify-center space-x-4 ">
              {team.tokenIds.map(tokenId => (
                <div key={tokenId} className="flex flex-col items-center">
                  <video
                    className="w-128 h-fit object-cover rounded"  // Larger video size and adjusted margin
                    src={getTokenVideoUrl({ tokenId: parseInt(tokenId) })}
                    autoPlay
                    loop
                    muted
                    style={{ objectFit: 'contain' }}  // Ensures video is scaled properly within its boundaries
                  />
                  <p className="text-white text-sm">Spaceship {tokenId}</p>
                </div>
              ))}
            </div>
            <input
              type="text"
              placeholder="Amount in ETH"
              className="mt-1 p-3 bg-gray-900 border border-gray-700 rounded text-lg w-full"  // Full width input
              value={bets[team.teamId] || ""}
              onChange={(e) => handleBetChange(team.teamId, e.target.value)}
            />
            <button
              className="mt-3 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded text-lg"  // Adjusted button size and margin
              onClick={() => placeBetOnTeam(team.teamId)}
            >
              Place Bet
            </button>
          </div>
        ))}
      </div>
    </div>
  );

};
export default BetOnTeams;
