import React, { useEffect, useState } from "react";
import { SvgIcons } from "../../assets/icons/SvgIcons";
import CustomSearch from "../CustomSearch";
import ProfileDropdown from "../ProfileDropdown";
import SwitchDarkMode from "../SwitchDarkMode";
import LanguageDropdown from "../LanguageDropdown";
import { useDarkMode } from "../../context/DarkModeContext";
import { useNavigate } from "react-router-dom";
import NotificationDropdown from "../NotificationDropdown";
import { NotificationData } from "../../data/NotificationData";
import Logo from "../../assets/images/logo.png";
import DarkLogo from "../../assets/images/logoDark.png";
import { useNotifications } from "./useNotif";
import InfoModal from "../HeaderModal/infoModal";

import testInfoPng from "../../assets/infoModal/test.png";
import testInfoPng2 from "../../assets/infoModal/test2.png";


const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileModal, setProfileModal] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);

  const slides = [
  {
    image: testInfoPng,
    text: 'Filtreleme yaparak makine tipi özelinde verilerinizi inceleyelin.'
  },
  {
    image: testInfoPng2,
    text: 'Parametreleri sürükle-bırak ile kolayca listeleyin.'
  },
];



  const { isDarkMode } = useDarkMode();

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const language = localStorage.getItem("language") || "tr"

  //const {t} = useTranslation();

  const {
    notifications,
    activeCount,
    isLoading,
    refetch
  } = useNotifications();

  useEffect(() => {
    console.log("burara notif drop ", JSON.stringify(notifications))
  }, [notifications]);



  return (
    <>
      <div className="bg-mstYellow dark:bg-mstYellow-dark w-full h-[60px] flex items-center min-w-[880px]">
        <div className="flex w-full h-[50px] justify-between items-center">
          {/* Logo */}
          <div className="w-full max-w-[200px] cursor-pointer pl-[16px]"
            onClick={() => navigate("./home")}
          >
            <img
              src={isDarkMode ? DarkLogo : Logo} // getMachineImage fonksiyonu ile cihaz türüne göre resim alınıyor
              alt={"MST"}
              className="object-contain w-full h-full"
            />
          </div>

          <div className="flex items-center gap-2 mr-[1.5rem]">
            {/* Arama Çubuğu */}
            <CustomSearch />

            <SwitchDarkMode />

            <LanguageDropdown />

            <NotificationDropdown
              notifications={notifications}
              activeNotificationCount={activeCount}
              isLoading={isLoading}
              onRefresh={refetch}
            />
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
              onClick={() => setInfoModalOpen(true)}

            >
              <div className="rounded-full ">
                <SvgIcons iconName="Info" fill="white" />
              </div>
            </div>

            <div
              id="profile-dropdown"
              className={`rounded-full rounded-br-0 ${profileModal ? "bg-white" : "bg-transparent"
                }`}
              onClick={() => setProfileModal(!profileModal)}
            >
              <ProfileDropdown
                isClicked={profileModal}
                onClickOutside={() => setProfileModal(false)}
              />
            </div>
          </div>
        </div>
      </div>

      <InfoModal
        isOpen={infoModalOpen}
        onClose={() => setInfoModalOpen(false)}
        slides={slides}
      />

      {/* Ortada Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50"
          onClick={toggleModal}
        >
          <div
            className="p-4 bg-white rounded-[10px] shadow-lg w-96"
            onClick={(e) => e.stopPropagation()} // Modal dışına tıklanınca kapanmasın diye
          >
            <div className="flex items-center justify-between">
              <h5 className="text-xl font-semibold">Bilgilendirme</h5>
              <button className="text-black" onClick={toggleModal}>
                &times;
              </button>
            </div>
            <div className="mt-4">
              <p>Bilgilendirme metni..</p>
            </div>
            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded-[10px]"
                onClick={toggleModal}
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
