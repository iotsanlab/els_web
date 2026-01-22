import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from "react-i18next";
import machineStore from '../../store/MachineStore';

interface Machine {
  id: string;
  name: string;
  type: string;
  serialNo?: string;
  model?: string;
  [key: string]: any;
}

interface CheckboxItem {
  id: string;
  label: string;
  checked: boolean;
  indeterminate?: boolean;
  serialNo?: string;
  model?: string;
  type?: string;
  disabled?: boolean;
  children?: CheckboxItem[];
}

interface TreeCheckboxProps {
  items?: CheckboxItem[];
  onChange?: (items: CheckboxItem[]) => void;
  isAllNotVisible?: boolean;
}

const TreeCheckbox: React.FC<TreeCheckboxProps> = ({ 
  items: initialItems, 
  onChange, 
  isAllNotVisible = false 
}) => {
  const { t } = useTranslation();
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // Machine listesini machineStore'dan oluştur
  const machineListItems = useMemo(() => {
    if (initialItems) return initialItems;

    const machines = machineStore.getAllMachines();

    const machineList = machines.reduce<Record<string, Machine[]>>((acc, machine) => {
      const type = machine.type || "Unknown";
      
      if (!acc[type]) {
        acc[type] = [];
      }

      acc[type].push({
        id: machine.id?.toString() || Math.random().toString(),
        name: machine.name || machine.model || "Unknown",
        type: type,
        serialNo: machine.serialNo || "-",
        model: machine.model || "-",
        label: machine.name || machine.model || machine.serialNo || "Unknown"
      });

      return acc;
    }, {});

    const result = Object.entries(machineList).map(([type, machines]) => ({
      id: type,
      label: type,
      checked: !isAllNotVisible,
      disabled: false,
      indeterminate: false,
      children: machines.map((machine) => ({
        id: machine.id,
        label: machine.label,
        serialNo: machine.serialNo,
        model: machine.model,
        type: machine.type,
        checked: !isAllNotVisible,
        disabled: false,
      }))
    }));

    console.log("TreeCheckbox - Oluşturulan liste:", result);
    return result;
  }, [initialItems, isAllNotVisible]);

  const [items, setItems] = useState<CheckboxItem[]>(machineListItems);

  // Machine store değiştiğinde items'ı güncelle
  useEffect(() => {
    if (!initialItems) {
      setItems(machineListItems);
    }
  }, [machineListItems, initialItems]);

  // Indeterminate durumunu hesapla
  const calculateIndeterminate = useCallback((items: CheckboxItem[]) => {
    return items.map(item => {
      if (item.children) {
        const checkedChildren = item.children.filter(child => child.checked).length;
        const totalChildren = item.children.length;
        
        return {
          ...item,
          indeterminate: checkedChildren > 0 && checkedChildren < totalChildren,
          checked: checkedChildren === totalChildren
        };
      }
      return item;
    });
  }, []);

  // Parent checkbox değişikliği
  const handleParentChange = useCallback((itemId: string, checked: boolean) => {
    setItems(prevItems => {
      let updatedItems = prevItems.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            checked,
            indeterminate: false,
            children: item.children?.map(child => ({ ...child, checked }))
          };
        }
        return item;
      });

      // isAllNotVisible durumunda type seçimi mantığı
      if (isAllNotVisible) {
        if (checked) {
          // Yeni tip seçildiğinde diğerlerini disable et
          setSelectedType(itemId);
          updatedItems = updatedItems.map(item => ({
            ...item,
            disabled: item.id !== itemId,
            children: item.children?.map(child => ({
              ...child,
              disabled: item.id !== itemId
            }))
          }));
        } else if (selectedType === itemId) {
          // Seçili tip kaldırıldığında tüm disable'ları kaldır
          setSelectedType(null);
          updatedItems = updatedItems.map(item => ({
            ...item,
            disabled: false,
            children: item.children?.map(child => ({
              ...child,
              disabled: false
            }))
          }));
        }
      }

      const finalItems = calculateIndeterminate(updatedItems);
      
      // Değişikliği parent'a bildir
      if (onChange) {
        console.log("TreeCheckbox - onChange tetiklendi:", finalItems);
        onChange(finalItems);
      }
      
      return finalItems;
    });
  }, [isAllNotVisible, selectedType, calculateIndeterminate, onChange]);

  // Child checkbox değişikliği
  const handleChildChange = useCallback((parentId: string, childId: string, checked: boolean) => {
    setItems(prevItems => {
      let updatedItems = prevItems.map(item => {
        if (item.id === parentId && item.children) {
          const updatedChildren = item.children.map(child => 
            child.id === childId ? { ...child, checked } : child
          );
          
          return { ...item, children: updatedChildren };
        }
        return item;
      });

      // isAllNotVisible durumunda type seçimi mantığı
      if (isAllNotVisible) {
        const parentItem = updatedItems.find(item => item.id === parentId);
        const anyChildChecked = parentItem?.children?.some(child => child.checked) || false;

        if (checked && !selectedType) {
          // İlk child seçildiğinde diğer tipleri disable et
          setSelectedType(parentId);
          updatedItems = updatedItems.map(item => ({
            ...item,
            disabled: item.id !== parentId,
            children: item.children?.map(child => ({
              ...child,
              disabled: item.id !== parentId
            }))
          }));
        } else if (!anyChildChecked && selectedType === parentId) {
          // Son child kaldırıldığında tüm disable'ları kaldır
          setSelectedType(null);
          updatedItems = updatedItems.map(item => ({
            ...item,
            disabled: false,
            children: item.children?.map(child => ({
              ...child,
              disabled: false
            }))
          }));
        }
      }

      const finalItems = calculateIndeterminate(updatedItems);
      
      // Değişikliği parent'a bildir
      if (onChange) {
        console.log("TreeCheckbox - onChange tetiklendi:", finalItems);
        onChange(finalItems);
      }
      
      return finalItems;
    });
  }, [isAllNotVisible, selectedType, calculateIndeterminate, onChange]);

  // Checkbox komponenti
  const CheckboxInput: React.FC<{
    id?: string;
    checked: boolean;
    indeterminate?: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    className?: string;
  }> = ({ id, checked, indeterminate, onChange, disabled, className }) => {
    return (
      <input
        id={id}
        type="checkbox"
        checked={checked}
        ref={(el) => {
          if (el) el.indeterminate = indeterminate || false;
        }}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className={`w-5 h-5 text-blue-600 border-gray-300 rounded-[10px] focus:ring-blue-500 ${className || ''}`}
      />
    );
  };

  const renderCheckboxItem = (item: CheckboxItem) => {
    return (
      <div key={item.id} className="mb-3 group font-inter">
        <label
            htmlFor={`parent-${item.id}`}  // ⬅️ Eklenen satır
            className={`flex items-center ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
          <CheckboxInput
            id={`parent-${item.id}`}
            checked={item.checked}
            indeterminate={item.indeterminate}
            onChange={(checked) => handleParentChange(item.id, checked)}
            disabled={item.disabled}
          />
          <span className="ml-2 font-medium text-gray-700 dark:text-white">{item.label}</span>
        </label>
        
        {item.children && item.children.length > 0 && (
          <div className="hidden pl-4 mt-2 ml-6 transition-opacity duration-300 border-l border-gray-300 border-dashed group-hover:block">
            {item.children.map(child => (
              <div key={child.id} className="mb-2">
                <label
                  htmlFor={`child-${child.id}`}

                  className={`flex items-center ${child.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                  <CheckboxInput
                    id={`child-${child.id}`} // ✅ benzersiz id

                    checked={child.checked}
                    onChange={(checked) => handleChildChange(item.id, child.id, checked)}
                    disabled={child.disabled}
                  />
                  <span className="ml-2 text-gray-600 dark:text-white">{child.serialNo}</span>
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-md p-4 bg-white dark:bg-gray10 min-w-[270px] h-full max-h-[500px] overflow-y-auto rounded-[10px] shadow-sm group">
      <div className="text-[20px] text-left text-gray4 font-bold mb-[15px]">{t("mapPage.fleet")}</div>
      {items.map(renderCheckboxItem)}
    </div>
  );
};

export default TreeCheckbox;