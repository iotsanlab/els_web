import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { useEffect, useState } from "react";
import i18next from "i18next";
import { useTranslation } from "react-i18next";

import mstLoginLogo from "../../assets/images/mstLoginLogo.png";
import mstLogin from "../../assets/images/mstLogin.png";
import { SvgIcons } from "../../assets/icons/SvgIcons";
import langStore from "../../store/LangStore";
import { resetPassword } from "../../services/auth";
import { useNavigate } from "react-router-dom";

interface Props {
  isOpen: boolean;
  token: string;
  onClose: () => void;
}

const ResetPasswordModal = ({ isOpen = true, onClose, token }: Props) => {
  const { t } = useTranslation();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"success" | "error" | null>(null);

  const navigate = useNavigate();

  const showAlert = (message: string, type: "success" | "error") => {
    setAlertMessage(message);
    setAlertType(type);
    setTimeout(() => {
      setAlertMessage(null);
      if (type === "success") {
        onClose();
      }
    }, 2000);
  };

  const handleResetPassword = async () => {
    // Şifre validasyonları
    if (newPassword.length < 6) {
      showAlert(
        t("resetPassModal.passwordTooShort") ||
          "Şifre en az 6 karakter olmalıdır",
        "error"
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      showAlert(
        t("resetPassModal.passwordMismatch") || "Şifreler eşleşmiyor",
        "error"
      );
      return;
    }

    if (newPassword === confirmPassword && newPassword.length >= 6) {
      const success = await resetPassword(token, newPassword);

      if (success) {
        showAlert(
          t("resetPassModal.success") || "Şifreniz başarıyla sıfırlandı",
          "success"
        );
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 2000);
      } else {
        showAlert(t("resetPassModal.error"), "error");
        setTimeout(() => {
          setAlertMessage(null);
          setAlertType(null);
        }, 2000);
      }
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

  // Modal kapandığında form'u temizle
  useEffect(() => {
    if (!isOpen) {
      setNewPassword("");
      setConfirmPassword("");
      setShowNewPassword(false);
      setShowConfirmPassword(false);
      setAlertMessage(null);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity"
        style={{
          backgroundImage: `url(${mstLogin})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 1,
        }}
      />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-[10px] bg-black shadow-xl transition-all items-center justify-center"
            style={{
              maxWidth: "569px",
              maxHeight: "750px",
              width: "100%",
              height: "750px",
            }}
          >
            <div className="w-full h-full items-center justify-center pt-[10%]">
              <img
                alt="Your Company"
                src={mstLoginLogo}
                className="mx-auto h-24 w-auto"
              />

              {alertMessage && (
                <div
                  className={`mt-6 mb-4 mx-[20%] px-4 py-3 rounded text-sm font-medium text-center ${
                    alertType === "success"
                      ? "bg-green-600 text-white"
                      : "bg-red-600 text-white"
                  }`}
                >
                  {alertMessage}
                </div>
              )}

              <p className="text-white font-inter font-bold text-3xl pt-[5%]">
                {t("resetPassModal.title") || "Şifremi Unuttum"}
              </p>

              <div className="space-y-6 mt-4 px-[20%]">
                {/* Yeni Şifre */}
                <div className="bg-black">
                  <label
                    htmlFor="newPassword"
                    className="text-[13px] font-medium text-white text-left self-start w-full"
                  >
                    {t("resetPassModal.newPasswordLabel") || "Yeni Şifre"}
                  </label>
                  <div className="mt-2 flex items-center border-b-2">
                    <SvgIcons iconName="Lock" fill="white" />
                    <input
                      placeholder={
                        t("resetPassModal.newPasswordPlaceholder") ||
                        "Yeni şifrenizi girin"
                      }
                      id="newPassword"
                      name="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      required
                      autoComplete="new-password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-black pr-3 pl-2 py-1.5 text-base text-white placeholder:text-white focus:outline-none focus:ring-0 focus:border-mstYellow sm:text-sm"
                    />
                    <div
                      className="cursor-pointer ml-2"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      <SvgIcons
                        iconName={showNewPassword ? "EyeOff" : "Eye"}
                        fill="white"
                        className="w-[20px] h-[20px]"
                      />
                    </div>
                  </div>
                </div>

                {/* Yeni Şifre Tekrar */}
                <div className="bg-black">
                  <label
                    htmlFor="confirmPassword"
                    className="text-[13px] font-medium text-white text-left self-start w-full"
                  >
                    {t("resetPassModal.confirmPasswordLabel") ||
                      "Yeni Şifre Tekrar"}
                  </label>
                  <div className="mt-2 flex items-center border-b-2">
                    <SvgIcons iconName="Lock" fill="white" />
                    <input
                      placeholder={
                        t("resetPassModal.confirmPasswordPlaceholder") ||
                        "Yeni şifrenizi tekrar girin"
                      }
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-black pr-3 pl-2 py-1.5 text-base text-white placeholder:text-white focus:outline-none focus:ring-0 focus:border-mstYellow sm:text-sm"
                    />
                    <div
                      className="cursor-pointer ml-2"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      <SvgIcons
                        iconName={showConfirmPassword ? "EyeOff" : "Eye"}
                        fill="white"
                        className="w-[20px] h-[20px]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center px-[19%] mr-[1%] mt-16">
                <div className="cursor-pointer" onClick={onClose}>
                  <SvgIcons iconName="LeftArrow" fill="#FFF" />
                </div>

                <button
                  className="flex items-center bg-mstYellow w-full justify-center ml-2 py-3 rounded"
                  onClick={handleResetPassword}
                >
                  <h1 className="bg-transparent text-base font-bold font-sans text-white mr-2 inline-block">
                    {t("resetPassModal.reset") || "Şifreyi Sıfırla"}
                  </h1>
                </button>
              </div>

              <div className="flex items-center self-center justify-center mt-4">
                <div className="flex relative bg-transparent">
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
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default ResetPasswordModal;
