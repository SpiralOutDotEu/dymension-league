import React from 'react';
import WalletConnect from './WalletConnect';
import { FaRocket } from 'react-icons/fa';

const Header: React.FC = () => {
    return (
        <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
            <FaRocket className="text-lg text-blue-400" /> 
            <h1 className="text-xl font-semibold">Dymension League</h1>
        </div>
        <WalletConnect />
    </header>
    );
};

export default Header;