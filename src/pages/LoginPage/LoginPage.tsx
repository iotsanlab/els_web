import i18next from "i18next"; // bunu en üste import et
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userStore } from "../../store/UserStore";
import { UserLogin } from "../../services/auth";
import mstLoginLogo from "../../assets/images/logo.png";
import { SvgIcons } from "../../assets/icons/SvgIcons";
import ForgotPassModal from "../../components/Modal/forgotPass";

import mstLogin1 from "../../assets/login/mstLogin1.png";
import mstLogin2 from "../../assets/login/mstLogin2.png";
import mstLogin3 from "../../assets/login/mstLogin3.png";
import { useTranslation } from "react-i18next";

const COOLDOWN_KEY = "cooldownUntil";
const COOLDOWN_DURATION = 300;

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // BU KALDIRILABİLİR
  const [alertMessage, setAlertMessage] = useState<string | null>(null); // Alert state
  const [alertType, setAlertType] = useState<
    "alert-success" | "alert-error" | "alert-info"
  >(); // Alert tipi
  const [erronousLogin, setErronousLogin] = useState(0);
  const navigate = useNavigate();

  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);
  const [now, setNow] = useState(Math.floor(Date.now() / 1000));
  const [alertTexts, setAlertTexts] = useState({
    reason: "",
    explanation: "",
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Math.floor(Date.now() / 1000));
    }, 1000);

    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  const isEmail = (str: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);

  useEffect(() => {
    const stored = localStorage.getItem(COOLDOWN_KEY);
    if (stored) {
      setCooldownUntil(parseInt(stored));
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("attempts");
    if (stored) {
      setErronousLogin(parseInt(stored));
    }
  }, []);

  const startCooldown = () => {
    const now = Math.floor(Date.now() / 1000); // Epoch in seconds
    const until = now + COOLDOWN_DURATION;

    setCooldownUntil(until);
    localStorage.setItem(COOLDOWN_KEY, until.toString());
  };

  const clearCooldown = () => {
    localStorage.removeItem(COOLDOWN_KEY);
    localStorage.removeItem("attempts");
    setErronousLogin(0);
    setCooldownUntil(null);
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault(); // Form submit default behavior'ını engeller

    if (!email || !password) {
      setAlertType("alert-error");
      setErrorMessage(t("profilePage.loginRequired"));
      return;
    }

    if (isEmail(email)) {
      setLoading(true);
      try {
        const data = await UserLogin(email, password);
        userStore.setUser({
          token: data.token,
          refreshToken: data.refreshToken,
          email: email,
        });

        localStorage.removeItem(COOLDOWN_KEY);
        setCooldownUntil(null);

        // Başarılı giriş sonrası alert göster
        setAlertType("alert-success");
        setAlertMessage(t("profilePage.loginSuccess"));
        // Birkaç saniye sonra yönlendirme yap
        localStorage.setItem("justLoggedIn", "true");

        setTimeout(() => {
          navigate("/home"); // Başarıyla giriş yapıldığında yönlendirme
        }, 2000);
      } catch (error) {
        console.error(error);
        setErronousLogin((prev) => prev + 1);
        localStorage.setItem("attempts", erronousLogin.toString());
        setAlertTexts({
          reason: t("profilePage.credAlert"),
          explanation: t("profilePage.credAlertExplanation"),
        });
        setErrorMessage("Login failed. Please try again.");
        setAlertType("alert-error");
        setAlertMessage(t("profilePage.loginFail"));
      } finally {
        setLoading(false);
      }
    } else {
      setAlertType("alert-error");
      setAlertMessage(t("profilePage.emailCheck"));
      setErronousLogin((prev) => prev + 1);
      setAlertTexts({
        reason: t("profilePage.invalidFormatAlert"),
        explanation: t("profilePage.invalidFormatExplanation"),
      });
      localStorage.setItem("attempts", erronousLogin.toString());
      return;
    }
  };

  useEffect(() => {
    if (erronousLogin >= 3) {
      startCooldown();
    }
  }, [erronousLogin]);

  useEffect(() => {
    if (cooldownUntil) {
      const now = Math.floor(Date.now() / 1000);
      if (now >= cooldownUntil) {
        clearCooldown();
      }
    }
  }, [cooldownUntil]);

  const typeArray = ["TR", "EN"]; // Type'lar dizisi
  const [selectedType, setSelectedType] = useState<string>(typeArray[0]); // Başlangıçta ilk tür seçili
  const [dropdownOpen, setDropdownOpen] = useState(false); // Dropdown'un açık/kapalı durumu

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleSelectType = (type: string) => {
    setSelectedType(type);
    const langCode = type.toLowerCase();
    i18next.changeLanguage(langCode);
    localStorage.setItem("language", langCode);
    setDropdownOpen(false);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const images = [mstLogin1, mstLogin2, mstLogin3];
  const [random, setRandom] = useState<number>(0);

  useEffect(() => {
    const randomValue = Math.floor(Math.random() * 3);
    setRandom(randomValue);
  }, []);
  useEffect(() => {
    const currentLang = i18next.language.toUpperCase(); // örn. 'en' => 'EN'
    if (typeArray.includes(currentLang)) {
      setSelectedType(currentLang);
    } else {
      setSelectedType("TR"); // fallback
    }
  }, [isModalOpen]);

  return (
    <div className="flex bg-black h-screen w-screen items-center justify-center">
      {/* Sol Görsel 
      <div className="bg-black h-screen w-4/7 hidden md:flex bg-cover bg-center">
        <img
          alt="Your Company"
          src={images[random]}
          className="h-full w-full "
        />
      </div>
*/}
      <ForgotPassModal isOpen={isModalOpen} onClose={closeModal} />

      {/* Sağ Form */}
      {cooldownUntil && now < cooldownUntil ? (
        <div className="flex flex-col bg-black h-screen w-full md:w-2/6 justify-center items-center px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center">
            <img
              alt="MST"
              src={mstLoginLogo}
              className="mx-auto w-[200px] w-auto"
            />

            <h2 className="mt-10 text-[28px] font-bold text-white">
              {alertTexts.reason}
            </h2>

            <p className="mt-4 text-gray-400 text-[15px]">
              {alertTexts.explanation}
            </p>

            <p className="mt-6 text-gray-300 text-[15px]">
              {t("profilePage.contact")}
            </p>

            {/* Cooldown display placeholder */}
            <div className="mt-8 p-3 border border-gray8 rounded-[10px] bg-gray10 text-white w-full">
              <p className="text-sm text-gray-400">
                {t("profilePage.cooldown")} {cooldownUntil - now}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col bg-mstYellow  w-full md:w-2/6 justify-center items-center rounded-lg ">
          <div className="flex min-h-full flex-1 flex-col justify-center px-8 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <img
                alt="MST"
                src={mstLoginLogo}
                className="mx-auto w-[200px] w-auto"
              />
              <h2 className="mt-10 text-left text-[30px] font-bold tracking-tight text-white">
                {t("profilePage.loginTitle")}
              </h2>

              <br />

              <span className="text-left text-[16px] font-normal tracking-tight text-white">
                {t("profilePage.registerRedirect")}{" "}
                <span
                  className="text-black font-bold cursor-pointer hover:text-indigo-400"
                  onClick={() =>
                    alert("Kayıt olma sayfasına yönlendiriliyor...")
                  } // Burada click olayı ekleniyor
                >
                  {t("profilePage.registerHere")}
                </span>{" "}
                {t("profilePage.registerText")}
              </span>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              {/* Alert */}
              {alertMessage && (
                <div role="alert" className={`alert ${alertType} my-4`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="h-6 w-6 shrink-0 stroke-current"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <span>{alertMessage}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleLogin} className="flex flex-col gap-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-[13px] font-medium text-white"
                  >
                    {t("profilePage.email")}
                  </label>
                  <div className="mt-2 flex items-center border-b-2">
                    <SvgIcons iconName="Message" fill="white" />

                    <input
                      placeholder={t("profilePage.emailPlaceholder")}
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-black pr-3 pl-2 py-1.5 text-base text-white placeholder:text-white focus:outline-none focus:ring-0 focus:border-mstYellow sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-[13px] font-medium text-white"
                    >
                      {t("profilePage.password")}
                    </label>
                  </div>
                  <div className="mt-2 flex items-center border-b-2">
                    <SvgIcons iconName="LockKey" fill="white" />

                    <input
                      placeholder={t("profilePage.passwordPlaceholder")}
                      id="password"
                      name="password"
                      type="password"
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full bg-black pr-3 pl-2 py-1.5 text-base text-white placeholder:text-white focus:outline-none focus:border-mstYellow sm:text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center self-center justify-center">
                  {/* Sıralama: Tür kısmı */}
                  <div className="flex relative focus:outline-none focus:border-none hover:border-transparent ring-none">
                    <button
                      type="button"
                      className={`flex items-center hover:border-transparent focus:border-transparent bg-black hover:bg-gray10 focus:outline-none ${
                        dropdownOpen ? "bg-gray10" : ""
                      }`}
                      onClick={toggleDropdown}
                    >
                      <SvgIcons iconName="Language" fill="white" />
                      <h1 className="bg-transparent text-base font-bold font-sans text-white mx-[5px] inline-block min-w-6">
                        {selectedType}
                      </h1>
                      <SvgIcons iconName="DownArrow" fill="white" />
                    </button>

                    {/* Dropdown menüsü */}
                    {dropdownOpen && (
                      <div
                        className="absolute left-0 top-full w-40 rounded-[10px] drop-shadow-[2px_2px_4px_#00000026]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ul className="py-2 text-sm text-white">
                          {typeArray
                            .filter((type) => type !== selectedType)
                            .map((type, index) => (
                              <li key={index}>
                                <button
                                  type="button"
                                  className="flex items-center hover:border-transparent bg-gray10 focus:outline-none"
                                  onClick={() => {
                                    toggleDropdown();
                                    handleSelectType(type);
                                  }}
                                >
                                  <SvgIcons iconName="Language" fill="white" />
                                  <h1 className="bg-transparent text-base font-bold font-sans text-white mx-[5px] inline-block pr-[32px] min-w-6">
                                    {type}
                                  </h1>
                                </button>
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <div className="h-12"></div>

                <div className="text-sm  flex items-end justify-end">
                  <a
                    href="#"
                    onClick={openModal}
                    className="font-light text-white hover:text-indigo-500"
                  >
                    {t("profilePage.forgotPassword")}
                  </a>
                </div>
                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-[10px] bg-black px-3 py-1.5 text-sm/6 font-semibold text-white drop-shadow-[2px_2px_4px_#00000026] hover:bg-gray8 border-0 "
                  >
                    {loading
                      ? t("profilePage.loggingIn")
                      : t("profilePage.loginButton")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
