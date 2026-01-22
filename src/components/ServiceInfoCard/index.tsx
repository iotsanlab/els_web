import { SvgIcons } from "../../assets/icons/SvgIcons";
import ServiceImage from "../../assets/images/serviceCardImage.png";
import logo from "../../assets/images/onlyMST.png";
import { useTranslation } from "react-i18next";

type ServiceInfoCardProps = {
  onBackButtonClick: () => void;
  className?: string;
  title: string;
  address: string;
  operatorName: string;
  phoneNumber: string;
  email: string;
  website?: string;
}

const ServiceInfoCard = ({ onBackButtonClick, className, title, address, operatorName, phoneNumber, email, website   }: ServiceInfoCardProps) => {

    const { t } = useTranslation();

  const handleBackButton = () => {
    onBackButtonClick?.();
  }


  return (
    <div className={`z-10 flex  col-span-2 overflow-none font-inter  dark:bg-gray10 dark:border dark:border-gray9 dark:border-l-none ${className ? className : 'h-screen bg-gray1'}  `} >
    <div
      className="flex flex-col justify-between cursor-pointer h-fit items-between hover:bg-gray2"
      onClick={handleBackButton}
    >
      <SvgIcons iconName="LeftArrow" fill="#CBD1D7" />
    </div>

    <div className="flex flex-col items-start w-full max-w-[260px]">
    <div className="flex flex-col w-full">

        <h1 className="text-2xl font-bold leading-normal tracking-wide text-left text-gray10 dark:text-white font-inter text-[24px]">{title}</h1> 
        <p className="text-base font-medium leading-normal tracking-wide text-left text-gray6 font-inter">{address}</p>

        <div className="w-full max-w-[230px]  py-[10px] my-[4px]">
        <img src={logo} alt="Service" className="w-full mt-[10px]" />
        </div>
        <div className="flex flex-col items-start justify-between w-full mt-[10px]">
            <h1 className="text-2xl font-bold leading-normal tracking-wide text-left text-gray4 font-inter text-[20px]">
                {t("mapPage.service.contact")}
            </h1> 

            <div className="flex items-start justify-start w-full mb-[5px]">
                <p className="text-base  leading-normal tracking-wide text-gray10 dark:text-white font-inter font-bold text-[12px]">{t("mapPage.service.authorized")}</p>
                <p className="text-base  leading-normal tracking-wide text-gray10 dark:text-white font-inter font-bold text-[12px]">:  {operatorName}</p>
            </div>

                

            <div className="flex items-start justify-start w-full mb-[5px]">
                <p className="text-base  leading-normal tracking-wide text-gray10 dark:text-white font-inter font-bold text-[12px]">{t("mapPage.service.phone")}</p>
                <p className="text-base  leading-normal tracking-wide text-gray10 dark:text-white font-inter font-bold text-[12px]">:  {phoneNumber}</p>
            </div>

            <div className="flex items-start justify-start w-full mb-[5px]">
                <p className="text-base  leading-normal tracking-wide text-gray10 dark:text-white font-inter font-bold text-[12px]">{t("mapPage.service.mail")}</p>
                <p className="text-base  leading-normal tracking-wide text-gray10 dark:text-white font-inter font-bold text-[12px]">:{email}</p>
            </div>


        </div>

    </div>
    </div>

    </div>
  )
};

export default ServiceInfoCard;

