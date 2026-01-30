import { useTranslation } from 'react-i18next';

interface Props {
    val1: string;
    val2: string;
}

const BatteryHealth = ({val1, val2} : Props) => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-6">
      {/* İlk div: Yuvarlak görünümde ve içinde 3 text */}
      <div className="bg-blue3 w-[300px] h-[300px] rounded-full flex flex-col items-center justify-center mx-auto">
      
      <p className="text-blue1 font-outfit font-medium text-xl leading-normal">{t("batteryHealthPage.currentSOC")}</p>
        <p className="text-blue1 font-outfit font-medium text-4xl leading-normal">{val1}</p>
      </div>

      {/* İkinci div: Normal yazı düzeni */}
      <div className="bg-gray-300 p-6 rounded-md">
        <p className="text-blue1 font-outfit font-regular text-xl leading-normal">{t("batteryHealthPage.overallBatteryHealth")} : %{val2}</p>
      </div>
    </div>
  );
};

export default BatteryHealth;
