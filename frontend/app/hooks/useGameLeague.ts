import { ethers } from "ethers";
import { useWalletStore } from "../store/useWalletStore";
import GameLeagueABI from "../artifacts/contracts/GameLeague.json";
import { GAMELEAGUE_ADDRESS } from "../utils/constants";

const contractAddress = GAMELEAGUE_ADDRESS;

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

  return { createTeam, enrollToLeague, placeBet, getTeam };
};
