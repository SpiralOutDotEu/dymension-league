import { ethers } from 'ethers';
import CosmoShips from '../artifacts/contracts/CosmoShips.json';
import tokenData from '../artifacts/proofs/proofs_0xcba72fb67462937b6fa3a41e7bbad36cf169815ea7fe65f8a4b85fd8f5facb28.json';

const contractAddress = '0x3a906E15AFFb6923D62dfCB5923495cad60A712b';

interface UseCosmoShipsHook {
    mint: (tokenId: number, signer: ethers.Signer) => Promise<void>;
}

const useCosmoShips = (): UseCosmoShipsHook => {
    

    const mint = async (tokenId: number, signer: ethers.Signer) => {
        const contract = new ethers.Contract(contractAddress, CosmoShips.abi, signer);
        const tokenInfo = tokenData.find(token => token.tokenId === tokenId);
        if (!tokenInfo) throw new Error("Token data not found");

        const { value, proof } = tokenInfo;
        const transaction = await contract.mint(tokenId, value, proof, { value: ethers.utils.parseEther("1") });
        await transaction.wait();
    };

    return { mint };
};

export default useCosmoShips;