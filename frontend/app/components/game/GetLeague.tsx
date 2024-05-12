"use client";
import React, { useState } from "react";
import { useGameLeague } from "../../hooks/useGameLeague";

const GetLeagueComponent: React.FC = () => {
  const { getLeague } = useGameLeague();
  const [leagueId, setLeagueId] = useState(0);
  const [leagueInfo, setLeagueInfo] = useState<{
    id: number;
    state: string;
    prizePool: string; // Storing as string
    enrolledTeams: number[];
    totalBetsInLeague: string; // Storing as string
  } | null>(null);
  const [error, setError] = useState<string>("");

  const handleGetLeague = async () => {
    try {
      const data = await getLeague(leagueId);
      setLeagueInfo({
        id: data.id.toNumber(), // Assuming id is also a BigNumber, converting it to number
        state: data.state, // Assuming state is a string
        prizePool: data.prizePool.toString(), // Converting BigNumber to string
        enrolledTeams: data.enrolledTeams.map((team: { toNumber: () => any }) =>
          team.toNumber()
        ), // Converting each BigNumber team ID to number
        totalBetsInLeague: data.totalBetsInLeague.toString(), // Converting BigNumber to string
      });
      setError("");
    } catch (err) {
      setError("Failed to fetch league data");
      console.error(err);
    }
  };

  return (
    <div className="bg-gray-900 text-white p-4 rounded-lg shadow-lg flex flex-col space-y-4">
      <h2 className="text-xl font-bold">Get League Details</h2>
      <div className="flex space-x-3">
        <input
          type="number"
          value={leagueId}
          onChange={(e) => setLeagueId(Number(e.target.value))}
          className="bg-gray-800 border border-gray-700 p-2 rounded"
          placeholder="Enter League ID"
        />
        <button
          onClick={handleGetLeague}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Fetch League
        </button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {leagueInfo && (
        <div className="space-y-2">
          <p>
            <strong>ID:</strong> {leagueInfo.id}
          </p>
          <p>
            <strong>State:</strong> {leagueInfo.state}
          </p>
          <p>
            <strong>Prize Pool:</strong> {leagueInfo.prizePool} ETH
          </p>
          <p>
            <strong>Enrolled Teams:</strong>{" "}
            {leagueInfo.enrolledTeams.join(", ")}
          </p>
          <p>
            <strong>Total Bets in League:</strong>{" "}
            {leagueInfo.totalBetsInLeague} ETH
          </p>
        </div>
      )}
    </div>
  );
};

export default GetLeagueComponent;
