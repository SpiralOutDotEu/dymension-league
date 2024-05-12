import { ethers } from 'ethers';
import CosmoShips from '../artifacts/contracts/CosmoShips.json';
import tokenData from '../artifacts/proofs/proofs_0xcba72fb67462937b6fa3a41e7bbad36cf169815ea7fe65f8a4b85fd8f5facb28.json';
import { COSMOSHIPS_ADDRESS } from '../utils/constants';

interface UseCosmoShipsHook {
    mint: (tokenId: number, signer: ethers.Signer) => Promise<void>;
    getTokenIdsByOwner: (ownerAddress: string, provider: ethers.providers.Provider) => Promise<number[]>;
    setApproveForAll : (operator: string, approved: boolean, signer: ethers.Signer) => Promise<string>;
}

const useCosmoShips = (): UseCosmoShipsHook => {
    

    const mint = async (tokenId: number, signer: ethers.Signer) => {
        const contract = new ethers.Contract(COSMOSHIPS_ADDRESS, CosmoShips.abi, signer);
        const tokenInfo = tokenData.find(token => token.tokenId === tokenId);
        if (!tokenInfo) throw new Error("Token data not found");

        const { value, proof } = tokenInfo;
        const transaction = await contract.mint(tokenId, value, proof, { value: ethers.utils.parseEther("1") });
        await transaction.wait();
    };

    const getTokenIdsByOwner = async (ownerAddress: string, provider: ethers.providers.Provider): Promise<number[]> => {
        const contract = new ethers.Contract(COSMOSHIPS_ADDRESS, CosmoShips.abi, provider);
        const balance = await contract.balanceOf(ownerAddress);
        const tokenIds = [];

        for (let index = 0; index < balance.toNumber(); index++) {
            const tokenId = await contract.tokenOfOwnerByIndex(ownerAddress, index);
            tokenIds.push(tokenId.toNumber());
        }

        return tokenIds;
    };

    const setApproveForAll = async (operator: string, approved: boolean, signer: ethers.Signer): Promise<string> => {
        if (!signer) throw new Error("Wallet not connected");
        const contract = new ethers.Contract(COSMOSHIPS_ADDRESS, CosmoShips.abi, signer);
        const transaction = await contract.setApprovalForAll(operator, approved);
        try {
            await transaction.wait();
        } catch (error) {
            const errorMessage = (error instanceof Error )? error.message : "Unknown ApproveForAll Error"
            return errorMessage
        }
        return("ok");
      };
    

    return { mint, getTokenIdsByOwner , setApproveForAll};
};

export default useCosmoShips;