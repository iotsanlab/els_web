import React from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import { Scrollbar } from 'swiper/modules';
import 'swiper/css/scrollbar';

interface CardProps {
    imageSrc?: string;
    id: number;
}

import deviceAttributes from "../../store/DeviceAttributes";

const useDeviceName = (id: number): string => {
    const deviceId = id.toString();
    const attributes = deviceAttributes.getAttributesById(deviceId);
    const deviceName = attributes?.find(attr => attr.key === "deviceName")?.value;

    return deviceName || 'Bilinmeyen Cihaz';
};

const Card: React.FC<CardProps> = ({ imageSrc, id }) => {
    const navigation = useNavigate();
    const deviceName = useDeviceName(id); // ID'den device name'i çek
    
    return (
        <div
            className={`min-w-[200px] h-[145px] bg-gray-100 dark:bg-gray9 rounded-[10px] mr-2 overflow-hidden flex flex-col items-center justify-between cursor-pointer hover:bg-gray-200 transition`}
            onClick={() => navigation(`/vehicle/${id}`, { state: { isVehiclePage: true } })}
        >

            <div className="w-full h-[110px] pt-2 bg-gray-100 dark:bg-gray9 flex items-center justify-center">
                {imageSrc ? (
                    <img className="object-contain w-full h-full" src={imageSrc} alt={deviceName || "Resim"} />
                ) : (
                    <span className="text-gray-400">Görsel Yok</span>
                )}
            </div>

            {/* Yazı Alanı */}
            <div className="w-full h-[40px] bg-gray-100 dark:bg-gray9 flex items-start pl-2 items-center">
                <span className="text-base font-bold leading-normal tracking-wide text-gray-900 dark:text-white">
                    {deviceName}
                </span>
            </div>
        </div>
    );
};

interface QuickTransProps {
    recentItems?: { imageSrc?: string; id: number }[]; 
    bookmarks?: { imageSrc?: string; id: number }[]; 
}

const QuickTrans: React.FC<QuickTransProps> = ({ recentItems = [], bookmarks = [] }) => {
    const { t } = useTranslation();

    return (
        <div className="h-[367px] flex flex-col items-start justify-start w-full pt-[20px] pl-2 bg-white dark:bg-gray10 rounded-[10px]">
            {/* Son Kullanılanlar */}
            <div className="flex w-[100%] overflow-x-auto mb-[10px]" >
                <div className="mr-2  flex h-[145px]">
                    <span className="[writing-mode:sideways-lr] font-inter text-gray10 dark:text-gray6 font-bold text-base leading-normal tracking-wide select-none">
                        {t("homePage.fifthWidget.recent")}
                    </span>
                </div>
                {recentItems.length > 0 ? (
                    <Swiper
                        slidesPerView="auto"
                        spaceBetween={8}
                        freeMode={true}
                        className="w-full select-none"
                        modules={[Scrollbar]}
                        scrollbar={{
                            hide: false,
                            draggable: true,
                            horizontalClass: 'swiper-scrollbar-horizontal',
                            el: '.swiper-scrollbar',
                        }}
                        style={{ paddingBottom: '20px' }}
                    >
                        <div className="swiper-scrollbar fel" style={{ left: '0px', bottom: '0px', height: '6px', width: '96%' }}></div>

                        {recentItems.map((item, index) => (
                            <SwiperSlide key={index} style={{ width: 'auto' }}>
                                <Card
                                    imageSrc={item.imageSrc}
                                    id={item.id}
                                />
                            </SwiperSlide>
                        ))}

                    </Swiper>
                ) : (
                    <p className="text-gray-500">Son kullanılan öğe yok.</p>
                )}
            </div>

            <div className="flex w-[100%] overflow-x-auto" >
                <div className="mr-2  flex h-[145px]">
                    <span className="[writing-mode:sideways-lr] font-inter text-gray10 dark:text-gray6 font-bold text-base leading-normal tracking-wide select-none">
                        {t("homePage.fifthWidget.bookmarks")}
                    </span>
                </div>
                {bookmarks.length > 0 ? (
                    <Swiper
                        slidesPerView="auto"
                        spaceBetween={8}
                        freeMode={true}
                        className="w-full select-none"
                        modules={[Scrollbar]}
                        scrollbar={{
                            hide: false,
                            draggable: true,
                            horizontalClass: 'swiper-scrollbar-horizontal',
                            el: '.swiper-scrollbar',
                        }}
                        style={{ paddingBottom: '20px' }}
                    >
                        <div className="swiper-scrollbar fel" style={{ left: '0px', bottom: '0px', height: '6px', width: '96%' }}></div>

                        {bookmarks.map((item, index) => (
                            <SwiperSlide key={index} style={{ width: 'auto' }}>
                                <Card
                                    imageSrc={item.imageSrc}
                                    id={item.id}
                                />
                            </SwiperSlide>
                        ))}

                    </Swiper>
                ) : (
                    <p className="text-gray-500">Yer işareti bulunamadı.</p>
                )}
            </div>
        </div>
    );
};

export default QuickTrans;