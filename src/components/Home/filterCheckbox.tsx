import React, { useState } from 'react';
import { SvgIcons } from '../../assets/icons/SvgIcons';
import { useDarkMode } from '../../context/DarkModeContext';


interface CheckboxGroupProps {
  options: string[];
  type2?: boolean;
  onChange?: (selected: string[]) => void;
  selectedOptions?: string[];
}

const FilterCheckbox: React.FC<CheckboxGroupProps> = ({ options, type2 = false, onChange, selectedOptions = [] }) => {
  const { isDarkMode } = useDarkMode();

  const [selected, setSelected] = useState<boolean[]>(
    options.map(option => selectedOptions.includes(option))
  );

  const handleCheckboxChange = (index: number) => {
    const newSelected = [...selected];
    newSelected[index] = !newSelected[index];
    setSelected(newSelected);
    if (onChange) {
      onChange(newSelected.map((selected, index) => selected ? options[index] : null).filter(Boolean) as string[]);
    }
  };

  // Hover durumu için her checkbox'a özel bir state
  const [hovered, setHovered] = useState<boolean[]>(new Array(options.length).fill(false));

  const handleMouseEnter = (index: number) => {
    const newHovered = [...hovered];
    newHovered[index] = true;
    setHovered(newHovered);
  };

  const handleMouseLeave = (index: number) => {
    const newHovered = [...hovered];
    newHovered[index] = false;
    setHovered(newHovered);
  };

  return (
    <div className="flex gap-4 dark:ml-0">
      {options.map((option, index) => (
        <div key={index} className={`items-start  border-0 dark:border-gray8 dark:rounded-[5px] dark:bg-gray10 form-control group select-none`}>
          <label
            className={`
              cursor-pointer items-center justify-start flex h-[32px]
              ${type2 === true && selected[index] ? "border-gray2 dark:border-gray8 border-[1px] group-hover:border-gray10" :
                "border-gray4 dark:border-gray8 border-[1px] group-hover:border-gray10"} 
              ${type2 === false ? "border-[0px]" : ""} 
              group-hover:bg-mstYellow group-hover:text-gray10 
              ${selected[index] ? 'bg-gray10' : 'bg-white dark:bg-gray10'} rounded-[5px]`}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={() => handleMouseLeave(index)}
          >
            <input
              type="checkbox"
              checked={selected[index]}
              onChange={() => handleCheckboxChange(index)}
              className="hidden"
            />



         
            <span className={`truncate
              mx-[10px] text-sm font-medium leading-normal tracking-wide ${selected[index] ? 'text-gray2 dark:text-gray8' : 'text-gray4 dark:text-gray8'} font-inter group-hover:text-gray10`}>
              {option}
            </span>

            <SvgIcons
              iconName={hovered[index] ? (selected[index] ? "CheckEmpt" : "CheckFill") : (selected[index] ? "CheckFill" : "CheckEmpt")}
              fill={hovered[index] ? "#28333E" : (isDarkMode ? "#5D6974" : selected[index] ? "#E5E8EB" : "#B9C2CA")}
              className='mr-[5px]'
            />
          </label>
        </div>
      ))}
    </div>
  );
};

export default FilterCheckbox;
