import { SvgIcons } from "../../assets/icons/SvgIcons";
import GeneralTitle from "../../components/Title/GeneralTitle";
import GenderComp from "./GenderComp";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef } from "react";
import { getUserId, getAccountInfo, saveAccountInfo, getUserInfos } from "../../services/auth";
import { X } from "lucide-react";
import { changePassword } from "../../services/auth"; // veya kendi path'in
import { userStore } from "../../store/UserStore";

interface AccountInfo {
    name: string;
    surname: string;
    company: string;
    gender: string;
    email: string;
    password: string;
    birthDate: string;
}

const AccountPage = () => {
    const { t } = useTranslation();

    // Gender enum keys - dil bağımsız
    const genderKeys = ['male', 'female', 'preferNotToSay'];

    const allCheckedOptions = [
        t("accountPage.male"),
        t("accountPage.female"),
        t("accountPage.preferNotToSay")
    ];

    // Modal state
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: ""
    });

    const handleGenderChange = (selected: string[]) => {
        // Seçilen text'i enum key'e çevir
        const selectedText = selected[0] || "";
        const selectedIndex = allCheckedOptions.indexOf(selectedText);
        const genderKey = selectedIndex !== -1 ? genderKeys[selectedIndex] : "";

        setFormData({ ...formData, gender: genderKey });
    };

    // Gender key'ini text'e çeviren fonksiyon
    const getGenderText = (genderKey: string) => {
        const index = genderKeys.indexOf(genderKey);
        return index !== -1 ? allCheckedOptions[index] : "";
    };

    const [userID, setUserID] = useState<string>("");

    // Her field için ayrı edit mode
    const [editModes, setEditModes] = useState<{ [key: string]: boolean }>({});
    const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
    const [formData, setFormData] = useState<AccountInfo>({
        name: "",
        surname: "",
        company: "",
        gender: "",
        email: "",
        password: "",
        birthDate: "",
    });
    // Orijinal veriler için backup
    const [originalData, setOriginalData] = useState<AccountInfo>({
        name: "",
        surname: "",
        company: "",
        gender: "",
        email: "",
        password: "",
        birthDate: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getUserId();
                setUserID(response || "");
                console.log("userID", userID, "res", response);
            } catch (err) {
                console.error("user id hatası:", err);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchInfo = async () => {
            if (!userID) return;

            const data = await getAccountInfo(userID);
            const userInfos = await getUserInfos();
            if (data && data.length > 0) {
                console.log(userStore, 'data test edelim');
                if (data[0].email === "") {
                    data[0].email = userInfos.email || "";
                }
                if (data[0].name === "") {
                    data[0].name = userInfos.name || "";
                }
                if (data[0].surname === "") {
                    data[0].surname = userInfos.surname || "";
                }
                if (data[0].company === "") {
                    data[0].company = userInfos.company || "";
                }
                setAccountInfo(data[0]);
                setFormData(data[0]);
                setOriginalData(data[0]); // Orijinal veriyi sakla
            } else {
                // Varsayılan gender key'i set et
                const emailStore = userStore.email;
                const name = userInfos.name;
                const surname = userInfos.surname;
                const company = userInfos.company;  

                const defaultData = {
                    name: name || "",
                    surname: surname || "",
                    company: company || "",
                    gender: "male", // varsayılan olarak 'male' key'i
                    email: emailStore || "",
                    password: "",
                    birthDate: "",
                };
                setFormData(defaultData);
                setOriginalData(defaultData);
            }
        };

        fetchInfo();
    }, [userID]);

    // Edit modunu aç
    const startEdit = (fieldName: string) => {
        setEditModes(prev => ({ ...prev, [fieldName]: true }));
        // O anki form verisini orijinal olarak sakla
        setOriginalData({ ...formData });
    };

    // Değişiklikleri kaydet
    const saveField = async (fieldName: string) => {
        if (!userID) return;

        try {
            const success = await saveAccountInfo(userID, [formData]);
            if (success) {
                setAccountInfo(formData);
                setOriginalData({ ...formData }); // Yeni veriyi orijinal yap
                setEditModes(prev => ({ ...prev, [fieldName]: false }));
            }
        } catch (error) {
            console.error("Kaydetme hatası:", error);
        }
    };

    // Değişiklikleri iptal et
    const cancelEdit = (fieldName: string) => {
        setFormData({ ...originalData }); // Orijinal veriye dön
        setEditModes(prev => ({ ...prev, [fieldName]: false }));
    };

    // Password modal functions
    const openPasswordModal = () => {
        setIsPasswordModalOpen(true);
        setPasswordForm({ currentPassword: "", newPassword: "" });
    };

    const closePasswordModal = () => {
        setIsPasswordModalOpen(false);
        setPasswordForm({ currentPassword: "", newPassword: "" });
    };



    const handlePasswordChange = async () => {
        if (!passwordForm.currentPassword || !passwordForm.newPassword) return;

        try {
            const result = await changePassword(
                passwordForm.currentPassword,
                passwordForm.newPassword
            );
            console.log("Şifre değiştirildi:", result);
            // Başarılı olursa modal'ı kapat
            closePasswordModal();
            // Opsiyonel: kullanıcıya bir toast / alert göster
            alert("Şifre başarıyla değiştirildi.");
        } catch (error: any) {
            console.error("Şifre değiştirme hatası:", error);
            // Hata mesajını kullanıcıya göster
            alert(error?.response?.data?.message || "Şifre değiştirme sırasında bir hata oluştu.");
        }
    };

    const InputComp: React.FC<{
        title: string;
        name: keyof AccountInfo;
        value: string;
        isIcon?: boolean;
        isEditable?: boolean;
        inputType?: string;
        showPasswordButton?: boolean;
    }> = ({ title, name, value, isIcon = true, isEditable = true, inputType = "text", showPasswordButton = false }) => {
        const isEditMode = editModes[name] || false;
        const inputRef = useRef<HTMLInputElement>(null);

        // Edit mode açıldığında input'a focus yap
        useEffect(() => {
            if (isEditMode && inputRef.current) {
                inputRef.current.focus();
                // Date input'larda setSelectionRange çalışmaz, sadece text input'larda çalışır
                if (inputType === "text") {
                    const length = inputRef.current.value.length;
                    inputRef.current.setSelectionRange(length, length);
                }
            }
        }, [isEditMode]);

        return (
            <div>
                <label className="font-inter font-bold text-[16px] text-gray6 dark:text-white">
                    {title}
                </label>
                <div className="mt-2 grid grid-cols-1 w-[500px] mb-[20px] relative">
                    <input
                        ref={inputRef}
                        type={inputType}
                        name={name}
                        value={formData[name]}
                        readOnly={!isEditMode}
                        placeholder="Giriniz"
                        onChange={(e) =>
                            setFormData({ ...formData, [name]: e.target.value })
                        }
                        className={`col-start-1 row-start-1 block w-full rounded-[10px] bg-white dark:bg-gray10 dark:text-white py-1.5 pl-3 pr-10 text-base text-gray-900 outline outline-1 -outline-offset-1 ${isEditMode ? "outline-yellow-500" : "outline-gray4"
                            } placeholder:text-gray-400 ${!isEditMode ? "cursor-default" : ""}`}
                    />
                    {isIcon && !isEditMode && isEditable && (
                        <button
                            onClick={() => startEdit(name)}
                            type="button"
                            className="absolute right-[1px] top-1/2 transform -translate-y-1/2 bg-transparent 
                                        focus:outline-none focus:ring-0 
                                        focus-visible:outline-none focus-visible:ring-0 
                                        hover:outline-none hover:ring-0"
                        >
                            <SvgIcons iconName="Pencil" fill="#B9C2CA" className="size-5" />
                        </button>
                    )}
                </div>

                {/* Şifremi Değiştir butonu - sadece email için */}
                {showPasswordButton && (
                    <div className="mb-4">
                        <button
                            onClick={openPasswordModal}
                            className="bg-mstYellow text-white px-4 py-2 rounded-md hover:bg-yellow-600 text-sm"
                        >
                           {t("accountPage.changePassword")}
                        </button>
                    </div>
                )}

                {/* Kaydet/İptal butonları */}
                {isEditMode && (
                    <div className="flex gap-3 mb-4">
                        <button
                            onClick={() => saveField(name)}
                            className="bg-mstYellow text-white px-4 py-2 rounded-md hover:bg-yellow-600 text-sm"
                        >
                            {t("global.save")}
                        </button>
                        <button
                            onClick={() => cancelEdit(name)}
                            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 text-sm"
                        >
                            {t("global.cancel")}
                        </button>
                    </div>
                )}
            </div>
        );
    };

    // Password Modal Component
    const PasswordModal = () => {
        const currentPasswordRef = useRef<HTMLInputElement>(null);
        const newPasswordRef = useRef<HTMLInputElement>(null);

        if (!isPasswordModalOpen) return null;

        const handlePasswordChangeLocal = async () => {
            const current = currentPasswordRef.current?.value || "";
            const next = newPasswordRef.current?.value || "";

            if (!current || !next) return;

            try {
                await changePassword(current, next);
                alert("Şifre başarıyla değiştirildi.");
                closePasswordModal();
            } catch (error: any) {
                alert(error?.response?.data?.message || "Şifre değiştirme sırasında bir hata oluştu.");
            }
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray10 p-6 rounded-[10px] w-[400px] drop-shadow-lg">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray6 dark:text-white">
                           {t("accountPage.changePassword")}
                        </h2>
                        <button onClick={closePasswordModal} className="p-2 rounded-full bg-white">
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block mb-2 font-bold text-gray6 dark:text-white">{t("accountPage.currentPassword")}</label>
                            <input
                                spellCheck={false}
                                type="password"
                                ref={currentPasswordRef}
                                autoComplete="new-password"
                                placeholder= {t("accountPage.enterCurrentPassword")}
                                className="w-full rounded-[10px] bg-white dark:bg-gray8 dark:text-white py-2 px-3 text-base text-gray-900 outline outline-1 outline-gray4 focus:outline-yellow-500"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-bold text-gray6 dark:text-white">{t("accountPage.newPassword")}</label>
                            <input
                                spellCheck={false}
                                type="password"
                                ref={newPasswordRef}
                                autoComplete="new-password"
                                placeholder= {t("accountPage.enterNewPassword")}
                                className="w-full rounded-[10px] bg-white dark:bg-gray8 dark:text-white py-2 px-3 text-base text-gray-900 outline outline-1 outline-gray4 focus:outline-yellow-500"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 mt-6 justify-end">
                        <button onClick={closePasswordModal} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md">
                            {t("global.cancel")}
                        </button>
                        <button
                            onClick={handlePasswordChangeLocal}
                            className="bg-mstYellow text-white px-4 py-2 rounded-md hover:bg-yellow-600"
                        >
                            {t("accountPage.changePassword")}
                        </button>
                    </div>
                </div>
            </div>
        );
    };


    return (
        <div className="w-[1184px] h-full flex flex-col">
            <GeneralTitle title={t("accountPage.title")} />
            <div className="w-full h-full bg-white dark:bg-gray10 flex flex-col pl-[20px] pt-[20px] rounded-[10px] drop-shadow-[2px_2px_4px_#00000026]">
                <div className="flex">
                    <InputComp title={t("accountPage.firstName")} name="name" value="" />
                    <div className="w-[10px]"></div>
                    <InputComp title={t("accountPage.lastName")} name="surname" value="" />
                </div>

                <InputComp
                    title={t("accountPage.email")}
                    name="email"
                    value="serhat.dilaver@mst.com"
                    isIcon={false}
                    isEditable={false}
                    showPasswordButton={true}
                />

                <div>
                    <label className="font-inter font-bold text-[16px] text-gray6 mb-[10px] dark:text-white">
                        {t("accountPage.gender")}
                    </label>
                    <div className="relative">
                        <GenderComp
                            options={allCheckedOptions}
                            type2={false}
                            onChange={handleGenderChange}
                            selectedOptions={formData.gender ? [getGenderText(formData.gender)] : []}
                            readOnly={!editModes.gender}
                        />

                        {/* Kalem ikonu */}
                        {!editModes.gender && (
                            <button
                                onClick={() => startEdit('gender')}
                                type="button"
                                className="absolute left-[400px] top-1/2 transform -translate-y-1/2 bg-transparent 
                                        focus:outline-none focus:ring-0 
                                        focus-visible:outline-none focus-visible:ring-0 
                                        hover:outline-none hover:ring-0"
                            >
                                <SvgIcons iconName="Pencil" fill="#B9C2CA" className="size-5" />
                            </button>
                        )}
                    </div>

                    {/* Kaydet/İptal butonları */}
                    {editModes.gender && (
                        <div className="flex gap-3 mb-4">
                            <button
                                onClick={() => saveField('gender')}
                                className="bg-mstYellow text-white px-4 py-2 rounded-md hover:bg-yellow-600 text-sm"
                            >
                                {t("global.save")}
                            </button>
                            <button
                                onClick={() => cancelEdit('gender')}
                                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 text-sm"
                            >
                                {t("global.cancel")}
                            </button>
                        </div>
                    )}
                </div>

                <InputComp title={t("accountPage.company")} name="company" value="MST" />
                <InputComp
                    title={t("accountPage.birthDate")}
                    name="birthDate"
                    value="06/03/1998"
                    isEditable={true}
                    inputType="date"
                />
            </div>

            {/* Password Modal */}
            <PasswordModal />
        </div>
    );
};

export default AccountPage;