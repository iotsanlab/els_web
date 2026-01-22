import React, { useState, useEffect } from 'react';
import { SvgIcons } from '../../assets/icons/SvgIcons';
import { useDarkMode } from '../../context/DarkModeContext';

interface CheckboxGroupProps {
  options: string[];
  type2?: boolean;
  onChange?: (selected: string[]) => void;
  selectedOptions?: string[];
  readOnly?: boolean; // Yeni prop
}

const GenderComp: React.FC<CheckboxGroupProps> = ({ 
  options, 
  type2 = false, 
  onChange, 
  selectedOptions = [],
  readOnly = false 
}) => {
  const { isDarkMode } = useDarkMode();

  const [selected, setSelected] = useState<boolean[]>(
    options.map(option => selectedOptions.includes(option))
  );

  // selectedOptions değiştiğinde selected state'ini güncelle
  useEffect(() => {
    setSelected(options.map(option => selectedOptions.includes(option)));
  }, [selectedOptions, options]);

  const handleCheckboxChange = (index: number) => {
    if (readOnly) return; // ReadOnly modundaysa işlem yapma
    
    // Gender için tek seçim mantığı - diğer tüm seçimleri kaldır
    const newSelected = new Array(options.length).fill(false);
    newSelected[index] = true; // Sadece tıklanan seçeneği aktif yap
    
    setSelected(newSelected);
    
    if (onChange) {
      onChange([options[index]]); // Sadece seçilen option'ı gönder
    }
  };

  // Hover durumu için her checkbox'a özel bir state
  const [hovered, setHovered] = useState<boolean[]>(new Array(options.length).fill(false));

  const handleMouseEnter = (index: number) => {
    if (readOnly) return; // ReadOnly modundaysa hover efekti yok
    
    const newHovered = [...hovered];
    newHovered[index] = true;
    setHovered(newHovered);
  };

  const handleMouseLeave = (index: number) => {
    if (readOnly) return;
    
    const newHovered = [...hovered];
    newHovered[index] = false;
    setHovered(newHovered);
  };

  return (
    <div className="flex gap-4 dark:ml-0 mb-[20px]">
      {options.map((option, index) => (
        <div key={index} className={`items-start border-0 dark:border-gray8 dark:rounded-[10px] dark:bg-gray10 form-control group`}>
          <label
            className={`
              ${readOnly ? 'cursor-default' : 'cursor-pointer'} items-center justify-start flex h-[32px]
              ${type2 === true && selected[index] ? "border-gray2 dark:border-gray8 border-[0px] group-hover:border-gray10" :
                "border-gray4 dark:border-gray8 border-[0px] group-hover:border-gray10"} 
              ${type2 === false ? "border-[0px]" : ""} 
              ${!readOnly ? 'group-hover:bg-mstYellow group-hover:text-gray10' : ''}
              ${selected[index] ? 'bg-transparent' : 'bg-white dark:bg-gray10'} rounded-[10px]
              ${readOnly ? 'opacity-70' : ''}
            `}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={() => handleMouseLeave(index)}
          >
            <input
              type="checkbox"
              checked={selected[index]}
              onChange={() => handleCheckboxChange(index)}
              className="hidden"
              disabled={readOnly}
            />

            <SvgIcons
              iconName={hovered[index] ? (selected[index] ? "CheckEmpt" : "CheckFill") : (selected[index] ? "CheckFill" : "CheckEmpt")}
              fill={
                readOnly 
                  ? (isDarkMode ? "#5D6974" : "#B9C2CA") // ReadOnly rengi
                  : hovered[index] 
                    ? "#28333E" 
                    : (isDarkMode ? "#5D6974" : selected[index] ? "#B9C2CA" : "#B9C2CA")
              }
              className={!readOnly ? 'group-hover:ml-[5px]' : ''}
            />
         
            <span className={`truncate
              mx-[5px] text-sm font-medium leading-normal tracking-wide 
              ${selected[index] ? 'text-gray4 dark:text-gray8' : 'text-gray4 dark:text-gray8'} 
              font-inter ${!readOnly ? 'group-hover:text-gray10' : ''}
            `}>
              {option}
            </span>
          </label>
        </div>
      ))}
    </div>
  );
};

export default GenderComp;