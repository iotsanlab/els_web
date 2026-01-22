import React from "react";
import { ControlPosition, MapControl } from "@vis.gl/react-google-maps";
import { SvgIcons } from "../../assets/icons/SvgIcons";
import { useDarkMode } from "../../context/DarkModeContext";

interface CustomZoomControlProps {
  controlPosition: ControlPosition;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onEditClick?: () => void;
  isEditActive?: boolean;
}

export const CustomZoomControl: React.FC<CustomZoomControlProps> = ({
  controlPosition,
  zoom,
  onZoomChange,
  onEditClick,
  isEditActive = false,
}) => {
  const { isDarkMode } = useDarkMode();

  return (
    <MapControl position={controlPosition}>
      <div className="bottom-0 z-20 w-full  overflow-hidden rounded-[10px] pr-4 pb-2">
        <div className="flex items-center justify-between w-full h-full ">
          <div className="flex justify-end items-center  gap-[6px] w-full p-[4px] rounded-[10px] bg-white dark:bg-gray9">
            {onEditClick && (
              <>
                <div
                  className={`w-[32px] h-[32px]   rounded-[10px]  flex items-center justify-center cursor-pointer  ${
                    isEditActive
                      ? "bg-blue-500 text-white"
                      : "bg-gray1 dark:bg-gray8"
                  }`}
                  onClick={onEditClick}
                >
                  <SvgIcons
                    iconName="Pencil"
                    fill={isDarkMode ? "#B9C2CA" : "#B9C2CA"}
                  />
                </div>

                <span className="w-[1px] h-[24px] bg-gray2 dark:bg-gray8"></span>
              </>
            )}

            <div
              id="zoom-in"
              className="w-[32px] h-[32px]  bg-gray1 rounded-[10px]  flex items-center justify-center cursor-pointer dark:bg-gray8 "
              onClick={() => onZoomChange(zoom + 1)}
            >
              <SvgIcons
                iconName="ZoomIn"
                fill={isDarkMode ? "#B9C2CA" : "#B9C2CA"}
              />
            </div>

            <div
              id="zoom-out"
              className="w-[32px] h-[32px]  bg-gray1 rounded-[10px]  flex items-center justify-center cursor-pointer dark:bg-gray8 "
              onClick={() => onZoomChange(zoom - 1)}
            >
              <SvgIcons
                iconName="ZoomOut"
                fill={isDarkMode ? "#B9C2CA" : "#B9C2CA"}
              />
            </div>
          </div>
        </div>
      </div>
    </MapControl>
  );
};
