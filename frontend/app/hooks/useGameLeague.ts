import { ethers } from "ethers";
import { useWalletStore } from "../store/useWalletStore";
import GameLeagueABI from "../artifacts/contracts/GameLeague.json";
import { GAMELEAGUE_ADDRESS } from "../utils/constants";

const contractAddress = GAMELEAGUE_ADDRESS;

interface TeamInfo {
  teamIds: number[];
  teamNames: string[];
  tokenIndexes: number[][];
}

getTeamsByOwner: (owner: string, provider: ethers.providers.Provider) =>
  Promise<TeamInfo>;

export const useGameLeague = () => {
  const { signer } = useWalletStore();

  const getContract = () => {
    if (!signer) throw new Error("Wallet not connected");
    return new ethers.Contract(contractAddress, GameLeagueABI.abi, signer);
  };

  const createTeam = async (nftIds: number[], teamName: string) => {
    const contract = getContract();
    return contract.createTeam(nftIds, teamName);
  };

  const enrollToLeague = async (teamId: number) => {
    const contract = getContract();
    return contract.enrollToLeague(teamId);
  };

  const placeBet = async (
    leagueId: number,
    teamId: number,
    amount: ethers.BigNumber
  ) => {
    const contract = getContract();
    return contract.placeBet(leagueId, teamId, amount);
  };

  const getTeam = async (teamId: number) => {
    const contract = getContract();
    return contract.getTeam(teamId);
  };

  const getTeamsByOwner = async (
    owner: string,
    provider: ethers.providers.Provider
  ): Promise<{
    teamIds: number[];
    teamNames: string[];
    tokenIndexes: number[][];
  }> => {
    if (!provider) throw new Error("Provider not set");
    const contract = new ethers.Contract(
      contractAddress,
      GameLeagueABI.abi,
      provider
    );
    const [teamIds, teamNames, tokenIndexes] = await contract.getTeamsByOwner(
      owner
    );
    return { teamIds, teamNames, tokenIndexes };
  };

  const initializeLeague = async (value: number) => {
    const contract = getContract();
    return contract.initializeLeague({ value: ethers.utils.parseEther(value.toString()) });
  };

  const getLeague = async (leagueId: number) => {
    const contract = getContract();
    return contract.getLeague(leagueId);
  };

  const isTeamEnrolled = async (teamId: number, leagueId: number) => {
    const contract = getContract();
    return contract.isTeamEnrolled(teamId, leagueId);
  };

  const endEnrollmentAndStartBetting = async () => {
    const contract = getContract();
    return contract.endEnrollmentAndStartBetting();
  };

  const getUserBets = async (leagueId: number, user: string) => {
    const contract = getContract();
    return contract.getUserBets(leagueId, user);
  };

  const endBettingAndStartGame = async (leagueId: number) => {
    const contract = getContract();
    return contract.endBettingAndStartGame(leagueId);
  };

  const setupMatches = async (seed: number) => {
    const contract = getContract();
    return contract.setupMatches(seed);
  };

  const determineMatchOutcome = async (leagueId: number, gameId: number) => {
    const contract = getContract();
    return contract.determineMatchOutcome(leagueId, gameId);
  };

  const runGameLeague = async () => {
    const contract = getContract();
    return contract.runGameLeague();
  };

  return {
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
    runGameLeague,
  };
};
