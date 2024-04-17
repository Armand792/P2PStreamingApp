import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { RiCoinsLine } from 'react-icons/ri';
        
interface Props {
    userDashboardInformation: any; 
  }

const ProfileDisplay: React.FC<Props> = ({ userDashboardInformation }) => {

    return (
        <div className="relative">
            <div className="overflow-hidden mb-2 cursor-pointer font-bold text-gray-800 dark:bg-gray-700 dark:text-gray-200 tracking-wider bg-gray-200 rounded-md p-4">
                <div className="flex items-center mb-2">
                    <div className="relative mr-5">
                        <FaUserCircle className="text-gray-500 text-4xl" />
                    </div>
                    <div className="relative"  >
                        <p>
                            <span className="font-bold">{userDashboardInformation?.user_email}</span>
                        </p>
                        <div className="flex items-center">
                            <RiCoinsLine className="text-yellow-500 text-2xl mr-2" />
                            <p>
                                <span className="text-green-500">€ {userDashboardInformation?.wallet_balance} </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileDisplay;