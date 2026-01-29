

import serviceExc from "../../assets/service/serviceExc.png";
import serviceBackhoe from "../../assets/service/serviceBackhoe.png";
import serviceTele from "../../assets/service/serviceTele.png";
import serviceExcWhite from "../../assets/service/serviceExcWhite.png";
import serviceBackhoeWhite from "../../assets/service/serviceBackhoeWhite.png";
import serviceTeleWhite from "../../assets/service/serviceTeleWhite.png";
import { useTranslation } from 'react-i18next';

import { useDarkMode } from "../../context/DarkModeContext";


interface ServiceItemProps {
  id: number;
  name: string;
  region: string;
  city: string;
  address: string;
  lat: number;
  long: number;
  authorizedPerson: string;
  phone: string[];
  fax: string;
  email: string;
  service: string[]; // 'services' yerine 'service' oldu
}


const InfoBar = ({ title, desc }: { title: string, desc: string }) => {
  return (
    <div className="flex mb-[3px]">
      <p className="text-gray10 dark:text-white font-inter font-bold text-xs min-w-[130px]">{title}: </p>
      <p className="text-gray10 dark:text-white font-inter font-medium text-xs">{desc}</p>
    </div>
  );
};

const ServiceItem: React.FC<ServiceItemProps> = ({
  name,
  region,
  city,
  address,
  lat,
  long,
  authorizedPerson,
  phone,
  fax,
  email,
  service
}) => {
  const { isDarkMode } = useDarkMode();
  const {t} = useTranslation();

  
  const renderServiceImage = (service: string) => {
    switch (service) {
      case "Backhoe":
        return isDarkMode ? serviceBackhoeWhite : serviceBackhoe;
      case "Exc":
        return isDarkMode ? serviceExcWhite : serviceExc;
      case "Tele":
        return isDarkMode ? serviceTeleWhite : serviceTele;
      default:
        return serviceTele;
    }
  };

  console.log("burası ", service)


  return (
    <div className="flex w-full h-[200px] bg-white dark:bg-gray10 rounded-[10px] drop-shadow-[2px_2px_4px_#00000026] p-6 mb-4 items-center justify-between ">
      <div className="flex flex-col h-full w-full">

        <h3 className="text-gray10 dark:text-white font-inter font-bold text-base mb-[10px]">{name}</h3>

        <div className="flex w-full h-full items-center justify-between">
          <div className="flex flex-col">
            <InfoBar title={t("servicePage.card.area")} desc={region} />
            <InfoBar title={t("servicePage.card.city")} desc={city} />
            <InfoBar title={t("servicePage.card.address")} desc={address} />
            <InfoBar title={t("servicePage.card.phone")} desc={phone[0]} />
          </div>

          <div className="flex items-center dark:items-start gap-4 h-full">
          {service.map((service, index) => (
              <div key={index} className="w-[141px] h-[141px] flex flex-col items-center justify-start border-[1px] dark:border-[0px] border-gray2 rounded-[10px]">
                <img className="w-[120px] h-[120px] object-contain" src={renderServiceImage(service)} alt={service} />
                <p className="font-inter font-bold text-[12px] text-gray10 dark:text-white">{service == "Exc" ? "Ekskavatör" : (service == "Tele" ? "Telehandler" : "Kazıcı Yükleyici")}</p>
              </div>
            ))}


          </div>

        </div>
      </div>


    </div>
  );
};

interface ServiceListProps {
  services: ServiceItemProps[];
}

const ServiceList: React.FC<ServiceListProps> = ({ services }) => {
  return (
    <div className="w-full mb-[15px] h-[250px]">
      {services.map((service, index) => (
        <ServiceItem key={index} {...service} />
      ))}
    </div>
  );
};

export default ServiceList; 