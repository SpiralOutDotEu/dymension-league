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

  return { createTeam, enrollToLeague, placeBet, getTeam, getTeamsByOwner };
};
