import React, { useEffect, useRef, useState } from 'react';
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { useDarkMode } from '../../context/DarkModeContext';
import { userStore } from '../../store/UserStore';
import { ShapeInfo } from '../../utils/map';
import { saveWorkingAreasToAsset, saveWorkingAreasToDevice, getWorkingAreasFromAsset, getUserId } from '../../services/auth';
import { SvgIcons } from '../../assets/icons/SvgIcons';
import { ControlPosition, MapControl } from '@vis.gl/react-google-maps';    


interface DrawingManagerControlProps {
    isEditMode: boolean;
    setShapeInfos: React.Dispatch<React.SetStateAction<ShapeInfo[]>>;
    setPrevShapeInfos: React.Dispatch<React.SetStateAction<[]>>;
    shapeInfos: ShapeInfo[];
    getRandomColor: () => string;
    newShapeName: string;
    shapeCountRef: React.MutableRefObject<number>;
    googleMap: google.maps.Map | null;
    onEditModeChange: (mode: boolean) => void;
    prevShapeInfos: [];
  }
  
  export const DrawingManagerControl = React.forwardRef<
    google.maps.drawing.DrawingManager | null,
    DrawingManagerControlProps
  >(({
    isEditMode,
    shapeInfos,
    setShapeInfos,
    setPrevShapeInfos,
    prevShapeInfos,
    getRandomColor,
    newShapeName,
    shapeCountRef,
    googleMap,
    onEditModeChange,
  }, parentRef) => {
    const drawingManagerRef = useRef<google.maps.drawing.DrawingManager | null>(null);
    const map = useMap();
    const drawing = useMapsLibrary("drawing");
    const { isDarkMode } = useDarkMode();
    const [userID, setUserID] = useState<string>("");
    const prevIsEditMode = useRef(isEditMode);
  
    useEffect(() => {
      if (parentRef && typeof parentRef === 'object' && 'current' in parentRef) {
        parentRef.current = drawingManagerRef.current;
      }
    }, [parentRef]);
  
    useEffect(() => {
      if (parentRef && typeof parentRef === 'object' && 'current' in parentRef && drawingManagerRef.current) {
        parentRef.current = drawingManagerRef.current;
      }
    }, [parentRef, drawingManagerRef.current]);
  
    const getSavePayload = (updatedShapes: any[], originalShapes: any[]) => {
      const ignoreKeys = ["createdAt"];
      const machineCoordinateMap: any[] = [];
      const allMachineIds: string[] = [];
  
      updatedShapes.forEach((shape) => {
        if (shape.assignedMachineIds && Array.isArray(shape.assignedMachineIds)) {
          shape.assignedMachineIds.forEach((machineId: string) => {
            if (!allMachineIds.includes(machineId)) {
              allMachineIds.push(machineId);
            }
            const existing = machineCoordinateMap.find(
              (entry) => entry.machineId === machineId
            );
            if (!existing) {
              machineCoordinateMap.push({
                machineId,
                coordinates: shape.coordinates,
              });
            }
          });
        }
      });
  
      originalShapes.forEach((shape) => {
        if (shape.assignedMachineIds && Array.isArray(shape.assignedMachineIds)) {
          shape.assignedMachineIds.forEach((machineId: string) => {
            if (!allMachineIds.includes(machineId)) {
              allMachineIds.push(machineId);
              machineCoordinateMap.push({
                machineId,
                coordinates: [],
              });
            } else {
              const exists = machineCoordinateMap.some(
                (entry) => entry.machineId === machineId
              );
              if (!exists) {
                machineCoordinateMap.push({
                  machineId,
                  coordinates: [],
                });
              }
            }
          });
        }
      });
  
      const isMeaningfullyChanged = () => {
        if (updatedShapes.length !== originalShapes.length) return true;
  
        for (let i = 0; i < updatedShapes.length; i++) {
          const updated = { ...updatedShapes[i] };
          const original = { ...originalShapes[i] };
  
          ignoreKeys.forEach((key) => {
            delete updated[key];
            delete original[key];
          });
  
          if (updated.assignedMachineIds) updated.assignedMachineIds.sort();
          if (original.assignedMachineIds) original.assignedMachineIds.sort();
  
          if (JSON.stringify(updated) !== JSON.stringify(original)) {
            return true;
          }
        }
  
        return false;
      };
  
      return {
        changed: isMeaningfullyChanged(),
        machineCoordinateMap,
      };
    };
  
    const saveWorkingAreasToAPI = async (
      userID: string,
      workingAreas: any,
      prevWorkingAreas: any,
      entityType: string
    ): Promise<boolean> => {
      try {
        const { changed, machineCoordinateMap } = getSavePayload(
          workingAreas,
          prevWorkingAreas
        );
        if (!changed) {
          return true;
        }
  
        const success = await saveWorkingAreasToAsset(workingAreas);
        await Promise.all(
          machineCoordinateMap.map((element) => {
            saveWorkingAreasToDevice(element.machineId, element.coordinates, entityType);
          })
        );
        return success;
      } catch (error) {
        console.error("Working areas kaydedilemedi:", error);
        return false;
      }
    };
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await getUserId();
          setUserID(response);
        } catch (err) {
          console.error("user id hatası:", err);
        }
      };
  
      fetchData();
    }, []);
  
    const syncShapesToAPI = async (shapes: ShapeInfo[]) => {
      const formattedShapes = shapes.map((shape) => {
        const path = (shape.shape as google.maps.Polygon)
          .getPath()
          .getArray()
          .map((latLng): [number, number] => [latLng.lat(), latLng.lng()]);
  
        return {
          id: shape.id,
          name: shape.name,
          color: shape.color,
          type: shape.type,
          visible: shape.visible,
          coordinates: path,
          assignedMachineIds: shape.assignedMachineSerials || [],
          createdAt: new Date().toISOString(),
        };
      });
  
      try {
        await saveWorkingAreasToAsset(formattedShapes);
      } catch (error) {
        console.error("Çalışma alanları güncellenemedi:", error);
      }
    };
  
    const hasRestoredShapes = useRef(false);
  
    useEffect(() => {
      if (!map || !drawing || hasRestoredShapes.current || !userID) return;
  
      const fetchAndRestore = async () => {
        const raw = await getWorkingAreasFromAsset();
        const rebuilt = rebuildPolygonsFromAPI(raw);
        setShapeInfos(rebuilt);
        setPrevShapeInfos(raw);
      };
  
      const rebuildPolygonsFromAPI = (fetchedShapes: any[]): ShapeInfo[] => {
        return fetchedShapes.map((item) => {
          // Koordinatları [lat, lng] formatından { lat, lng } formatına dönüştür
          const paths = item.coordinates.map((coord: [number, number] | { lat: number; lng: number }) => {
            if (Array.isArray(coord)) {
              return { lat: coord[0], lng: coord[1] };
            }
            return coord; // Eski format uyumluluğu için
          });

          const polygon = new google.maps.Polygon({
            paths: paths,
            fillColor: item.color,
            strokeColor: item.color,
            strokeWeight: 2,
            fillOpacity: 0.3,
            editable: false,
            draggable: false,
          });
  
          polygon.setMap(map);
  
          polygon.addListener("dragend", () => {
            setShapeInfos((prev) => {
              const updatedShapes = prev.map((shape) => {
                if (shape.id === item.id) {
                  return {
                    ...shape,
                    shape: polygon,
                  };
                }
                return shape;
              });
  
              syncShapesToAPI(updatedShapes);
              return updatedShapes;
            });
          });
  
          return {
            id: item.id,
            name: item.name,
            color: item.color,
            shape: polygon,
            visible: item.visible ?? true,
            type: item.type ?? "polygon",
            assignedMachineSerials: item.assignedMachineIds || [],
          };
        });
      };
  
      fetchAndRestore();
      hasRestoredShapes.current = true;
    }, [map, drawing, userID]);
  
    const getShapeCoordinates = (
      overlay: any,
      type: google.maps.drawing.OverlayType
    ): [number, number][] | null => {
      switch (type) {
        case google.maps.drawing.OverlayType.POLYGON:
          const polygon = overlay as google.maps.Polygon;
          const path = polygon.getPath();
          return path.getArray().map((latLng): [number, number] => [latLng.lat(), latLng.lng()]);
        default:
          return null;
      }
    };
  
    useEffect(() => {
      if (!map || !drawing) return;
  
      if (drawingManagerRef.current) {
        drawingManagerRef.current.setMap(isEditMode ? map : null);
        return;
      }
  
      const newDrawingManager = new drawing.DrawingManager({
        map: isEditMode ? map : null,
        drawingMode: null,
        drawingControl: true,
        drawingControlOptions: {
          position: google.maps.ControlPosition.BOTTOM_CENTER,
          drawingModes: [google.maps.drawing.OverlayType.POLYGON],
        },
        polygonOptions: {
          fillColor: "#000",
          fillOpacity: 0.3,
          strokeWeight: 2,
          strokeColor: "#000",
          editable: true,
          draggable: true,
        },
      });
  
      if (map) {
        map.setMapTypeId("hybrid");
      }
  
      drawingManagerRef.current = newDrawingManager;
  
      if (parentRef && typeof parentRef === 'object' && 'current' in parentRef) {
        parentRef.current = newDrawingManager;
      }
  
      google.maps.event.addListener(
        newDrawingManager,
        "overlaycomplete",
        (event: google.maps.drawing.OverlayCompleteEvent) => {
          let shapeType = "polygon";
          const randomColor = getRandomColor();
  
          if (event.type !== google.maps.drawing.OverlayType.MARKER) {
            const overlay = event.overlay as google.maps.Polygon;
            overlay.setOptions({
              fillColor: randomColor,
              strokeColor: randomColor,
              editable: true,
              draggable: true,
            });
          }
  
          const coordinates = getShapeCoordinates(event.overlay, event.type);
  
          const newShapeInfo: ShapeInfo = {
            id: `shape-${Date.now()}`,
            name: `${newShapeName} ${shapeCountRef.current}`,
            color: randomColor,
            shape: event.overlay,
            visible: true,
            type: shapeType,
          };
  
          shapeCountRef.current += 1;
  
          setShapeInfos((prev) => {
            const updated = [...prev, newShapeInfo];
            return updated;
          });
  
          newDrawingManager.setDrawingMode(null);
        }
      );
  
      return () => {
        if (drawingManagerRef.current) {
          drawingManagerRef.current.setMap(null);
        }
      };
    }, [map, drawing, isEditMode, newShapeName, shapeCountRef, setShapeInfos, getRandomColor, parentRef]);
  
    useEffect(() => {
      if (drawingManagerRef.current && map) {
        drawingManagerRef.current.setMap(isEditMode ? map : null);
  
        setShapeInfos((prevShapes) =>
          prevShapes.map((shapeInfo) => {
            const shape = shapeInfo.shape as google.maps.Polygon;
            shape.setOptions({
              editable: isEditMode,
              draggable: isEditMode,
            });
            return shapeInfo;
          })
        );
      }
    }, [isEditMode, map, setShapeInfos]);
  
    useEffect(() => {
      if (prevIsEditMode.current === true && isEditMode === false) {
        const entityType = userStore.getEntityType() || "DEVICE";
  
        const updatedShapeData = shapeInfos.map((shape) => {
          let coordinates;
          switch (shape.type) {
            case google.maps.drawing.OverlayType.POLYGON:
            case "polygon":
              coordinates = getShapeCoordinates(
                shape.shape,
                google.maps.drawing.OverlayType.POLYGON
              );
              break;
            default:
              coordinates = [];
          }
  
          return {
            id: shape.id,
            name: shape.name,
            color: shape.color,
            type: shape.type,
            visible: shape.visible,
            coordinates: coordinates,
            createdAt: new Date().toISOString(),
            assignedMachineIds: shape.assignedMachineSerials,
          };
        });
        saveWorkingAreasToAPI(userID, updatedShapeData, prevShapeInfos, entityType);
        prevIsEditMode.current = isEditMode;
      }
    }, [isEditMode, shapeInfos, userID, prevShapeInfos]);
  
    if (!isEditMode) {
      return null;
    }
  
    return (
      <MapControl position={ControlPosition.BOTTOM_CENTER}>
        <button
          onClick={() => {
            onEditModeChange(false);
            prevIsEditMode.current = true;
          }}
          className="text-black ml-[-5px] mb-[26px] h-[45px] w-[45px] flex items-center justify-center transition-shadow duration-200 bg-white rounded-md shadow-sm dark:bg-gray9 dark:text-white"
        >
          <SvgIcons
            iconName="Close"
            className="w-[12px] h-[12px]"
            fill={isDarkMode ? "#fff" : "#989898"}
          />
        </button>
      </MapControl>
    );
  });