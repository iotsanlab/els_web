import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { useEffect, useState } from "react";
import i18next from "i18next";
import { useTranslation } from "react-i18next";

import mstLoginLogo from "../../assets/images/logo.png";
import mstLogin from "../../assets/images/mstLogin.png";
import { SvgIcons } from "../../assets/icons/SvgIcons";
import langStore from "../../store/LangStore";
import { resetPasswordByEmail } from "../../services/auth";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ForgotPassModal = ({ isOpen, onClose }: Props) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"success" | "error" | null>(null);
  const [iconName, setIconName] = useState<"WhiteTick" | "WhiteCross" | null>(
    null
  );
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [failCount, setFailCount] = useState(0);

  const showAlert = (
    message: string,
    type: "success" | "error",
    icon: "WhiteCross" | "WhiteTick"
  ) => {
    setAlertMessage(message);
    setAlertType(type);
    setIconName(icon);
    setTimeout(() => {
      setAlertMessage(null);
      if (type === "success") {
        setAlertMessage(null);
        setAlertType(null);
        setIconName(null);
        onClose();
      } else {
        setAlertType(null);
      }
    }, 2000);
  };

  const handleReset = async () => {
    const isEmail = (str: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
    if (isEmail(email)) {
      const success = await resetPasswordByEmail(email);
      if (success) {
        showAlert(t("forgotPassModal.success"), "success", "WhiteTick");
        setShowSuccessScreen(true);
      } else {
        setFailCount((prev) => prev + 1);
        if (failCount >= 3) {
          showAlert(t("forgotPassModal.failThree"), "error", "WhiteCross");
        } else {
          showAlert(t("forgotPassModal.fail"), "error", "WhiteCross");
        }
      }
    } else {
      showAlert(t("forgotPassModal.invalidEmail"), "error", "WhiteCross");
    }
  };

  const typeArray = ["TR", "EN"];
  const [selectedType, setSelectedType] = useState<string>(() =>
    i18next.language.toUpperCase()
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSelectType = (type: string) => {
    const langCode = type.toLowerCase();
    setSelectedType(type);
    i18next.changeLanguage(langCode);
    localStorage.setItem("language", langCode);
    langStore.setLang(langCode);
    setDropdownOpen(false);
  };

  useEffect(() => {
    const currentLang = i18next.language.toUpperCase();
    setSelectedType(currentLang);
  }, [i18next.language]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black transition-opacity"
        style={{
        //  backgroundImage: `url(${mstLogin})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 1,
        }}
      />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto ">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-[10px] bg-mstYellow shadow-xl transition-all items-center justify-center"
            style={{
              maxWidth: "569px",
              maxHeight: "750px",
              width: "100%",
              height: "750px",
            }}
          >
            <div className="w-full h-full items-center justify-center pt-[15%]">
              <img
                alt="Your Company"
                src={mstLoginLogo}
                className="mx-auto h-24 w-auto"
              />

              {alertType ? (
                <>
                  <div className="pt-[100px] flex flex-col items-center justify-center">
                    <span className="font-inter font-medium text-[16px] text-white max-w-[400px] mb-[20px]">
                      {alertMessage}
                    </span>
                    <SvgIcons iconName={iconName} />
                    {/* <span className="font-inter font-medium text-[16px] text-white max-w-[400px] mt-[20px]">
                      Lütfen mail adresinize gelen bağlantıya tıklayarak devam
                      edin
                    </span> */}
                  </div>
                </>
              ) : (
                <>
                  <p className="text-white font-inter font-bold text-3xl pt-[5%]">
                    {t("forgotPassModal.title")}
                  </p>

                  <div className="space-y-6 mt-4 px-[20%]">
                    <div className="">
                      <label
                        htmlFor="email"
                        className="text-[13px] font-medium text-white text-left self-start w-full"
                      >
                        {t("forgotPassModal.emailLabel")}
                      </label>
                      <div className="mt-2 flex items-center border-b-2">
                        <SvgIcons iconName="Message" fill="white" />
                        <input
                          placeholder={t("forgotPassModal.emailPlaceholder")}
                          id="email"
                          name="email"
                          type="email"
                          required
                          autoComplete="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-mstYellow w-full pr-3 pl-2 py-1.5 text-base text-white placeholder:text-white focus:outline-none focus:ring-0 focus:border-mstYellow sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center px-[19%] mr-[1%] mt-24">
                    <div className="cursor-pointer" onClick={onClose}>
                      <SvgIcons iconName="LeftArrow" fill="#111" />
                    </div>

                    <button
                      className="flex items-center bg-black w-full justify-center ml-2"
                      onClick={handleReset}
                    >
                      <h1 className="bg-transparent text-base font-bold font-sans text-white mr-2 inline-block">
                        {t("forgotPassModal.send")}
                      </h1>
                    </button>
                  </div>

                  <div className="flex items-center self-center justify-center mt-4">
                    <div className="flex relative">
                      <button
                        className="flex bg-transparent items-center"
                        onClick={toggleDropdown}
                      >
                        <SvgIcons iconName="Language" fill="black" />
                        <h1 className="bg-transparent text-base font-bold font-sans text-white mr-2 inline-block">
                          {selectedType}
                        </h1>
                        <SvgIcons iconName="DownArrow" fill="#FFF" />
                      </button>

                      {dropdownOpen && (
                        <div
                          className="absolute z-10 mt-14 w-40 bg-white rounded-[10px] shadow-lg dark:bg-gray-700"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                            {typeArray.map((type, index) => (
                              <li key={index}>
                                <a
                                  href="#"
                                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                  onClick={() => handleSelectType(type)}
                                >
                                  {type}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default ForgotPassModal;
