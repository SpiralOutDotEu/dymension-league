"use client";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

declare let window: any;

interface UseWalletHook {
  account: string | null;
  connectWallet: () => Promise<void>;
  signer: ethers.Signer | null;
}

const useWallet = (): UseWalletHook => {
  const [account, setAccount] = useState<string | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  useEffect(() => {
    console.log("signer is set");
  }, [signer]);

  const connectWallet = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          const signer = provider.getSigner();
          setSigner(signer);
          console.log("Signer set:", signer);
        } else {
          setAccount(null);
          setSigner(null);
        }
      } catch (error) {
        console.error("Failed to connect wallet", error);
        setSigner(null);
      }
    } else {
      alert("Please install MetaMask!");
      setSigner(null);
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", async (accounts: string[]) => {
        if (accounts.length === 0) {
          setAccount(null);
          setSigner(null);
        } else {
          setAccount(accounts[0]);
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          setSigner(provider.getSigner());
        }
      });
    }
  }, []);

  return { account, connectWallet, signer };
};

export default useWallet;
