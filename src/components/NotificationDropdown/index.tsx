
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { SvgIcons } from "../../assets/icons/SvgIcons";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../../context/DarkModeContext";
import serviceExc from "../../assets/service/serviceExc.png";
import serviceBackhoe from "../../assets/service/serviceBackhoe.png";
import serviceTele from "../../assets/service/serviceTele.png";
import serviceExcWhite from "../../assets/service/serviceExcWhite.png";
import serviceBackhoeWhite from "../../assets/service/serviceBackhoeWhite.png";
import serviceTeleWhite from "../../assets/service/serviceTeleWhite.png";
import { Trans } from "react-i18next";
import { useTranslation } from "react-i18next";
import React, { useEffect } from "react";
import { NotificationData } from "../../data/NotificationData";
import i18n from "../../context/i18n";
import deviceAttributes from "../../store/DeviceAttributes";
import { ackKnowledgeAlarm } from "../../services/alarms";


interface NotificationItemProps {
  vehicleId: string;
  deviceId: string;
  message: string;
  type: string;
  service: string;
  typeId: string;
}

interface NotificationDropdownProps {
  notifications: NotificationItemProps[];
  activeNotificationCount?: number; // Yeni prop - aktif uyarı sayısı
  isLoading?: boolean; // Loading state
  onRefresh?: () => void; // Yenileme fonksiyonu
}

const getNotificationMessage = (alarmId: number | string, lang: string): string => {
  const matched = NotificationData.find(item => String(item.id) === String(alarmId));
  if (!matched) return lang === "en" ? "Unknown notification" : "Bilinmeyen bildirim";
  return lang === "en" ? matched.name_en : matched.name_tr;
};

const NotificationItem: React.FC<NotificationItemProps> = React.forwardRef(
  ({ vehicleId, message, type, service, deviceId, typeId }, ref) => {
    const { isDarkMode } = useDarkMode();

    const renderServiceImage = (service: string) => {
      switch (service) {
        case "Backhoeloader":
          return isDarkMode ? serviceBackhoeWhite : serviceBackhoe;
        case "Excavator":
          return isDarkMode ? serviceExcWhite : serviceExc;
        case "Telehandler":
          return isDarkMode ? serviceTeleWhite : serviceTele;
        default:
          return serviceTele;
      }
    };

    const getStatusColor = () => {
      const matched = NotificationData.find(item => String(item.id) === String(typeId));
      switch (matched?.severity) {
        case "CRITICAL":
          return "#FF0000";
        case "MAJOR":
          return "#FF0000";
        case "MINOR":
          return "#FFA500";
        case "WARNING":
          return "#FFA500";
        default:
          return "#0000FF";
      }
    };

    const { t } = useTranslation();
    const navigation = useNavigate();

    return (
      <div
        onClick={() => navigation("/vehicle/" + deviceId)}
        className="flex items-center justify-between p-[10px] border-b border-gray-200 dark:border-gray8 hover:bg-gray-50 dark:hover:bg-gray8 transition-colors cursor-pointer">
        <div className="flex items-center">
              {/* <div className="mr-4">
            <img
                src={renderServiceImage(service)}
                alt="Service"
                className="w-[55px] h-auto"
              />
            </div> */}
          <div className="w-full max-w-[300px]">
            <p className="text-gray10 text-[14px] font-medium dark:text-white">
              <Trans
                i18nKey="notificationsPage.notificationDropdown.title"
                components={{
                  1: <strong />,
                  2: <span />,
                }}
                values={{
                  machineName: `${vehicleId}`,
                  message: `${t("global.vehicNum")} ${message}`,


                }}
              />
            </p>
          </div>
        </div>
        <div>
          <SvgIcons
            iconName="Warning"
            className="w-[24px]"
            fill={`${getStatusColor()}`}
          />
        </div>
      </div>
    );
  }
);

export default function NotificationDropdown({
  notifications,
  activeNotificationCount = 0,
  isLoading = false,
  onRefresh,
}: NotificationDropdownProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isDarkMode } = useDarkMode();




  // Badge gösterilecek mi kontrol et
  const showBadge = activeNotificationCount > 0;

  return (
    <Menu as="div" className="relative inline-block text-left">
      {({ open }) => (
        <>
          <MenuButton
            className={`p-0 bg-transparent border-none rounded-none focus:outline-none relative ${open
              ? "dark:bg-gray9 bg-white rounded-t-[10px] rounded-b-none"
              : ""
              }`}
          >
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar relative"
            >
              <div className="rounded-full">
                <SvgIcons
                  iconName="Notification"
                  fill={isDarkMode ? "white" : open ? "#28333E" : "white"}
                />
              </div>

              {/* Notification Badge */}
              {showBadge && (
                <div className="absolute -top-1 -right-1 min-w-[20px] h-[20px] bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {activeNotificationCount > 99 ? "99+" : activeNotificationCount}
                </div>
              )}
            </div>
          </MenuButton>

          <MenuItems
            transition
            className="absolute font-inter right-0 z-10 w-full min-w-[300px] max-w-[400px] rounded-s-lg rounded-tl-lg origin-top-right divide-y divide-gray-100 dark:divide-gray8 bg-white dark:bg-gray9 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-[10px] ">
              
              <div className="flex items-center w-full">
              <div
              className="p-[10px] border-none bg-mstYellow  rounded-lg cursor-pointer hover:bg-gray-400 dark:hover:bg-gray8 transition-colors w-full flex items-center justify-center"
              onClick={() => navigate("./Notification")}
            >
              <MenuItem>
                <p className="p-0 text-[14px]  text-center font-bold text-white leading-tight">
                  {t("notificationsPage.notificationDropdown.allNotifications")}
                </p>
              </MenuItem>
            </div>
              </div>
            </div>

            {/* Notifications List */}
            <div className="py-1 max-h-[300px] overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center p-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400"></div>
                  <span className="ml-2 text-sm text-gray-500">Yükleniyor...</span>
                </div>
              ) : notifications.length > 0 ? (
                notifications.map((notification, index) => {
                  const lang = i18n.language;
                  const desc = getNotificationMessage(notification?.details?.id, lang);

                  const deviceId = notification?.originator?.id;
                  const attributes = deviceAttributes.getAttributesById(deviceId);
                  const deviceName = attributes?.find(attr => attr.key === "deviceName")?.value;

                  return (
                    <MenuItem key={index} onClick={() => navigate("./Notification")}>
                      <NotificationItem
                        vehicleId={deviceName}
                        message={desc}
                        type={notification?.severity}
                        service={notification?.details?.Type}
                        deviceId={notification?.originator?.id}
                        typeId={notification?.details?.id}
                      />
                    </MenuItem>
                  );
                })
              ) : (
                <div className="flex items-center justify-center p-4">
                  <p className="text-sm text-gray-500">
                    {t("notificationsPage.notificationDropdown.noNotifications", "Bildirim bulunmamaktadır")}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            
          </MenuItems>
        </>
      )}
    </Menu>
  );
}