import { useTranslation } from 'react-i18next';

interface Props {
  val1: string;
  val2: string;
}

const BatteryHealth = ({ val1, val2 }: Props) => {
  const { t } = useTranslation();

  return (
    <div className="w-full h-full bg-white dark:bg-gray10 border border-gray2 dark:border-gray9 rounded-xl p-6 flex flex-col justify-between">
      <h2 className="text-gray8 dark:text-white text-sm font-outfit font-bold mb-4">{t("batteryHealthPage.overallBatteryHealth")}</h2>
      <div className="flex-1 flex flex-col items-center justify-center space-y-6">
        {/* İlk div: Yuvarlak görünümde ve içinde 3 text */}
        <div className="bg-blue3 dark:bg-gray9 w-[220px] h-[220px] rounded-full flex flex-col items-center justify-center mx-auto border border-blue1 dark:border-gray7">
          <p className="text-blue1 dark:text-gray3 font-outfit font-medium text-lg leading-normal">{t("batteryHealthPage.currentSOC")}</p>
          <p className="text-blue1 dark:text-white font-outfit font-bold text-4xl leading-normal">{val1}%</p>
        </div>

        {/* İkinci div: Normal yazı düzeni */}
        <div className="bg-gray1 dark:bg-gray9 p-4 rounded-lg w-full text-center border border-gray2 dark:border-gray7">
          <p className="text-blue1 dark:text-white font-outfit font-medium text-lg leading-normal">
            {t("batteryHealthPage.overallBatteryHealth")} : %{val2}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BatteryHealth;
