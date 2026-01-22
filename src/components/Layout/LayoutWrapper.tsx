import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import LeftMenu from '../LeftMenu/LeftMenu';

const LayoutWrapper: React.FC = () => {


  return (
    <div className="flex flex-col h-screen bg-gray2">
      {/* Header - Sabit Yükseklik */}
      <Header />

      {/* Main Content Area (flex) w-full min-w-auto 2xl:min-w-auto md:min-w-[1200px] sm:min-w-[1200px] */}
      <div className="flex bg-gray2 h-[calc(100vh-60px)] ">
        {/* Sol Menü (LeftMenu) */}
        <div className="w-[110px] bg-white dark:bg-gray10">
          <LeftMenu />
        </div>

        {/* Sağ Alan (Main Content) */}
        <main className={` bg-gray2 dark:bg-darkBgColor flex-1 p-0 overflow-hidden`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default LayoutWrapper;
