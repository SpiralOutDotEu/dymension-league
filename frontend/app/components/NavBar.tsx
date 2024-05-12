import React from 'react';
import Link from 'next/link';

const NavBar: React.FC = () => {
  return (
    <nav className="bg-transparent py-2">
    <div className="container mx-auto">
      <div className="flex space-x-4">
          <Link href="/nft/mint" className="text-gray-600 hover:text-gray-500 transition-colors duration-200 ease-in-out">
            mint
          </Link>
          <Link href="/team/create" className="text-gray-600 hover:text-gray-500 transition-colors duration-200 ease-in-out">
            Create Team
          </Link>
          <Link href="/team/enroll" className="text-gray-600 hover:text-gray-500 transition-colors duration-200 ease-in-out">
            Enroll Team
          </Link>
          <Link href="/admin" className="text-gray-600 hover:text-gray-500 transition-colors duration-200 ease-in-out">
            Governance Simulator
          </Link>
          <Link href="/bet" className="text-gray-600 hover:text-gray-500 transition-colors duration-200 ease-in-out">
            Bet 
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
