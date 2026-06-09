import React from 'react';
import { SvgIcons } from '../../assets/icons/SvgIcons';
import { useDarkMode } from '../../context/DarkModeContext';

interface DashboardCardProps {
  title?: string;
  items: DashboardItem[];
}

interface DashboardItem {
  title: string;
  desc: string | number;
  isPercentage?: boolean;
  percentageValue?: number;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, items }) => {
  const { isDarkMode } = useDarkMode();

  // Yüzde göstergesi için kutuları render eden yardımcı fonksiyon
  const renderPercentageBoxes = (percentage: number) => {
    const boxes = [];
    const filledBoxes = Math.floor(percentage / 20); // 100'ü 5'e böldük (her kutu %20'lik dilimi temsil eder)

    for (let i = 0; i < 5; i++) {
      boxes.push(
        <div
          key={i}
          className={`w-4 h-4 rounded border mr-1
            ${i < filledBoxes
              ? ('bg-mstYellow border-mstYellow')
              : 'bg-white dark:bg-gray9 border-gray6 dark:border-gray7'}`}
        />
      );
    }
    return boxes;
  };

  return (
    <div className="w-full h-full bg-white dark:bg-gray10 border border-gray2 dark:border-gray9 rounded-xl p-6 flex flex-col justify-between">
      {title && (
        <h2 className="text-gray8 dark:text-white text-sm font-outfit font-bold mb-4">{title}</h2>
      )}

      {/* Info Barlar */}
      <div className="space-y-4 flex-1 flex flex-col justify-center">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <div className="flex items-center py-1">
              {/* Content */}
              <div className="flex items-center w-full">
                <SvgIcons iconName={"ListArrow"} fill='#FF6F00' className="w-4 h-4 flex-shrink-0" />

                <div className="text-blue1 dark:text-gray3 font-bold font-outfit text-xs tracking-wide min-w-[150px] ml-4">{item.title}</div>
                {item.isPercentage ? (
                  <div className="flex items-center mt-1">
                    {renderPercentageBoxes(item.percentageValue || 0)}
                    <span className="ml-2 text-sm text-gray10 dark:text-white">
                      {item.percentageValue}%
                    </span>
                  </div>
                ) : (
                  <div className="text-blue1 dark:text-white font-regular font-outfit text-xs tracking-wide ml-2">
                    : {item.desc}
                  </div>
                )}
              </div>
            </div>

            {index % 2 === 1 && index < items.length - 1 && (
              <div className="border-[0.3px] border-dashed border-blue3 dark:border-gray9 my-2" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default DashboardCard;
