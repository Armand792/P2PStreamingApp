'use client'
import Link from 'next/link';
import Footer from '../footer/Footer';
import { useState } from 'react';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {

  const [isLoginClicked, setIsLoginClicked] = useState<boolean>();

  const handleLoginClick = () => {
    setIsLoginClicked(true);
  };

  const handleSignUpClick = () => {
    setIsLoginClicked(false);
  };

  return (
    <main className='w-full '>
      <div className='bg-white border-b dark:bg-gray-900 dark:border-gray-700 lg:fixed lg:w-full lg:top-0 lg:z-50 lg:left-0'>
        <div className='p-4 mx-auto flex justify-end'>
          <div className="flex lg:mt-0  sm:space-y-0 ">
            <div className="rrelative sm:w-96">
              <input className='w-full h-full px-2 py-3 text-gray-700 bg-white border border-gray-200 rounded-lg peer dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-primary dark:focus:border-primary focus:outline-none focus:ring focus:ring-primary dark:placeholder-gray-400 focus:ring-opacity-20'
                type="text" placeholder="Search for a user" >
              </input>
            </div>
            {isLoginClicked ?  (
            <button className='relative inline-flex items-center justify-center p-0.5 m-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg transition-all ease-in duration-75  hover:bg-opacity-75 bg-gradient-to-br from-purple-600 to-blue-500  hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800'
                    onClick={handleSignUpClick}
            >
              <Link
                href={'/register'}
                className=" p-0.5 relative m-2 text-sm cursor-pointer"
              >
                Sign Up
              </Link>
            </button>
            ) : (
            <button className='relative inline-flex items-center justify-center p-0.5 m-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg transition-all ease-in duration-75  hover:bg-opacity-75 bg-gradient-to-br from-purple-600 to-blue-500  hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800'
                    onClick={handleLoginClick}
            >
              <Link
                href={'/login'}
                className=" p-0.5 relative m-2 text-sm cursor-pointer"
              >
                Log in
              </Link>
            </button>
             )}
          </div>
        </div>
      </div>
      <div className='min-h-screen pt-28 w-full flex flex-col items-center dark:bg-gray-900 dark:border-gray-700 justify-center px-4'>
        {children}
      </div>
      <Footer />
    </main>
  );
};

export default AuthLayout;
