import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { Fragment, useEffect, useRef } from "react";
import Transfer from "../Transfer";
import Divider from "../Divider";
import { SvgIcons } from "../../assets/icons/SvgIcons";
import { useTranslation } from "react-i18next";
interface Props {
  isOpen: boolean;
  onClose: () => void;
  availableItemsList: string[];
  selectedItemsList: string[];
  onItemsChange: (availableItems: string[], selectedItems: string[]) => void;
  onSave: (selectedItems: string[], availableItems: string[]) => void;
  machineType?: string;
  subtype?: string;
}

const TransferModal = ({ isOpen, onClose, availableItemsList, selectedItemsList, onItemsChange, onSave, machineType, subtype }: Props) => {
  const initialFocusRef = useRef(null);
  const { t } = useTranslation();

  const handleSave = () => {
    onSave(selectedItemsList, availableItemsList);

  };



  return (
    <Dialog
      as="div"
      open={isOpen}
      onClose={onClose}
      className="relative z-30"
      initialFocus={initialFocusRef}
    >
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen p-4 text-center select-none sm:p-0">
          <DialogBackdrop as={Fragment}>
            <div className="fixed inset-0 transition-opacity bg-gray-500/75" />
          </DialogBackdrop>

          <DialogPanel as={Fragment}>
            <div
              className="relative px-[30px] py-[34px] overflow-hidden bg-white dark:bg-gray10 rounded-[20px] shadow-xl transition-all transform flex flex-col"
              style={{
                maxWidth: "850px",
                maxHeight: "850px",
                width: "100%",
                height: "850px",
              }}
              ref={initialFocusRef}
            >
              <div className="flex items-center justify-between mb-[20px]">
                <span className="text-gray4 text-left font-[700] text-[20px] font-inter leading-relaxed tracking-wide">
                  {t("machineInfoPage.treeSelectCard.addAndRemove")}
                </span>
                <div className="cursor-pointer" onClick={onClose}>
                  <SvgIcons iconName="Close" fill="#B9C2CA" />
                </div>
              </div>

              <Divider />

              <div className="flex-grow mb-[20px]">
                <Transfer 
                  machineType={machineType}
                  subtype={subtype}
                  availableItemsList={availableItemsList} 
                  selectedItemsList={selectedItemsList} 
                  onItemsChange={onItemsChange}
                />
              </div>

              <Divider  />

              <div className="flex items-center justify-end gap-3 mt-[20px]">
                <div
                  className="rounded-[10px] bg-white px-9 py-2 font-inter text-[14px] font-bold text-gray10 shadow-xs cursor-pointer"
                  onClick={onClose}
                >
                  {t("machineInfoPage.treeSelectCard.cancel")}
                </div>

                <div
                  className="rounded-[10px] bg-[#FFA600] px-9 py-2 font-inter font-bold text-white text-[14px] shadow-xs hover:bg-gray10 cursor-pointer"
                  onClick={handleSave}
                >
                  {t("machineInfoPage.treeSelectCard.save")}
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default TransferModal;
