"use client";
import React from "react";
import useWallet from "../hooks/useWallet";

const WalletConnect: React.FC = () => {
    const { account, connectWallet } = useWallet();

    const trimmedAddress = account ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}` : '';

    return (
        <div>
            {account ? (
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={connectWallet}>
                    {trimmedAddress}
                </button>
            ) : (
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={connectWallet}>
                    Connect Wallet
                </button>
            )}
        </div>
    );
};

export default WalletConnect;