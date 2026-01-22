import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { SvgIcons } from '../../assets/icons/SvgIcons';
import { useDarkMode } from '../../context/DarkModeContext';
import { useTranslation } from 'react-i18next';


interface DropdownProps {
  options: string[]; 
  selectedIndex?: number;
  onChange: (index: number, value: string) => void;
}



const Dropdown: React.FC<DropdownProps> = ({ options, selectedIndex = 0, onChange }) => {
  const { isDarkMode } = useDarkMode();
  const {t} = useTranslation();

  
  const handleSelect = (index: number, value: string) => {
    onChange(index, value);
  };

  return (
    <Menu as="div" className="relative text-left">
      <div>
        <MenuButton className="flex items-center justify-center w-[85px] h-[24px] px-2 text-sm font-semibold shadow-xs dark:bg-gray9 dark:text-white  gap-x-1 text-gray4 bg-gray1 hover:border-transparent hover:bg-gray2 dark:hover:bg-gray8" style={{ userSelect: 'none'  }}>
          <p className="self-center text-xs font-bold tracking-wider text-gray4 dark:text-gray4 font-inter">
            {options[selectedIndex]}

          </p>
          <SvgIcons iconName="ArrowBottom" fill={isDarkMode ? "#FFFFFF" : "#B9C2CA"} />
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute right-0 z-50 w-56 mt-2 transition origin-top-right bg-white rounded-l shadow-lg dark:bg-gray9 ring-1 ring-black/5 focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
      >
        <div className="py-1">
          {options.map((option, index) => (
            <MenuItem key={index}>
              {() => (
                <a
                  href="#"
                  onClick={() => handleSelect(index, option)}
                  className={`block px-4 py-2 text-sm ${
                    selectedIndex === index
                      ? 'bg-gray2 text-gray10 dark:bg-gray8 dark:text-white hover:text-gray10 dark:hover:text-white'
                      : 'hover:bg-gray1 hover:text-gray10 text-gray10 dark:text-gray4 dark:hover:bg-gray8 dark:hover:text-white'
                  } data-focus:bg-mstYellow data-focus:outline-hidden focus:bg-gray1 dark:focus:bg-gray8`}
                >
                  {option}
                </a>
              )}
            </MenuItem>
          ))}
        </div>
      </MenuItems>
    </Menu>
  );
};

export default Dropdown;
