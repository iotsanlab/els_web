import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { Fragment, useRef, useState } from "react";
import Divider from "../Divider";
import { SvgIcons } from "../../assets/icons/SvgIcons";
import Select from "../Select";
import TreeCheckbox from "../TreeCheckbox";
import { useTranslation } from 'react-i18next';
import CalendarComponent from "../Calendar";
import { reportStore } from "../../store/ReportStore";


interface CheckboxItem {
  id: string;
  label: string;
  checked: boolean;
  serialNo?: string;
  model?: string;
  type?: string;
  children?: CheckboxItem[];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: ReportFormData) => void;
}

interface ReportFormData {
  reportName: string;
  reportType: string;
  dateRange: string;
  selectedMachines: CheckboxItem[];
}

const AddReportModal = ({ isOpen, onClose, onSubmit }: Props) => {
  const { t } = useTranslation();
  const initialFocusRef = useRef(null);
  const [step, setStep] = useState<"1" | "2">("1");
  const [calendarOpen, SetCalendarOpen] = useState<boolean>(false);

  // Form state
  const [reportName, setReportName] = useState<string>("");
  const [selectedReport, setSelectedReport] = useState<string | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedMachines, setSelectedMachines] = useState<CheckboxItem[]>([]);

  // Validation state
  const [errors, setErrors] = useState<{
    reportName?: string;
    selectedReport?: string;
    selectedDate?: string;
    selectedMachines?: string;
  }>({});

  const validateStep1 = () => {
    const newErrors: typeof errors = {};

    if (!reportName.trim()) {
      newErrors.reportName = t("reportPop.errors.reportNameRequired");
    }

    if (!selectedReport) {
      newErrors.selectedReport = t("reportPop.errors.reportTypeRequired");
    }

    if (!selectedDate) {
      newErrors.selectedDate = t("reportPop.errors.dateRangeRequired");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: typeof errors = {};

    if (selectedMachines.length === 0) {
      newErrors.selectedMachines = t("reportPop.errors.machinesRequired");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateStep1()) {
      setStep("2");
    }
  };

  const onBack = () => {
    setStep("1");
    setErrors({});
  };

  const handleSave = () => {
    if (validateStep2()) {
      const formData: ReportFormData = {
        reportName,
        reportType: selectedReport,
        dateRange: selectedDate,
        selectedMachines: selectedMachines,
      };
  
      onSubmit(formData); // Rapor verisini üst bileşene gönderiyoruz
  
      // Form verilerini sıfırlıyoruz
      setReportName("");
      setSelectedReport("");
      setSelectedDate("");
      setSelectedMachines([]);
      setStep("1");
      setErrors({});
      onClose(); // Modal'ı kapatıyoruz
    }
  };
  

  const handleMachineSelection = (items: CheckboxItem[]) => {
    const selected = items.flatMap(item => 
      item.children?.filter(child => child.checked).map(child => ({
        id: child.id,
        label: child.label,
        serialNo: child.serialNo,
        model: child.model,
        type: child.type,
        checked: true,
      })) || []
    );
  
    setSelectedMachines(selected); // State'i güncelliyoruz
  
    if (errors.selectedMachines) {
      setErrors(prev => ({ ...prev, selectedMachines: undefined }));
    }
  };
  

  const handleDateChange = (newDate: Date) => {
    setSelectedDate(newDate.toLocaleDateString()); // Tarihi doğru formatta state'e kaydediyoruz
    SetCalendarOpen(false); // Takvimi kapatıyoruz
  };

  const REPORT_OPTIONS = [
    { label: t("global.schema1"), value: "hours" },
    { label: t("global.schema2"), value: "fuel" },
  ];
  

  return (
   <>
    <Dialog
      as="div"
      open={isOpen}
      onClose={onClose}
      className="relative z-30"
      initialFocus={initialFocusRef}
    >
      <div className="fixed inset-0 z-10 overflow-y-auto ">
        <div className="flex items-center justify-center min-h-screen p-4 text-center select-none sm:p-0">
          <DialogBackdrop as={Fragment}>
            <div className="fixed inset-0 transition-opacity bg-gray-500/75" />
          </DialogBackdrop>

          <DialogPanel as={Fragment}>
            <div
              className="
              relative px-[30px] py-[34px] overflow-hidden bg-gray1 dark:bg-gray10 rounded-[20px] shadow-xl transition-all transform flex flex-col
              w-[560px] h-[750px]
              "
              ref={initialFocusRef}
            >
              <div className="flex items-center justify-between mb-[20px]">
                <span className="text-gray4 text-left font-[700] text-[20px] font-inter leading-relaxed tracking-wide">
                  {t("reportPop.header")}
                </span>
                <div className="cursor-pointer" onClick={onClose}>
                  <SvgIcons iconName="Close" fill="#B9C2CA" />
                </div>
              </div>

              <div className="h-[2px] w-full bg-gray2 dark:bg-gray9"></div>

              <div className="flex-grow my-[20px]">
                <div className="w-full h-[36px] flex items-center justify-between">
                  <div className="flex items-center ">
                    <span className={`w-[36px] h-[36px] mr-[14px] rounded-full flex items-center justify-center ${step == "2" ? "bg-gray4 dark:bg-gray8 text-white" : "bg-gray10 dark:bg-mstYellow text-white"}`}>1</span>
                    <span className={`font-inter font-bold text-[20px]  ${step == "2" ? "text-gray4 dark:text-gray8" : "text-gray10 dark:text-mstYellow"}`}>{t("reportPop.report")}</span>
                  </div>

                  <span className="text-gray4 dark:text-gray8 font-bold text-[28px] font-inter">- -- -- -</span>

                  <div className="flex items-center ">
                    <span className={`w-[36px] h-[36px] mr-[14px] rounded-full flex items-center justify-center ${step == "1" ? "bg-gray4 dark:bg-gray8 text-white" : "bg-gray10 dark:bg-mstYellow text-white "}`}>2</span>
                    <span className={`font-inter font-bold text-[20px]  ${step == "1" ? "text-gray4 dark:text-gray8" : "text-gray10 dark:text-mstYellow"}`}>{t("reportPop.machine")}</span>
                  </div>
                </div>

                <div className="h-[20px]"></div>

                {step == "1" ?
                  <div>
                    <div className="mb-4">
                      <input
                        id="reportName"
                        name="reportName"
                        value={reportName}
                        onChange={(e) => {
                          setReportName(e.target.value);
                          if (errors.reportName) {
                            setErrors(prev => ({ ...prev, reportName: undefined }));
                          }
                        }}
                        className={`
                        w-full h-[36px] rounded-[10px] 
                        text-[14px] text-gray4 font-inter font-medium
                        placeholder:text-gray4  
                        bg-transparent
                        border-[1px] ${errors.reportName ? 'border-red-500' : 'border-gray4'} 
                        focus:ring-0
                        pl-[10px]
                        items-center
                      `}
                        placeholder={t("reportPop.text")}
                      />
                      {errors.reportName && (
                        <p className="mt-1 text-sm text-left text-red-500">{errors.reportName}</p>
                      )}
                    </div>

                    <div className="mb-4">
                    <Select
  options={REPORT_OPTIONS.map(opt => opt.label)}
  value={
    REPORT_OPTIONS.find(opt => opt.value === selectedReport)?.label ||
    t("reportPop.option-1")
  }
  onChange={(label) => {
    const matched = REPORT_OPTIONS.find(opt => opt.label === label);
    if (matched) {
      setSelectedReport(matched.value); // Artık "hours" veya "fuel" olarak kaydedecek
    }
    if (errors.selectedReport) {
      setErrors(prev => ({ ...prev, selectedReport: undefined }));
    }
  }}
  className={`min-h-[44px] items-center justify-between shadow dark:bg-gray9 ${
    errors.selectedReport ? "border-red-500" : ""
  }`}
  isArrow={true}
/>

                      {errors.selectedReport && (
                        <p className="mt-1 text-sm text-left text-red-500">{errors.selectedReport}</p>
                      )}
                    </div>

                    <div className="mb-4 cursor-pointer" >
                      <div  className="
                      drop-shadow-[2px_2px_4px_#00000026]
                      flex w-full min-h-[44px] 
                      cursor-default rounded-[5px] bg-white dark:bg-gray9
                      items-center justify-between
                      focus:bg-white focus:border-0 focus:outline-none pr-2 pl-3 text-gray10 hover:border-0 border-mstYellow border-0 cursor-pointer"
                      onClick={() => SetCalendarOpen(!calendarOpen)}>
         
                      <span className="block truncate font-inter font-medium text-[12px] dark:text-white">{selectedDate || t("global.selectDate")}</span>
                      <SvgIcons iconName='DownArrow' fill='#B9C2CA'/>

                      </div>
                     
                      {errors.selectedDate && (
                        <p className="mt-1 text-sm text-left text-red-500">{errors.selectedDate}</p>
                      )}
                    </div>
                  </div>
                  :
                  <div>
                    <TreeCheckbox onChange={handleMachineSelection} isAllNotVisible={true} />
                    {errors.selectedMachines && (
                      <p className="mt-1 text-sm text-left text-red-500">{errors.selectedMachines}</p>
                    )}
                  </div>
                }
              </div>

              <Divider />

              <div className="flex items-center justify-end gap-3 mt-[20px]">
                <div
                  className="rounded-[10px] bg-white dark:bg-gray9 px-9 py-2 font-inter text-[14px] font-bold text-gray10 dark:text-white shadow-xs cursor-pointer"
                  onClick={step == "2" ? onBack : onClose}
                >
                  {step == "1" ? t("reportPop.cancel") : t("global.back")}
                </div>

                <div
                  className="rounded-[10px] bg-[#FFA600] px-9 py-2 font-inter font-bold text-white text-[14px] shadow-xs hover:bg-gray10 cursor-pointer"
                  onClick={step == "1" ? handleContinue : handleSave}
                >
                  {step == "1" ? t("reportPop.next") : t("reportPop.create")}
                </div>
              </div>
              {calendarOpen && (
  <div className="absolute flex items-center justify-center pt-[450px] pl-[250px]">
    <CalendarComponent 
      onClose={() => SetCalendarOpen(false)}  // Takvimi kapat
      onDateSelect={(startDate: Date, endDate: Date) => {
        setSelectedDate(`${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`); 
      }}  // Seçilen tarih aralığını state'e kaydet
    />
  </div>
)}



            </div>
            
          </DialogPanel>
          
        </div>
        
      </div>
    
    </Dialog>
   
      </>
  );
};

export default AddReportModal;
