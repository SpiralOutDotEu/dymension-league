"use client";
import { create } from "zustand";
import { ethers } from "ethers";

declare let window: any;

interface WalletState {
  account: string | null;
  networkChainId: number | null;
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  error: Error | null;
  connectWallet: () => Promise<void>;
}

export const useWalletStore = create<WalletState>((set, get) => {
  const subscribeToWalletEvents = (provider: ethers.providers.Web3Provider) => {
    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum.on("accountsChanged", async (accounts: string[]) => {
        // Handle accounts changed
        await get().connectWallet();
      });

      window.ethereum.on("chainChanged", async (_chainId: string) => {
        // Handle network change
        await get().connectWallet();
      });
    }
  };

  const connectWallet = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(
          window.ethereum,
          "any"
        );
        const accounts = await provider.send("eth_requestAccounts", []);
        subscribeToWalletEvents(provider);
        const network = await provider.getNetwork();
        const signer = await provider.getSigner();
        const networkChainId = Number(network.chainId);

        set({
          provider: provider,
          signer: signer,
          account: accounts[0],
          networkChainId: networkChainId,
        });
      } catch (error) {
        console.error("Error connecting to wallet:", error);
      }
    } else {
      alert(
        "Ethereum object not found, install MetaMask or other browser wallet."
      );
    }
  };

  return {
    account: null,
    networkChainId: null,
    provider: null,
    signer: null,
    error: null,
    connectWallet,
  };
});
