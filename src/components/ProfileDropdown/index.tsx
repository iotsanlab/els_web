import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { SvgIcons } from '../../assets/icons/SvgIcons';
import { useEffect, useRef } from 'react';
import { authUtils } from '../../routes/PrivateRoute/auth';
import { useTranslation } from 'react-i18next';
import allDevices from '../../store/AllDevices';
import { deviceStore } from '../../store/DeviceStore';
import deviceAttributes from '../../store/DeviceAttributes';
import deviceWorkStore from '../../store/DeviceTelemetry';

interface Props {
  isClicked?: boolean;
  onClickOutside?: () => void;
}


const ProfileDropdown = ({ isClicked, onClickOutside }: Props) => {
  const { t } = useTranslation();

  const menuRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClickOutside?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClickOutside]);

  const handleLogout = () => {
    authUtils.logout();
    deviceAttributes.clear();
    allDevices.clearData();
    deviceStore.clearData();
    deviceWorkStore.clear();
  }

  return (
    <Menu id="profileMenu" as="div" className="relative inline-block text-left z-[9999]" ref={menuRef}>
      <div>
        <MenuButton
          className="btn btn-ghost btn-circle avatar "

        >
          <div className="rounded-full">
            <SvgIcons iconName="Profile" fill={isClicked ? "#424D57" : "#fff"} />
          </div>
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute right-0 z-10 w-56 transition origin-top-right bg-white divide-y divide-gray-100 shadow-lg rounded-[10px] ring-1 ring-black/5 focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
      >
        <div className="py-1">
          <MenuItem >
            <a
              href="/account"
              className="flex items-center px-4 py-2 text-sm text-gray-700 group data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden">
              <SvgIcons iconName='HamburgerMenu' fill='#424D57' />
              <p className='pl-2 text-xs font-bold leading-normal tracking-wide text-gray9 font-inter'>{t("profileModal.accountInfo")}</p>
            </a>
          </MenuItem>

        </div>
       {/* 
        <div className="py-1">
          <MenuItem>
            <a
              href="#"
              className="flex items-center px-4 py-2 text-sm text-gray-700 group data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
            >
              <SvgIcons iconName='Commnet' fill='#424D57' />
              <p className='pl-2 text-xs font-bold leading-normal tracking-wide text-gray9 font-inter'>{t("profileModal.sendFeedback")}</p>


            </a>
          </MenuItem>

        </div>
        <div className="py-1">
          <MenuItem >
            <a
              href="#"
              className="flex items-center px-4 py-2 text-sm text-gray-700 group data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
            >
              <SvgIcons iconName='Help' fill='#424D57' />
              <p className='pl-2 text-xs font-bold leading-normal tracking-wide text-gray9 font-inter'>{t("profileModal.help")}</p>


            </a>
          </MenuItem>

        </div>

         */}
        <div className="py-1">
          <MenuItem >
            <a
              href="/settings"
              className="flex items-center px-4 py-2 text-sm text-gray-700 group data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
            >
              <SvgIcons iconName='Settings' fill='#424D57' />
              <p className='pl-2 text-xs font-bold leading-normal tracking-wide text-gray9 font-inter'>{t("profileModal.settings")}</p>


            </a>
          </MenuItem>

        </div>
       
        <div className="py-1 cursor-pointer">
          <MenuItem >
            <div
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-sm text-gray-700 group data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
            >
              <SvgIcons iconName='Logout' fill='#424D57' />
              <p className='pl-2 text-xs font-bold leading-normal tracking-wide text-gray9 font-inter'>{t("profileModal.logout")}</p>


            </div>
          </MenuItem>

        </div>

      </MenuItems>
    </Menu>
  );

};
export default ProfileDropdown;