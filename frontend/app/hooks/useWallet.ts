import { useEffect, useState } from 'react';

declare let window: any;

interface UseWalletHook {
    account: string | null;
    connectWallet: () => Promise<void>;
}

const useWallet = (): UseWalletHook => {
    const [account, setAccount] = useState<string | null>(null);

    const connectWallet = async () => {
        if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
            try {
                const accounts: string[] = await window.ethereum.request({ method: 'eth_requestAccounts' });
                setAccount(accounts[0]);
            } catch (error) {
                console.error("Failed to connect wallet", error);
            }
        } else {
            alert('Please install MetaMask!');
        }
    };

    useEffect(() => {
        if (account) {
            window.ethereum.on('accountsChanged', (accounts: string[]) => {
                setAccount(accounts[0]);
            });
        }
    }, [account]);

    return { account, connectWallet };
};

export default useWallet;
