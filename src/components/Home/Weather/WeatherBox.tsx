import { SvgIcons } from "../../../assets/icons/SvgIcons";

interface Props {
  title: string;
  der: string;
  desc: string;
  val1: string;
  val2: string;
  val3: string;
  imageType: "rain" | "snow" | "sun" | "sunCloud"; 

}

import sun from "../../../assets/weather/sun.png";
import rain from "../../../assets/weather/rain.png";
import snow from "../../../assets/weather/snow.png";
import sunCloud from "../../../assets/weather/sunCloud.png";
import { useDarkMode } from "../../../context/DarkModeContext";



const Weather = ({ title, der, desc, val1, val2, val3, imageType }: Props) => {

  const getImageSrc = (type: string) => {
    switch (type) {
      case "rain":
        return rain;  
      case "snow":
        return snow; 
      case "sun":
        return sun;  
      case "sunCloud":
        return sunCloud;  
      default:
        return sun;  
    }
  };

  const {isDarkMode} = useDarkMode();

  return (
    <div className="w-[439px] h-[215px] bg-white dark:bg-gray10 rounded-[10px] shadow-[2px_2px_4px_0px_rgba(0,0,0,0.15)] flex flex-col justify-start items-start inline-flex overflow-hidden">
      <div className="flex items-center gap-2 mt-[20px] ml-[30px]">
			    <SvgIcons iconName="FilledMap"  className="" fill={isDarkMode ? "#B9C2CA" : "#424D57"}/>
          <div className="text-gray9 dark:text-gray4 text-[24px] font-bold font-jakarta">{title}</div>
        </div>
        
        <div className="flex items-between justify-start w-full mt-[10px]">
          <img src={getImageSrc(imageType)} alt="weather" className="object-contain w-[120px] h-[120px] mr-[10px]" />

          <div className="flex flex-col items-start justify-center w-[150px]" >
            <div className="text-gray9 dark:text-white text-[48px] font-bold font-jakarta capitalize leading-[60px]">{der}ºC</div>
            <div className="text-gray9 dark:text-white text-[14px] font-semibold font-jakarta capitalize">{desc}</div>
          </div>

          <div className="flex flex-col items-start justify-start gap-3.5 w-28 ml-[10px]">
            <div className="flex items-center gap-2">
              <SvgIcons iconName="Temperature" fill="#CBD1D7"  />
              <div className="text-gray3 text-[12px] font-semibold font-jakarta">{val1}</div>
            </div>
            <div className="flex items-center gap-2">
              <SvgIcons iconName="WaterDrop" fill="#CBD1D7"  />
              <div className="text-gray3 text-[12px] font-semibold font-jakarta">{val2}</div>
            </div>
            <div className="flex items-center gap-2">
              <SvgIcons iconName="Windy" fill="#CBD1D7"  />
              <div className="text-gray3 text-[12px] font-semibold font-jakarta">{val3}</div>
            </div>
          </div>

        </div>
    </div>
  );
};

export default Weather;
