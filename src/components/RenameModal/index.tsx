import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";


interface RenameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRename: (newName: string) => void;
  initialName: string;
}

const RenameModal: React.FC<RenameModalProps> = ({ isOpen, onClose, onRename, initialName }) => {
  const [name, setName] = useState(initialName);
    const { t } = useTranslation();


  useEffect(() => {
    if (isOpen) {
      setName(initialName);  
    }
  }, [isOpen, initialName]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[300px]">
        <h2 className="text-lg font-semibold mb-4">{t("mapPage.rename")}</h2>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full border border-gray-300 rounded px-2 py-1 mb-4"
        />
        <div className="flex justify-end gap-2">
          <button className="px-3 py-1 bg-gray-200 rounded" onClick={onClose}>{t("global.cancel")}</button>
          <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => onRename(name)}>{t("global.save")}</button>
        </div>
      </div>
    </div>
  );
};


export default RenameModal;
