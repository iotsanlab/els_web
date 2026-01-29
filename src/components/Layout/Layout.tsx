// components/Layout/Layout.tsx
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../Header/Header';
import LeftMenu from '../LeftMenu/LeftMenu';
import Loading from '../Loading';
import { useDeviceInitialization } from '../../hooks/useDeviceInitialization';

const Layout: React.FC = () => {
  const location = useLocation();
  const { isLoading } = useDeviceInitialization();
  
  const isVehiclePage = location.pathname.startsWith('/vehicle/');

  const isBatteryHealthPage = location.pathname.startsWith('/battery-health/');
  
  const mainClassName = isVehiclePage || isBatteryHealthPage
    ? 'bg-gray2 dark:bg-darkBgColor flex-1 p-0 overflow-hidden'
    : 'bg-gray2 dark:bg-darkBgColor flex-1 pl-[30px] pr-[110px] pb-4 overflow-auto pt-4';

  return (
    <div className="flex flex-col h-screen bg-gray2">
      <Header />
      
      <div className="flex bg-gray2 h-[calc(100vh-60px)]">
        <aside className="w-[110px] bg-white dark:bg-gray10">
          <LeftMenu />
        </aside>
        
        <main className={mainClassName}>
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loading />
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
};

export default Layout;