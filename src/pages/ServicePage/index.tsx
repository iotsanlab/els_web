import { useEffect, useState } from "react";
import { SvgIcons } from "../../assets/icons/SvgIcons";
import GeneralTitle from "../../components/Title/GeneralTitle";
import Select from "../../components/Select";
import ServiceList from "../../components/ServiceList";
import { useDarkMode } from "../../context/DarkModeContext";
import ServiceData from "../../data/ServiceData";
import GoogleMapsService from "../../components/GoogleMapsServices";
import { useTranslation } from 'react-i18next';
import { ServiceLocation } from "../../components/GoogleMapsServices/type";


interface ServiceCardProps {
  type: string;
  title: string;
  isSelected: boolean;
  onSelect: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ type, title, isSelected, onSelect }) => {
  const { isDarkMode } = useDarkMode();
  return (
    <div
      className={`w-[500px] h-[250px] rounded-[10px] drop-shadow-[2px_2px_4px_#00000026] flex flex-col items-center justify-center cursor-pointer transition-all duration-300 mb-[15px]
        ${isSelected ? "bg-gray4 dark:bg-gray7 " : "bg-white dark:bg-gray10 hover:bg-gray2"}`}
      onClick={onSelect}>
      <SvgIcons
        iconName={`Service${type}`}
        fill={isDarkMode ? "#FFF" : (isSelected ? "#FFFFFF" : "#28333E")}
      />
      <p className={`text-3xl font-medium mt-4 ${isSelected ? "text-white dark:text-white" : "text-gray10 dark:text-white"}`}>
        {title}
      </p>
    </div>
  );
};

const ServicePage = () => {
  const [selectedType, setSelectedType] = useState<string>("type1");
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<ServiceLocation[]>([]);
  const [filteredServiceLocations, setFilteredServiceLocations] = useState<ServiceLocation[]>([]);
  const { t, i18n } = useTranslation();


  const serviceData = ServiceData[0];

  const isAllSelected = (val: string) => !val || val === "Hepsi";

  const filteredServices = selectedType === "type1"
    ? serviceData.localServices.filter(service =>
      (isAllSelected(selectedRegion) || service.region === selectedRegion) &&
      (isAllSelected(selectedCity) || service.city === selectedCity)
    )
    : serviceData.abroadServices.filter(service =>
      isAllSelected(selectedRegion) || service.region === selectedRegion
    );

  useEffect(() => {
    setSelectedRegion("");
    setSelectedCity("");
  }, [selectedType]);

  useEffect(() => {
    setSelectedCity("");
  }, [selectedRegion]);

  useEffect(() => {
    if (selectedType == "type2") {
      const serviceLocations = ServiceData[0].abroadServices.map((service) => ({
        id: service.id,
        name: service.name,
        region: service.country,
        latitude: parseFloat(service.lat),
        longitude: parseFloat(service.long),
        web: service.web,
        phone: service.phone,
        address: service.address,
        country: service.country,
        mail: service.mail
      }));

      setSelectedCountry(serviceLocations as ServiceLocation[]);
      setFilteredServiceLocations(serviceLocations as ServiceLocation[]);
    }

  }, [selectedType]);

  useEffect(() => {
    if (selectedType == "type2") {
      // Çeviriden bağımsız olarak doğrudan region değerlerini kullanarak filtreleme
      const regionMapping: Record<string, string> = {
        [t("global.region.africa")]: "Fransa",
        [t("global.region.southAmerica")]: "Polanya",
        [t("global.region.cis")]: "Çek Cumhuriyeti",
        [t("global.region.asia")]: "Almanya",
        [t("global.region.middleEast")]: "İsviçre",
        [t("global.region.europe")]: "İspanya",
        [t("global.region.europe")]: "İngiltere",
      };

      if (isAllSelected(selectedRegion)) {
        setFilteredServiceLocations(selectedCountry);
      } else {
        const actualRegion = regionMapping[selectedRegion] || selectedRegion;
        setFilteredServiceLocations(selectedCountry.filter((service) => service.region === actualRegion));
      }
    }
  }, [selectedRegion, t]);

  const getRegionOptions = () => {
    if (selectedType === "type1") {
      return [
        "Hepsi",
        "Ankara",
        "Antalya",
        "Bursa",
        "İstanbul",
        "Gaziantep",
        "İzmir",
        "Muğla",
      ];
    } else {
      return [
        "Hepsi",
        "Fransa",
        "Polonya",
        "Çek Cumhuriyeti",
        "Almanya",
        "İsviçre",
        "İspanya",
        "İngiltere"
      ];
    }
  };

  type CityState = string[];

  function getCityListByRegion(region: string): CityState {
    const cities: Set<string> = new Set();

    // Verileri tarıyoruz
    for (const serviceData of ServiceData) {
      for (const service of serviceData.localServices) {
        if (service.region === region) {
          cities.add(service.city);
        }
      }
    }

    // Set'i array'e çeviriyoruz ve döndürüyoruz
    return Array.from(cities);
  }

  // Switch-case kullanarak bölgeye göre şehir listesini alalım
  function getCities(region: string): CityState {
    switch (region) {
      case "Adana":
        return getCityListByRegion("Adana");
      case "İstanbul":
        return getCityListByRegion("İstanbul");
      case "Gaziantep":
        return getCityListByRegion("Gaziantep");
      case "Ankara":
        return getCityListByRegion("Ankara");
      case "İzmir":
        return getCityListByRegion("İzmir");
      case "Trabzon":
        return getCityListByRegion("Trabzon");
      case "Samsun":
        return getCityListByRegion("Samsun");
      case "Kayseri":
        return getCityListByRegion("Kayseri");
      default:
        return [];
    }
  }

  return (
    <div className=" w-full flex h-full bg-gray2 dark:bg-darkBgColor justify-center  min-w-[1020px]">
      <div className="flex flex-col bg-gray2 dark:bg-darkBgColor items-start justify-start w-[1020px]">

        <GeneralTitle title={t("servicePage.title")} />

        <div className="flex items-start justify-start">
          <ServiceCard
            type="1"
            title={t("servicePage.in")}
            isSelected={selectedType === "type1"}
            onSelect={() => setSelectedType("type1")}
          />
          <div className="w-[20px]"></div>
          <ServiceCard
            type="2"
            title={t("servicePage.out")}
            isSelected={selectedType === "type2"}
            onSelect={() => setSelectedType("type2")}
          />
        </div>


        <div className="flex w-full items-center justify-start mb-[15px]">
          <div className="w-[500px]">
            <GeneralTitle title={
              selectedType == "type1" ? t("servicePage.cityFilter") : t("servicePage.regionFilter")
            } />
            <Select
              options={getRegionOptions()}
              value={selectedRegion}
              onChange={setSelectedRegion}
            />
          </div>
          <div className="w-[20px]"></div>


        </div>

        <div className="w-[1020px]">

          {selectedType == "type1" ?
            <ServiceList services={filteredServices} />
            : <GoogleMapsService serviceLocations={filteredServiceLocations} />}


        </div>
      </div>
    </div>
  );
};

export default ServicePage;
