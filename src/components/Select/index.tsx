'use client'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { SvgIcons } from '../../assets/icons/SvgIcons';

import { useTranslation } from 'react-i18next';



interface SelectProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  isArrow?: boolean;
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  className,
  isArrow = false
}) => {
  const {t} = useTranslation();

  return (
    <Listbox value={value} onChange={onChange}>

      <div className="relative">
        <ListboxButton
          className={`drop-shadow-[2px_2px_4px_#00000026] flex w-full cursor-default rounded-[5px] bg-white dark:bg-gray10 focus:bg-white focus:border-0 focus:outline-none pr-2 pl-3 text-left text-gray10 hover:border-0 border-mstYellow border-0 min-h-[36px] ${className}`}>
          <span className="block truncate font-inter font-medium text-[12px] dark:text-white">
            {value ? value : t("global.select")}
          </span>

          {isArrow && <SvgIcons iconName='DownArrow' fill='#B9C2CA'/>}
        </ListboxButton>


        <ListboxOptions
          transition
          className="
          absolute z-10 mt-1 min-h-[36px] max-h-[500px] w-full overflow-auto
          rounded-[5px] bg-white dark:bg-gray9 py-1 text-base  drop-shadow-[2px_2px_4px_#00000026] overflow-y-auto"
        >
          {options.map((option, index) => (
            <ListboxOption
              key={index}
              value={option}
              className="group relative cursor-default py-2 pr-9 pl-3 text-gray10 text-[14px] select-none hover:bg-mstYellow focus:text-white"
            >
              <span className="block truncate font-inter font-medium text-[12px] group-data-selected:font-semibold group-hover:text-white dark:text-white">{option}</span>


            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  )
}

export default Select;
