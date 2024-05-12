"use client"
import React, { useState } from 'react';
import { useGameLeague } from '../../hooks/useGameLeague';

const GameLeagueComponent: React.FC = () => {
    const {
        createTeam,
        enrollToLeague,
        placeBet,
        getTeam,
        getTeamsByOwner,
        initializeLeague,
        getLeague,
        isTeamEnrolled,
        endEnrollmentAndStartBetting,
        getUserBets,
        endBettingAndStartGame,
        setupMatches,
        determineMatchOutcome,
        runGameLeague
    } = useGameLeague();

    const [teamId, setTeamId] = useState(0);
    const [leagueId, setLeagueId] = useState(0);
    const [userId, setUserId] = useState('');
    const [seed, setSeed] = useState(0);
    const [amount, setAmount] = useState('');

    return (
        <div className="bg-gray-900 text-white p-5 rounded-lg shadow-lg grid grid-cols-1 md:grid-cols-2 gap-6">
            <h1 className="text-3xl font-bold text-center text-blue-400 col-span-full">Dymensions League Governance Simulator</h1>
            
            <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="input bg-gray-800 border-none w-7/12 py-2"
                        placeholder="Amount to distribute to winners, in ether"
                    />
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded"
                        onClick={() => initializeLeague(parseFloat(amount))}
                    >
                        Initialize League, start Enrolment
                    </button>
                </div>
                <button className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded" onClick={() => endEnrollmentAndStartBetting()}>
                    End Enrollment, Start Betting
                </button>
                <button className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded" onClick={() => endBettingAndStartGame(leagueId)}>
                    End Betting, Start Game
                </button>
                <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded" onClick={() => runGameLeague()}>
                    Run Game League
                </button>
                <button className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded" onClick={() => determineMatchOutcome(leagueId, teamId)}>
                    Distribute Rewards
                </button>
            </div>

            <div className="flex flex-col space-y-4 border-2 m-2 p-2">
                <h1 className="font-bold bg-gray-800 text-center"> Help Functions</h1>
                <div className="flex items-center space-x-2">
                    <input type="number" value={leagueId} onChange={(e) => setLeagueId(Number(e.target.value))} className="input bg-gray-800 border-none" placeholder="League ID" />
                    <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={() => getLeague(leagueId)}>
                        Get League Info
                    </button>
                </div>
                <div className="flex items-center space-x-2">
                    <input type="number" value={teamId} onChange={(e) => setTeamId(Number(e.target.value))} className="input bg-gray-800 border-none" placeholder="Team ID" />
                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => isTeamEnrolled(teamId, leagueId)}>
                        Check Team Enrollment
                    </button>
                </div>
                <div className="flex items-center space-x-2">
                    <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} className="input bg-gray-800 border-none" placeholder="User ID" />
                    <button className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded" onClick={() => getUserBets(leagueId, userId)}>
                        Get User Bets
                    </button>
                </div>

                <div className="flex items-center space-x-2">
                    <input type="number" value={seed} onChange={(e) => setSeed(Number(e.target.value))} className="input bg-gray-800 border-none" placeholder="Seed for Matches" />
                    <button className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded" onClick={() => setupMatches(seed)}>
                        Setup Matches
                    </button>
                </div>

            </div>
        </div>
    );
};

export default GameLeagueComponent;