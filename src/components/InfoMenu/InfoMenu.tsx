import { useEffect, useState, useRef } from "react";
import { SvgIcons } from "../../assets/icons/SvgIcons";
import getMachineImage from "../GetImage";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toggleFavorite } from "../../services/favService";
import { getFavList, getUserId } from "../../services/auth";
import { submitOperatorInfo, submitDeviceName } from "../../services/telemetry";
import { NotificationData } from "../../data/NotificationData";

interface WarningCode {
  warning_name_2: string;
  warning_type: string;
  warning_code: string;
  warning_date: string;
  description: string;
  source: string;
}

interface Props {
  id?: number;
  serialNo: string;
  title: string;
  subtype: string;
  isTelehandlerV2: boolean;
  totalHours: string;
  deviceId?: string;
  operator: string;
  avgFuel: string;
  instantFuel: string;
  saseNo: string;
  type: string;
  warnings?: WarningCode[];
  className?: string;
  warningClassName?: string;
  onBackButtonClick?: () => void;
  test?: number;
  deviceName?: string;
  deviceWarnings?: {
    id: string;
    severity: string;
    message: string;
    dateTime: string;
    acknowledged: boolean;
    deviceId: string;
  }[];
}

const Title = ({ title }: { title: string }) => (
  <div className="items-start justify-center w-full">
    <h2 className="text-xl font-bold leading-normal tracking-wide text-gray4 font-arial">
      {title}
    </h2>
  </div>
);

const InfoBar = ({ title, desc }: { title: string; desc: string }) => (
  <div className="flex items-center justify-start w-full">
    <span className="text-gray10 dark:text-white font-arial font-bold text-xs leading-snug tracking-wide min-w-[100px]">
      {title}
    </span>
    <span className="text-xs font-bold leading-snug tracking-wide dark:text-white text-gray10 font-arial">
      {desc}
    </span>
  </div>
);

const InfoMenu = ({
  id,
  serialNo,
  isTelehandlerV2,
  title,
  subtype,
  totalHours,
  operator,
  avgFuel,
  instantFuel,
  saseNo,
  type,
  warnings,
  className,
  warningClassName,
  deviceName,
  deviceId,
  onBackButtonClick,
  deviceWarnings
}: Props) => {
  const navigation = useNavigate();
  const { t } = useTranslation();

  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const [deviceNameText, setDeviceNameText] = useState(deviceName || "");
  const [operatorText, setOperatorText] = useState(operator);

  const [isBookMarked, setIsBookMarked] = useState(false);
  const [userId, setUserId] = useState<string>("");

  const deviceNameInputRef = useRef<HTMLTextAreaElement>(null);
  const operatorInputRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDeviceNameText(deviceName || "");
    setOperatorText(operator);
  }, [deviceName, serialNo, operator]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isEditing || !containerRef.current) return;

      const target = event.target as Node;

      const clickedInside = containerRef.current.contains(target);
      const clickedInput =
        deviceNameInputRef.current?.contains(target) ||
        operatorInputRef.current?.contains(target);
      const clickedSaveButton = (target as HTMLElement).closest(
        "[data-edit-save]"
      );

      if (clickedInside && (clickedInput || clickedSaveButton)) {
        return;
      }

      // düzenleme iptal
      setDeviceNameText(deviceName || "");
      setOperatorText(operator);
      setIsEditing(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing, deviceName, operator]);

  useEffect(() => {
    if (isEditing) {
      deviceNameInputRef.current?.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    const fetchBookmarkStatus = async () => {
      const uid = await getUserId();
      if (!uid) return;

      const favList = await getFavList(uid);
      const isFav = favList?.some((item) => item.id === id?.toString());
      setIsBookMarked(isFav || false);
      setUserId(uid);
    };

    fetchBookmarkStatus();
  }, [id]);

  const handleToggleBookmark = async () => {
    if (!userId || !id) return;

    const machine = {
      id: id.toString(),
      type,
      model: deviceName,
      subtype,
      isTelehandlerV2,
    };

    console.log(machine, 'test');

    const success = await toggleFavorite(userId, machine);
    if (success) {
      setIsBookMarked((prev) => !prev);
    }
  };

  const handleBackButton = () => {
    if (warningClassName) {
      onBackButtonClick?.();
    } else {
      navigation("/Vehicles");
    }
  };

  const getStatusColor = (severity: string) => {
    const matched = NotificationData.find(item => String(item.id) === String(severity));
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



  return (
    <div
      ref={containerRef}
      className={`z-10 flex w-[400px] dark:bg-gray10 dark:border dark:border-gray9 dark:border-l-none ${className || "h-screen bg-gray1"
        }`}
    >
      <div
        className="flex flex-col justify-between cursor-pointer h-fit items-between hover:bg-gray2"
        onClick={handleBackButton}
      >
        <SvgIcons iconName="LeftArrow" fill="#CBD1D7" />
      </div>

      <div className="flex flex-col items-start w-full pr-4">
        <div className="flex items-center justify-between w-full">
          {isEditing ? (
            <textarea
              ref={deviceNameInputRef}
              className="p-0 px-[8px] text-xl font-bold leading-normal max-w-[240px] w-full tracking-wide border rounded-[10px] dark:border-gray1 border-gray10 bg-gray1 dark:bg-gray10 text-gray10 dark:text-white font-inter resize-none"
              value={deviceNameText}
              onChange={(e) => setDeviceNameText(e.target.value)}
              maxLength={40}
              rows={1}
            />
          ) : (
            <h1 className="text-xl font-bold leading-normal tracking-wide text-gray10 max-w-[240px] break-words dark:text-white font-inter">
              {deviceNameText}
            </h1>
          )}

          <div
            data-edit-save
            onClick={async () => {
              if (isEditing && id) {
                try {
                  await submitOperatorInfo(
                    "DEVICE",
                    id.toString(),
                    operatorText,
                    ""
                  );
                  await submitDeviceName(
                    "DEVICE",
                    id.toString(),
                    deviceNameText
                  );
                  window.location.reload();
                  // setDeviceNameText(deviceNameText);
                  // setOperatorText(operatorText);
                  // setIsEditing(false);
                } catch (error) {
                  console.error("Güncelleme hatası:", error);
                }
              } else {
                setIsEditing(true);
              }
            }}
          >
            {isEditing ? (
              <span className="cursor-pointer py-[4px] px-[6px] ml-[4px] bg-black dark:bg-white text-white dark:text-black font-medium rounded-[10px]">
                {t("global.save")}
              </span>
            ) : (
              <SvgIcons
                iconName="Pencil"
                className="ml-[12px] cursor-pointer"
                fill="#CBD1D7"
              />
            )}
          </div>
        </div>

        <h5 className="text-base font-medium leading-normal tracking-wide text-gray6 font-inter">
          {type} {title}
        </h5>

        <div className="relative flex items-center justify-center w-full h-32 mt-4 mb-4">
          <img
            src={getMachineImage(isTelehandlerV2 ? 'Telehandler_v2' : type, "sm", subtype)}
            alt={type}
            className="object-contain w-full h-full"
          />
          <div
            className="absolute top-0 right-0 cursor-pointer"
            onClick={handleToggleBookmark}
          >
            <SvgIcons
              iconName={isBookMarked ? "SelectedBookMark" : "BookMark"}
              className="ml-[12px] cursor-pointer"
              fill="#CBD1D7"
            />
          </div>
        </div>

        <Title title={t("machineInfoPage.infoCard.general")} />
        <InfoBar
          title={t("machineInfoPage.infoCard.totalHours")}
          desc={totalHours}
        />

        <div className="flex items-center justify-start w-full">
          <span className="text-gray10 dark:text-white font-arial font-bold text-xs leading-snug tracking-wide min-w-[100px]">
            {t("machineInfoPage.infoCard.operator")}:
          </span>
          {isEditing ? (
            <textarea
              ref={operatorInputRef}
              className="p-1 text-xs font-bold pl-[8px] leading-snug tracking-wide border rounded-[10px] dark:border-gray1 border-gray10 dark:text-white text-gray10 font-arial bg-gray1 dark:bg-gray10 resize-none max-w-[200px] w-full h-auto"
              value={operatorText}
              onChange={(e) => setOperatorText(e.target.value)}
              maxLength={30}
              rows={2}
            />
          ) : (
            <span className="text-xs font-bold leading-snug max-w-[200px] break-words tracking-wide dark:text-white text-gray10 font-arial">
              {operatorText}
            </span>
          )}
        </div>

        <InfoBar title={t("machineInfoPage.infoCard.chassis")} desc={saseNo} />

        <div style={{ height: 20 }} />

       {
        /*
         <Title title={t("machineInfoPage.infoCard.fuel")} />
        <InfoBar
          title={t("machineInfoPage.infoCard.averageFuel")}
          desc={avgFuel}
        />
        */
       }
       

        <div className={`${warningClassName ? "mt-0" : "mt-[50px]"}`}>
          <Title title={t("notificationsPage.notificationDropdown.notifications")} />
        </div>

        <div
        style={{ maxHeight: "400px" }}
          className={`bg-gray2 dark:bg-gray9 w-full rounded-[10px] mt-2 pl-4 pt-2 overflow-y-auto ${warningClassName || "min-h-[300px]"
            }`}
        >
          
          {deviceWarnings && deviceWarnings.length > 0 && (
            <div className="bg-gray2 dark:bg-gray9 w-full rounded-[10px] mt-4  pt-2">
             
              {deviceWarnings.filter((alarm) => alarm.acknowledged !== true).slice(0, 10).map((alarm) => (
                <div className="flex flex-col mb-2 cursor-pointer"  key={alarm.id} onClick={() => navigate(`/Notification?deviceId=${alarm.deviceId}`)}>
                  <span className="text-xs font-semibold text-gray10 dark:text-white">
                    {alarm.dateTime}
                  </span>
                  <div className="flex items-center">
                     <SvgIcons
                        iconName="Warning"
                        className="w-[24px]"
                        fill={`${getStatusColor(alarm?.details?.id)}`}
                      />
                      
                  <span className="ml-[10px] text-xs text-gray10 dark:text-white">
                    {alarm.message}
                  </span>
                  </div>
                
                </div>
              ))}

              {
                deviceWarnings.filter((alarm) => alarm.acknowledged !== true).length > 10 && (
                  <div className="flex items-center justify-center w-full mb-2 pr-3">
                    <button className="text-xs font-semibold bg-mstYellow w-full text-white" onClick={() => navigate(`/Notification?deviceId=${deviceWarnings[0].deviceId}`)}>
                      {t("notificationsPage.notificationDropdown.allNotifications")}
                    </button>
                  </div>
                )
              }
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default InfoMenu;
