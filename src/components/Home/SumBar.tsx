
import { useTranslation } from 'react-i18next';

interface Props {
    value1: number;
    value2: number;
    value3: number;
    value4: number;
}

const Box = ({title, val, color } : {title: string, val: number, color:string}) => {
    const {t} = useTranslation();

    return(
    
        <div className="flex flex-col items-start justify-start bg-white min-w-24 dark:bg-gray10">
        <div className="flex justify-center items-center mb-[8px]">
            <div className={`h-[16px] w-[16px] 2xl:[16px] 2xl:[16px] xl:h-[16px] xl:w-[16px] ${color} mr-[10px] rounded`}></div>
            <h1 className="text-[14px] font-bold leading-[24px] tracking-wide text-center text-gray10 font-inter dark:text-white">{title}</h1>
        </div>
    
        <div>
            <span className="text-[32px] font-bold leading-[24px] tracking-wide text-center text-gray10 font-jakarta dark:text-white">{val} {val > 1 ? t("global.machines") : t("global.machine")}</span>
        </div>
    </div>
    )
};

const SumBar = ({value1 = 0, value2 = 0, value3 = 0, value4 = 0} : Props) => {
      const {t} = useTranslation();
    


    return (
        <div className="flex items-start justify-between w-full px-[40px] ">

            {/* Bakım Süresi Geçti */}

            <Box title={t("homePage.fourthWidget.label-1")} val={value1} color="bg-statusRed"/>
            <div className="bg-gray1 w-[3px] dark:bg-gray9 h-[64px] rounded"></div>
            <Box title={t("homePage.fourthWidget.label-2")} val={value2} color="bg-statusRed"/>
            <div className="bg-gray1 w-[3px] dark:bg-gray9 h-[64px] rounded"></div>
            <Box title={t("homePage.fourthWidget.label-3")} val={value3} color="bg-statusGreen"/>
            <div className="bg-gray1 w-[3px] dark:bg-gray9 h-[64px] rounded"></div>
            <Box title={t("homePage.fourthWidget.label-4")} val={value4} color="bg-statusGreen"/>



        </div>
    );
};

export default SumBar;
