import React from 'react';
import { SvgIcons } from '../../assets/icons/SvgIcons';

interface DashboardCardProps {
  items: DashboardItem[];
}

interface DashboardItem {
  icon: string;
  title: string;
  desc: string | number;
  isPercentage?: boolean;
  percentageValue?: number;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ items }) => {
  // Yüzde göstergesi için kutuları render eden yardımcı fonksiyon
  const renderPercentageBoxes = (percentage: number) => {
    const boxes = [];
    const filledBoxes = Math.floor(percentage / 20); // 100'ü 5'e böldük (her kutu %20'lik dilimi temsil eder)

    for (let i = 0; i < 5; i++) {
      boxes.push(
        <div
          key={i}
          className={`w-4 h-4 rounded border border-gray6 mr-1
            ${i < filledBoxes ? 'bg-blue1' : 'bg-white'}`}
        />
      );
    }
    return boxes;
  };

  return (
    <div className="w-full h-full  aspect-square bg-white p-6">

      {/* Info Barlar */}
      <div className="space-y-4">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <div className="flex items-center">


              {/* Content */}
              <div className="ml-4 flex items-center justify-center">
              <SvgIcons iconName={"ListArrow"} fill='#FF6F00' />

                <div className="text-blue1 font-bold font-outfit text-xs tracking-wide min-w-[150px] ml-4">{item.title}</div>
                {item.isPercentage ? (
                  <div className="flex items-center mt-1">
                    {renderPercentageBoxes(item.percentageValue || 0)}
                    <span className="ml-2 text-sm text-gray10">
                      {item.percentageValue}%
                    </span>
                  </div>
                ) : (
                  <div className="text-blue1 font-regular font-outfit text-xs tracking-wide ml-2">
                      : {item.desc}
                  </div>
                )}
              </div>
            </div>

            {index % 2 == 1 && (
              <div className="border-[0.3px] border-dashed border-blue3" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default DashboardCard;
