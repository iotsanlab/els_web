import { useEffect, useState, useRef } from "react";
import { getDeviceAttributes } from "../../../services/telemetry";
import Weather from "./WeatherBox";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { SvgIcons } from "../../../assets/icons/SvgIcons";

import i18n from "../../../context/i18n";
import weatherConditionTranslations from "../../../data/Weather";
import { getUserId, getWeatherCities } from "../../../services/auth";

interface WeatherProps {
  title: string;
  der: string;
  desc: string;
  val1: string;
  val2: string;
  val3: string;
  imageType: "sun" | "sunCloud" | "rain";
}

const WeatherSwiper = () => {
  const [weatherData, setWeatherData] = useState<WeatherProps[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const swiperRef = useRef<any>(null);

  const fetchWeatherData = async () => {
    try {
     
      const UUID_ORDER = [
        "fa6d0f40-b622-11f0-a8a3-17916a2f6ce0",
      ];

      const userID = await getUserId();
      let weatherCities: string[] | null = await getWeatherCities(userID || "");

      // if weatherCities is null, set it to ["Antep", "Istanbul", "Izmir"]
      if (!weatherCities) {
        weatherCities = ["Antep", "Istanbul", "Izmir"];
      }
      

      const weatherApiData: any = await getDeviceAttributes(UUID_ORDER, weatherCities || []);



      // API yanıtı direkt olarak array dönüyor, .data'ya gerek yok
      const sortedData = weatherApiData
        ?.slice()
        .sort((a: any, b: any) => {
          // key property'sine göre sıralama (Antalya, Istanbul, Izmir)
          const orderMap: { [key: string]: number } = {
            Antalya: 0,
            Istanbul: 1,
            Izmir: 2,
          };
          return orderMap[a.key] - orderMap[b.key];
        });

      const newWeatherData = sortedData
        ?.filter((item: any) => item?.value?.current?.condition?.text)
        ?.map((item: any) => {
          const location = item.value.location;
          const currentWeather = item.value.current;

          const currentLanguage = i18n.language;

          const conditionText = currentWeather?.condition?.text || "";

          const conditionTranslation = weatherConditionTranslations.find(
            (condition) => condition.EN === conditionText
          );

          const getLanguage = (language: string): keyof typeof conditionTranslation => {
            if (language === "tr-TR") return "TR" as keyof typeof conditionTranslation;
            if (language === "en-US") return "EN" as keyof typeof conditionTranslation;
            return language.toUpperCase() as keyof typeof conditionTranslation;
          };

          const translatedDesc = conditionTranslation
          ? conditionTranslation[getLanguage(currentLanguage)]
          : conditionText;
          return {
            title: `${
              location?.name === "Antep"
                ? currentLanguage === "tr"
                  ? "Gaziantep"
                  : "Gaziantep"
                : location?.name === "Istanbul"
                ? currentLanguage === "tr"
                  ? "İstanbul"
                  : "Istanbul"
                : location?.name === "Izmir"
                ? currentLanguage === "tr"
                  ? "İzmir"
                  : "Izmir"
                : location?.name || "Unknown"
            }, ${
              currentLanguage === "tr"
                  ? "Türkiye"
                  : "Turkey"
            }`,
            der: `${currentWeather?.temp_c?.toFixed(0) ?? "--"}`,
            desc: translatedDesc || "Unknown",
            val1: `${currentWeather?.temp_c?.toFixed(1) ?? "--"}°C`,
            val2: `${currentWeather?.humidity ?? "--"}%`,
            val3: `${currentWeather?.wind_kph?.toFixed(1) ?? "--"} km/h`,
            imageType:
              conditionText === "Sunny" ||
              conditionText === "Clear"
                ? "sun"
                : conditionText === "Partly cloudy"
                ? "sunCloud"
                : "rain",
          };
        });

      setWeatherData(newWeatherData || []);
    } catch (error) {
      console.error("Hava durumu verisi çekilemedi:", error);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  useEffect(() => {
    fetchWeatherData();
  }, [i18n.language]);

  const incrementIndex = () => {
    swiperRef.current.swiper.slideNext();
    setCurrentIndex(swiperRef.current.swiper.realIndex);
  };

  const decrementIndex = () => {
    swiperRef.current.swiper.slidePrev();
    setCurrentIndex(swiperRef.current.swiper.realIndex);
  };

  return (
    <div className="bg-transparent w-full max-h-[240px] rounded-[10px] relative drop-shadow-[2px_2px_4px_#00000026]">
      <Swiper
        ref={swiperRef}
        spaceBetween={0}
        slidesPerView={1}
        modules={[Navigation, Pagination, Autoplay]}
        pagination={false}
        className="swiper-container bg-gray2 dark:bg-gray10 rounded-[10px]"
        onSlideChange={(swiper) => {
          setCurrentIndex(swiper.realIndex);
        }}
        initialSlide={currentIndex}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        loop={true}
      >
        {weatherData && weatherData.length > 0 ? (
          weatherData.map((weather, index) => (
            <SwiperSlide key={index}>
              <Weather
                title={weather.title}
                der={weather.der}
                desc={weather.desc}
                val1={weather.val1}
                val2={weather.val2}
                val3={weather.val3}
                imageType={weather.imageType}
              />
            </SwiperSlide>
          ))
        ) : (
          <SwiperSlide>
            <Weather
              title="Loading.."
              der="--"
              desc="Loading"
              val1="-"
              val2="-"
              val3="-"
              imageType="rain"
            />
          </SwiperSlide>
        )}
      </Swiper>

      <div className="absolute bottom-0 left-0 w-full h-[40px] z-10 flex items-center justify-between px-[25px]">
        <div
          onClick={decrementIndex}
          className="cursor-pointer"
          style={{ transform: "rotate(180deg)" }}
        >
          <SvgIcons
            iconName="RightArrow"
            fill="#B9C2CA"
            className="w-[20px] h-[20px]"
          />
        </div>

        <div className="flex space-x-2">
          {weatherData.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2)] ${
                index === currentIndex % weatherData.length
                  ? "bg-gray1"
                  : "bg-gray4"
              }`}
            />
          ))}
        </div>

        <div onClick={incrementIndex} className="cursor-pointer">
          <SvgIcons
            iconName="RightArrow"
            fill="#B9C2CA"
            className="w-[20px] h-[20px]"
          />
        </div>
      </div>
    </div>
  );
};

export default WeatherSwiper;