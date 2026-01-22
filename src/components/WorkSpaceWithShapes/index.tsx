import React, { useState, useRef, useEffect } from "react";
import { SvgIcons } from "../../assets/icons/SvgIcons";
import { useDarkMode } from "../../context/DarkModeContext";
import { useTranslation } from "react-i18next";
import RenameModal from "../RenameModal";
import ColorPicker from "./ColorPicker";

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
}

interface WorkSpaceWithShapesProps {
  shapeInfos: ShapeInfo[];
  onToggleVisibility: (id: string) => void;
  onDelete: (id: string) => void;
  onServiceClick: (isService: boolean) => void;
  onRename: (id: string, newName: string) => void;
  onColorChange: (id: string, newColor: string) => void;
  onFocusShape: (id: string) => void;
}

const WorkSpaceWithShapes: React.FC<WorkSpaceWithShapesProps> = ({
  shapeInfos,
  onToggleVisibility,
  onDelete,
  onServiceClick,
  onRename,
  onColorChange,
  onFocusShape,
}) => {
  const { isDarkMode } = useDarkMode();
  const [isService, setIsService] = useState(false);
  const { t } = useTranslation();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const [openColorId, setOpenColorId] = useState<string | null>(null);
  const colorRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [renameModalId, setRenameModalId] = useState<string | null>(null);
  const selectedShape = shapeInfos.find((shape) => shape.id === renameModalId);

  const colorPickerRef = useRef<HTMLDivElement | null>(null);

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
      console.log("handleClickOutside");
      const target = event.target as Node;

      const clickedInsideAnyColorInput = Object.values(colorRefs.current).some(
        (ref) => ref && ref.contains(target)
      );

      const clickedInsideMenu = menuRef.current?.contains(target) ?? false;
      const clickedInsideColorPicker =
        colorPickerRef.current?.contains(target) ?? false;
      if (
        !clickedInsideAnyColorInput &&
        !clickedInsideMenu &&
        !clickedInsideColorPicker
      ) {
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
    console.log("handleServiceClick");
    const newValue = !isService;
    setIsService(newValue);
    onServiceClick(newValue); // true ise göster, false ise gizle
  };

  return (
    <div className="bg-white p-[20px] rounded-[10px] filter font-inter min-w-[270px] w-full drop-shadow-[2px_2px_4px_#00000026] dark:bg-gray10 dark:border-gray10">
      <div className="flex flex-col">
        <div className="text-[20px] text-left text-gray4 font-bold mb-[15px]">
          {t("mapPage.workArea")}
        </div>

        {shapeInfos.length === 0 ? (
          <div className="py-2 text-center text-gray-500">
            {t("mapPage.noWorkArea")}
          </div>
        ) : (
          shapeInfos.map((shapeInfo) => (
            <div
              key={shapeInfo.id}
              className="flex items-center justify-between w-full mb-[15px] cursor-pointer"
              onClick={() => onFocusShape(shapeInfo.id)}
            >
              <div className="flex gap-2">
                <div className="relative">
                  <span
                    className="w-[24px] h-[24px] flex bg-black border-2 border-gray4 rounded-md cursor-pointer"
                    style={{ backgroundColor: shapeInfo.color }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleColorClick(shapeInfo.id);
                    }}
                  ></span>
                  {openColorId === shapeInfo.id && (
                    <div
                      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-30"
                      ref={colorPickerRef}
                    >
                      <ColorPicker
                        shapeInfo={shapeInfo}
                        onColorChange={(id: string, color: string) => {
                          onColorChange(id, color);
                          setOpenColorId(null);
                        }}
                        onCancel={() => setOpenColorId(null)}
                      />
                    </div>
                  )}
                </div>
                <span
                  className={`text-[16px] ${
                    shapeInfo.visible
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
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleVisibility(shapeInfo.id);
                  }}
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
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId((prev) =>
                      prev === shapeInfo.id ? null : shapeInfo.id
                    );
                  }}
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
                          onClick={(e) => {
                            e.stopPropagation();
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
                          onClick={(e) => {
                            e.stopPropagation();
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
          ))
        )}

        {/*yeni şekil ekleme aktif olmalı*/}

        <div
          className="flex flex-col items-center justify-center w-full mt-4 cursor-pointer select-none"
          onClick={handleServiceClick}
        >
          <div className="flex items-center gap-2 mt-[27px]">
            {isService ? (
              <span className="text-[16px] text-gray10 dark:text-gray6">
                {t("mapPage.hideService")}
              </span>
            ) : (
              <span className="text-[16px] text-gray10 dark:text-gray6">
                {t("mapPage.showService")}
              </span>
            )}
            <SvgIcons
              iconName={isService ? "OpenEye" : "CloseEye"}
              fill={isDarkMode ? "#8B96A2" : "#28333E"}
              className="w-[16px] h-[16px]"
            />
          </div>
        </div>

        {/*
           <div className="flex flex-col items-center justify-center w-full">
            <div className="flex items-center gap-2" onClick={() => onToggleVisibility("all")}>
                <SvgIcons iconName="Plus" fill="#B9C2CA"  className="w-[16px] h-[16px]"/>
                <span className="text-[16px] text-gray4 ">Yeni Ekle</span>
            </div>
        </div>
          <div className="flex flex-col items-center justify-center w-full mt-4">
          <div className="flex items-center gap-2 mt-[27px]">
            <span className="text-[16px] text-gray10">Servis Konumlarını Gizle</span>
            <SvgIcons iconName="OpenEye" fill="#28333E" className="w-[16px] h-[16px]"/>
          </div>
        </div>
          */}
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

export default WorkSpaceWithShapes;
