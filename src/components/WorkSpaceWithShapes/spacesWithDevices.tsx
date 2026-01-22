import React, { useState, useRef, useEffect } from "react";
import { SvgIcons } from "../../assets/icons/SvgIcons";
import { useDarkMode } from "../../context/DarkModeContext";
import { useTranslation } from "react-i18next";
import RenameModal from "../RenameModal";
import serviceExc from "../../assets/service/serviceExc.png";
import serviceBackhoe from "../../assets/service/serviceBackhoe.png";
import serviceTele from "../../assets/service/serviceTele.png";
import serviceExcWhite from "../../assets/service/serviceExcWhite.png";
import serviceBackhoeWhite from "../../assets/service/serviceBackhoeWhite.png";
import serviceTeleWhite from "../../assets/service/serviceTeleWhite.png";

interface ShapeInfo {
  id: string;
  name: string;
  color: string;
  shape:
  | google.maps.Polygon
  | google.maps.Polyline
  | google.maps.Rectangle
  | google.maps.Circle
  | google.maps.Marker;
  visible: boolean;
  type: string;
  isRenamed?: boolean;
  assignedMachineSerials?: string[]; // Artık seri numaraları
}

interface Machine {
  id: string;
  deviceName: string;
  serialNo: string;
  type: string;
  operator: string;
  totalHours: string;
  instantFuel: string;
}

interface SpacesWithDevicesProps {
  shapeInfos: ShapeInfo[];
  machineAssignments: { [shapeId: string]: string[] }; // Shape'e atanmış makine seri numaraları
  machineList: Machine[];
  onToggleVisibility: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, newName: string) => void;
  onColorChange: (id: string, newColor: string) => void;
  onServiceClick: (isService: boolean) => void;
  onAssignmentChange?: (assignments: Record<string, string[]>) => void;
  onStartPolygonDrawing?: () => void;
}

const SpacesWithDevices: React.FC<SpacesWithDevicesProps> = ({
  shapeInfos,
  onToggleVisibility,
  onDelete,
  onServiceClick,
  onRename,
  onColorChange,
  machineAssignments,
  machineList,
  onAssignmentChange,
  onStartPolygonDrawing
}) => {
  const { isDarkMode } = useDarkMode();
  const [isService, setIsService] = useState(false);
  const { t } = useTranslation();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [localAssignments, setLocalAssignments] = useState<
    Record<string, string[]>
  >(machineAssignments || {});

  const [openColorId, setOpenColorId] = useState<string | null>(null);
  const colorRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [renameModalId, setRenameModalId] = useState<string | null>(null);
  const selectedShape = shapeInfos.find((shape) => shape.id === renameModalId);

  const renderServiceImage = (type: string) => {
    switch (type) {
      case "Backhoeloader":
        return isDarkMode ? serviceBackhoeWhite : serviceBackhoe;
      case "Excavator":
        return isDarkMode ? serviceExcWhite : serviceExc;
      case "Telehandler":
        return isDarkMode ? serviceTeleWhite : serviceTele;
      default:
        return serviceTele;
    }
  };
  // --- Atanmış makine seri numaralarını topluyoruz ---
  const assignedMachineSerials = new Set<string>();
  Object.values(localAssignments).forEach((serials) =>
    serials.forEach((serial) => assignedMachineSerials.add(serial))
  );
  // Atanmamış makineler (tüm makineler - atanmış makineler)
  const unassignedMachines = machineList.filter(
    (machine) => !assignedMachineSerials.has(machine.id)
  );

  // --- Drag & Drop Event Handlers ---
  // Makine sürüklemeye başlarken makine seri numarasını set ediyoruz
  const onDragStartMachine = (
    e: React.DragEvent<HTMLDivElement>,
    machineSerialNo: string
  ) => {
    e.dataTransfer.setData("machineSerialNo", machineSerialNo);
    e.dataTransfer.effectAllowed = "move";
  };

  // Shape üzerine bırakma işlemi
  const onDropOnShape = (
    e: React.DragEvent<HTMLDivElement>,
    shapeId: string
  ) => {
    e.preventDefault();
    const machineSerialNo = e.dataTransfer.getData("machineSerialNo");
    if (!machineSerialNo) return;

    setLocalAssignments((prev) => {
      // Öncelikle makineyi diğer tüm shape'lerden çıkar
      const newAssignments: Record<string, string[]> = {};
      for (const key in prev) {
        newAssignments[key] = prev[key].filter(
          (serial) => serial !== machineSerialNo
        );
      }

      // Ardından makineyi bırakılan shape'e ekle
      const currentMachines = newAssignments[shapeId] || [];
      if (!currentMachines.includes(machineSerialNo)) {
        newAssignments[shapeId] = [...currentMachines, machineSerialNo];
      }

      // API'ye kaydet
      onAssignmentChange?.(newAssignments);

      return newAssignments;
    });
  };

  // "Tüm Makineler" kutusuna bırakma işlemi (makine atamasını kaldırır)
  const onDropOnUnassigned = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const machineSerialNo = e.dataTransfer.getData("machineSerialNo");
    if (!machineSerialNo) return;

    setLocalAssignments((prev) => {
      const newAssignments: Record<string, string[]> = {};
      for (const key in prev) {
        newAssignments[key] = prev[key].filter(
          (serial) => serial !== machineSerialNo
        );
      }

      onAssignmentChange?.(newAssignments);

      return newAssignments;
    });
  };

  // Drag over eventlerinde default'u engelle ki drop aktif olsun
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // --- Renk seçim vb. kodlar ---
  const handleColorClick = (shapeId: string) => {
    setOpenColorId((prev) => {
      const newOpenId = prev === shapeId ? null : shapeId;
      if (newOpenId) {
        setTimeout(() => {
          const input = colorRefs.current[shapeId];
          if (input) input.click();
        }, 0);
      }
      return newOpenId;
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      const clickedInsideAnyColorInput = Object.values(colorRefs.current).some(
        (ref) => ref && ref.contains(target)
      );

      const clickedInsideMenu = menuRef.current?.contains(target) ?? false;

      if (!clickedInsideAnyColorInput && !clickedInsideMenu) {
        setOpenColorId(null);
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleServiceClick = () => {
    setIsService(!isService);
    onServiceClick(isService);
  };

  return (
    <div className="bg-white p-[20px] rounded-[10px] filter font-inter min-w-[270px] w-full drop-shadow-[2px_2px_4px_#00000026] dark:bg-gray10 dark:border-gray10">
      <div className="flex flex-col">
        <div className="text-[20px] text-left text-gray4 font-bold mb-[5px]">
          {t("global.shapesWithDevicesTitle")}
        </div>
       <div
  onClick={() => {
    console.log("Yeni Ekle butonuna tıklandı");
    if (onStartPolygonDrawing) {
      onStartPolygonDrawing();
    } else {
      console.warn("onStartPolygonDrawing fonksiyonu tanımlı değil");
    }
  }}
  className="text-[16px] text-left text-gray4 font-medium mb-[15px] cursor-pointer select-none hover:text-gray10 dark:hover:text-white transition-colors"
>
  {t("global.addNew")}
</div>

        {/* Shape Listesi */}
        {shapeInfos.length === 0 ? (
          <div className="py-2 text-center text-gray-500">
            {t("mapPage.noWorkArea")}
          </div>
        ) : (
          shapeInfos.map((shapeInfo) => (
            <div
              key={shapeInfo.id}
              className="flex flex-col p-2 cursor-pointer"
              onDragOver={onDragOver}
              onDrop={(e) => onDropOnShape(e, shapeInfo.id)}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex gap-2 items-center">
                  <span
                    className="w-[24px] h-[24px] flex bg-black border-2 border-gray4 rounded-md cursor-pointer"
                    style={{ backgroundColor: shapeInfo.color }}
                    onClick={() => handleColorClick(shapeInfo.id)}
                  ></span>
                  <span
                    className={`text-[16px] ${shapeInfo.visible
                        ? "text-gray10 dark:text-white font-bold"
                        : "text-gray4 font-medium"
                      }`}
                  >
                    {shapeInfo.name}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className="cursor-pointer"
                    onClick={() => onToggleVisibility(shapeInfo.id)}
                  >
                    <SvgIcons
                      iconName={shapeInfo.visible ? "OpenEye" : "CloseEye"}
                      fill={
                        shapeInfo.visible
                          ? isDarkMode
                            ? "#fff"
                            : "#28333E"
                          : "#B9C2CA"
                      }
                      className="w-[16px] h-[16px]"
                    />
                  </div>
                  <div
                    className="cursor-pointer relative"
                    onClick={() =>
                      setOpenMenuId((prev) =>
                        prev === shapeInfo.id ? null : shapeInfo.id
                      )
                    }
                  >
                    <SvgIcons
                      iconName="ThreePoint"
                      fill={
                        shapeInfo.visible
                          ? isDarkMode
                            ? "#fff"
                            : "#28333E"
                          : "#B9C2CA"
                      }
                      className="w-[12px] h-[12px]"
                    />
                    {openMenuId === shapeInfo.id && (
                      <div
                        ref={menuRef}
                        className="absolute bottom-[0px] left-[25px] z-10 w-[150px] bg-gray1 dark:bg-gray8 shadow-lg rounded-md text-sm"
                      >
                        <div className="py-2">
                          <div
                            className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray9 cursor-pointer text-gray10 dark:text-white"
                            onClick={() => {
                              setRenameModalId(shapeInfo.id);
                              setOpenMenuId(null);
                            }}
                          >
                            {t("mapPage.rename")}
                          </div>
                          <div className=" h-[1px] bg-gray4 mx-[10px]"></div>
                          <div className="px-4 py-2 text-gray400 dark:text-gray600 opacity-50 cursor-not-allowed pointer-events-none">
                            {t("mapPage.editArea")}
                          </div>
                          <div className=" h-[1px] bg-gray4 mx-[10px]"></div>
                          <div className="px-4 py-2 text-gray400 dark:text-gray600 opacity-50 cursor-not-allowed pointer-events-none">
                            {t("mapPage.copy")}
                          </div>
                          <div className=" h-[1px] bg-gray4 mx-[10px]"></div>
                          <div
                            className="px-4 py-2 hover:bg-red-100 text-red-600 cursor-pointer dark:text-white dark:hover:text-black"
                            onClick={() => {
                              onDelete(shapeInfo.id);
                              setOpenMenuId(null);
                            }}
                          >
                            {t("mapPage.delete")}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* --- Bu shape altındaki makineler listesi --- */}
              <div className="pl-4 ">
                {(localAssignments[shapeInfo.id] || []).length === 0 ? (
                  <div className="text-gray-400 italic text-sm">
                    Makine atanmamış
                  </div>
                ) : (
                  <ul className="space-y-1">
                    {(localAssignments[shapeInfo.id] || []).map(
                      (machineSerial) => {
                        const machine = machineList.find(
                          (m) => m.id === machineSerial
                        );
                        if (!machine) return null;

                        return (
                          <li
                            key={machine.id}
                            draggable
                            onDragStart={(e) =>
                              onDragStartMachine(e, machine.id)
                            }
                            className=" font-inter font-medium text-[12px]  text-gray10 p-2rounded cursor-grab  hover:bg-gray-100 dark:hover:bg-gray-700 " //buraya
                            title={`${machine.deviceName} (${machine.serialNo})`}
                          >
                            <div className="flex items-center gap-2 ml-[14px]">
                              <img
                                src={renderServiceImage(machine.type)}
                                alt="Service"
                                className="w-[32px] h-auto"
                              />
                              <div className="font-medium text-sm text-gray10 dark:text-white">
                                {machine.serialNo}
                              </div>
                            </div>
                          </li>
                        );
                      }
                    )}
                  </ul>
                )}
              </div>
            </div>
          ))
        )}

        {/* --- Tüm makineler (atanmamış) bölümü --- */}
        <div
          className="mt-[10px] p-3  min-h-[150px] "
          onDragOver={onDragOver}
          onDrop={onDropOnUnassigned}
        >
          <div
            className={
              "text-[16px] text-gray10 dark:text-white font-bold mb-[4px]"
            }
          >
            {t("global.noAssig")}
          </div>
          {unassignedMachines.length === 0 ? (
            <div className="text-gray-500 italic text-center py-4">
              Tüm makineler çalışma alanlarına atanmış
            </div>
          ) : (
            <div className="space-y-2">
              {unassignedMachines.map((machine) => (
                <div
                  key={machine.id}
                  draggable
                  onDragStart={(e) => onDragStartMachine(e, machine.id)}
                  className=" font-inter font-medium text-[12px]  text-gray10 p-2rounded cursor-grab  hover:bg-gray-100 dark:hover:bg-gray-700 " //buraya
                  title={`${machine.deviceName} (${machine.serialNo})`}
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={renderServiceImage(machine.type)}
                      alt="Service"
                      className="w-[32px] h-auto"
                    />
                    <div className="font-medium text-sm text-gray10 dark:text-white">
                      {machine.serialNo}
                    </div>
                  </div>

                  {/* <div className="text-xs text-gray-400">Tip: {machine.type}</div> */}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Servis Göster/Gizle */}
        <div
          className="flex flex-col items-center justify-center w-full mt-4 cursor-pointer select-none"
          onClick={handleServiceClick}
        >
          <div className="flex items-center gap-2 mt-[27px]">
            {isService ? (
              <span className="text-[16px] text-gray10 dark:text-gray6">
                {t("mapPage.showService")}
              </span>
            ) : (
              <span className="text-[16px] text-gray10 dark:text-gray6">
                {t("mapPage.hideService")}
              </span>
            )}
            <SvgIcons
              iconName={!isService ? "CloseEye" : "OpenEye"}
              fill={isDarkMode ? "#8B96A2" : "#28333E"}
              className="w-[16px] h-[16px]"
            />
          </div>
        </div>
      </div>

      <RenameModal
        isOpen={renameModalId !== null}
        initialName={selectedShape?.name || ""}
        onClose={() => setRenameModalId(null)}
        onRename={(newName) => {
          if (newName.trim() !== "" && selectedShape) {
            onRename(selectedShape.id, newName);
          }
          setRenameModalId(null);
        }}
      />
    </div>
  );
};

export default SpacesWithDevices;
