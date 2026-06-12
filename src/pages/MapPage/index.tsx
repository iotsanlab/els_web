import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { APIProvider, ControlPosition, Map } from "@vis.gl/react-google-maps";
import { useDarkMode } from "../../context/DarkModeContext";
import { CustomZoomControl } from "../../components/MapControl";
import TreeCheckbox from "../../components/TreeCheckbox";
import GeneralTitle from "../../components/Title/GeneralTitle";
import InfoMenu from "../../components/InfoMenu/InfoMenu";
import WorkSpaceWithShapes from "../../components/WorkSpaceWithShapes";
import service_locations from "../../data/ServiceData";
import { ClusteredMarkers } from "../../components/ClusteredMarkers";
import { useSearchParams } from "react-router-dom";
import { DrawingManagerControl } from "./drawing-manager";
import { MAP_IDS, ServiceLocation, ShapeInfo, MapInfoMenu, MapServiceInfo } from "../../utils/map";
import ServiceInfoCard from "../../components/ServiceInfoCard";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import machineStore from "../../store/MachineStore";
import deviceWorkStore from "../../store/DeviceTelemetry";
import { userStore } from "../../store/UserStore";
import SetupMapControls from "./SetupMapControls";
import { getTimerSetting, getUserId, saveWorkingAreasToAsset, saveWorkingAreasToDevice } from "../../services/auth";
import SpacesWithDevices from "../../components/WorkSpaceWithShapes/spacesWithDevices";
import { useNotification } from "../../hooks/useNotification";

import { alarm } from "../../services/endpoints";
import { refreshAllTelemetry } from "../../hooks/useDeviceInitialization";

interface NearestServiceType {
  id: number;
  name: string;
  lat: string | number;
  long: string | number;
  address: string;
  authorizedPerson: string;
  phone: string[];
  email?: string;
  distance: number;
}

const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const findNearestService = (
  machineLat: number,
  machineLng: number,
  services: any[]
): NearestServiceType | null => {
  if (!services || !Array.isArray(services)) return null;
  let nearestService: NearestServiceType | null = null;
  let minDistance = Infinity;

  services.forEach((service) => {
    const serviceLat = parseFloat(String(service.lat));
    const serviceLng = parseFloat(String(service.long));

    if (!isNaN(serviceLat) && !isNaN(serviceLng)) {
      const distance = calculateDistance(
        machineLat,
        machineLng,
        serviceLat,
        serviceLng
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearestService = { ...service, distance };
      }
    }
  });

  return nearestService;
};

const MapPage = () => {
  const { t } = useTranslation();
  const navigation = useNavigate();
  const { isDarkMode } = useDarkMode();
  const [userID, setUserID] = useState<string>("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [shapeInfos, setShapeInfos] = useState<ShapeInfo[]>([]);
  const [prevShapeInfos, setPrevShapeInfos] = useState<[]>([]);
  const [newShapeName] = useState("Çalışma Alanı");
  const shapeCountRef = useRef(1);
  const [googleMap, setGoogleMap] = useState<google.maps.Map | null>(null);
  const [infoMenu, setInfoMenu] = useState<MapInfoMenu | null>(null);
  const [serviceInfoMenu, setServiceInfoMenu] = useState<MapServiceInfo | null>(
    null
  );
  const [selectedMachineId, setSelectedMachineId] = useState<string | null>(
    null
  );
  const [nearestService, setNearestService] = useState<NearestServiceType | null>(null);
  const [timerInterval, setTimerInterval] = useState<number>(1);
  const [isTimerLoaded, setIsTimerLoaded] = useState<boolean>(false);

  const [searchParams] = useSearchParams();
  const lat = searchParams.get("lat");
  const long = searchParams.get("long");
  const fromWarning = searchParams.get("fromWarning") === "true";
  const machineSerialNo = searchParams.get("machineSerialNo");
  const shapeId = searchParams.get("shapeId");

  const drawingManagerRef = useRef<google.maps.drawing.DrawingManager | null>(null);

  const { alarms: vehicleAlarms, isLoading: isVehicleAlarmsLoading } = useNotification({
    pageSize: 100,
    deviceId: infoMenu?.id || "",
    enabled: !!infoMenu?.id
  });

  const startPolygonDrawing = () => {
    if (!isEditMode) {
      setIsEditMode(true);
    }

    const activatePolygonMode = () => {
      if (drawingManagerRef.current) {
        try {
          drawingManagerRef.current.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
          return true;
        } catch (error) {
          return false;
        }
      }
      return false;
    };

    if (activatePolygonMode()) {
      return;
    }

    let attempts = 0;
    const maxAttempts = 30;

    const checkDrawingManager = () => {
      attempts++;

      if (activatePolygonMode()) {
        return;
      }

      if (attempts < maxAttempts) {
        setTimeout(checkDrawingManager, 100);
      } else {
        setTimeout(() => {
          activatePolygonMode();
        }, 500);
      }
    };

    setTimeout(checkDrawingManager, isEditMode ? 100 : 300);
  };

  const [machineAssignments, setMachineAssignments] = useState<
    Record<string, string[]>
  >({});

  useEffect(() => {
    if (shapeInfos.length > 0) {
      const assignments: Record<string, string[]> = {};
      shapeInfos.forEach((shape) => {
        if (
          shape.assignedMachineSerials &&
          shape.assignedMachineSerials.length > 0
        ) {
          assignments[shape.id] = shape.assignedMachineSerials;
        }
      });
      setMachineAssignments(assignments);
    }
  }, [shapeInfos]);

  const [vehicles, setVehicles] = useState<ServiceLocation[]>([]);
  const [services, setServices] = useState<ServiceLocation[]>([]);
  const [displayedLocations, setDisplayedLocations] = useState<
    ServiceLocation[]
  >([]);
  const [showServices, setShowServices] = useState<boolean>(!!machineSerialNo || fromWarning);
  const [vehicleFilterConfig, setVehicleFilterConfig] = useState<any>(null);

  const [renderMap, setRenderMap] = useState(false);
  const [zoom, setZoom] = useState(() => {
    if (fromWarning) return 10;
    if (machineSerialNo && !fromWarning) return 17;
    if (shapeId && lat && long) return 12;
    if (lat && long && !shapeId) return 16;
    return 7;
  });

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
        type: shape.type as "polygon",
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

  const initialNearestService = useMemo(() => {
    if ((fromWarning || machineSerialNo) && lat && long) {
      const allServices = service_locations[0].allServices;
      const machineLat = parseFloat(lat);
      const machineLng = parseFloat(long);
      return findNearestService(machineLat, machineLng, allServices);
    }

    if (machineSerialNo) {
      const machine = machineStore.getAllMachines().find((m) => m.serialNo === machineSerialNo);
      if (machine && machine.lat && machine.long && fromWarning) {
        const allServices = service_locations[0].allServices;
        return findNearestService(machine.lat, machine.long, allServices);
      }
    }

    return null;
  }, [fromWarning, lat, long, machineSerialNo]);

  const center = useMemo(() => {
    if (initialNearestService && fromWarning) {
      return {
        lat: parseFloat(String(initialNearestService.lat)),
        lng: parseFloat(String(initialNearestService.long)),
      };
    }

    if (machineSerialNo && !fromWarning) {
      const machine = machineStore.getAllMachines().find((m) => m.serialNo === machineSerialNo);
      if (machine && machine.lat && machine.long) {
        return {
          lat: machine.lat,
          lng: machine.long,
        };
      }
    }

    if (displayedLocations.length === 0) {
      return { lat: 39.0, lng: 35.0 };
    }

    const lats = displayedLocations
      .map((m) => m.latitude)
      .filter((lat) => lat !== 0);
    const lngs = displayedLocations
      .map((m) => m.longitude)
      .filter((lng) => lng !== 0);

    if (lats.length === 0 || lngs.length === 0) {
      return { lat: 39.0, lng: 35.0 };
    }

    return {
      lat: 39.0,
      lng: 35.0,
    };
  }, [displayedLocations, fromWarning, initialNearestService, machineSerialNo]);

  // Servis noktalarını yükle (statik veri, sadece bir kez)
  useEffect(() => {
    const serviceLocations = service_locations[0].localServices.map(
      (service) => ({
        id: machineStore.getAllMachines().length + service.id || 0,
        serviceId: service.id || 0,
        name: service.name || "",
        type: "service",
        visible: true,
        latitude: parseFloat(service.lat as unknown as string) || 0,
        longitude: parseFloat(service.long as unknown as string) || 0,
        hours: 0,
        contact: service.authorizedPerson || "",
        maintenance: service.address || "",
        operator: typeof service.phone === "string" ? service.phone : "",
      })
    );
    setServices(serviceLocations as ServiceLocation[]);
  }, []);

  useEffect(() => {
    const fetchTimerSetting = async () => {
      if (!userID) return;

      try {
        const timerValue = await getTimerSetting(userID);
        if (timerValue !== null) {
          setTimerInterval(timerValue);

        }
        setIsTimerLoaded(true);
      } catch (error) {
        console.error("Timer ayarı alınırken hata:", error);
        setTimerInterval(1);
        setIsTimerLoaded(true);
      }
    };

    fetchTimerSetting();
  }, [userID]);

  const isMapRefreshing = useRef(false);

  // Store'dan güncel vehicle locations'ı yeniden oluştur
  const rebuildVehicleLocations = useCallback(() => {
    const vehicleLocations = machineStore.getAllMachines().map((machine) => {
      const statValue = deviceWorkStore.getTelemetry(machine.id, "stat").at(-1)?.value;
      const isActive = statValue != null && Number(statValue) > 0;

      const isCurrentUrlMachine = machineSerialNo && machine.serialNo === machineSerialNo;
      const finalLat = isCurrentUrlMachine && lat ? parseFloat(lat) : (machine.lat || 0);
      const finalLong = isCurrentUrlMachine && long ? parseFloat(long) : (machine.long || 0);

      return {
        id: machine.id || 0,
        deviceName: machine.deviceName,
        type: machine.type || "",
        visible: true,
        latitude: finalLat,
        longitude: finalLong,
        hours: machine.totalWorkingHours
          ? machine.totalWorkingHours.toString()
          : "",
        instantFuel: machine.instantFuel,
        totalUsedFuel: machine.totalUsedFuel,
        contact: machine.model || "",
        maintenance: machine.serialNo || "",
        state: isActive,
        operator: Array.isArray(machine.user_fullname)
          ? machine.user_fullname.join(", ")
          : machine.user_fullname || "",
      };
    });
    setVehicles(vehicleLocations as ServiceLocation[]);
  }, [machineSerialNo, lat, long]);

  useEffect(() => {
    // Timer ayarı yüklenene kadar başlatma
    if (!isTimerLoaded) return;

    const refreshAndRebuild = async () => {
      // Eğer zaten bir refresh işlemi devam ediyorsa, yeni istek atma
      if (isMapRefreshing.current) return;

      isMapRefreshing.current = true;
      try {
        // Tüm cihazların telemetri verilerini toplu olarak güncelle (lat/long/RPM/stat vs.)
        await refreshAllTelemetry();
        // Güncellenmiş store'dan vehicle locations'ı yeniden oluştur
        rebuildVehicleLocations();
      } catch (error) {
        console.error("Map telemetry refresh error:", error);
      } finally {
        isMapRefreshing.current = false;
      }
    };

    // İlk yüklemede hemen çalıştır
    rebuildVehicleLocations();

    // Sonra interval ile devam et (timerInterval saniye cinsinden)
    const reload = setInterval(refreshAndRebuild, timerInterval * 1000);
    return () => clearInterval(reload);
  }, [isTimerLoaded, timerInterval, rebuildVehicleLocations]);

  const updateDisplayedLocations = useCallback(() => {
    let filteredVehicles = [...vehicles];
    if (machineSerialNo) {
      filteredVehicles = filteredVehicles.filter(v => v.maintenance === machineSerialNo);
    } else if (vehicleFilterConfig) {
      filteredVehicles = vehicles
        .map((vehicle) => ({
          ...vehicle,
          visible: isVehicleVisible(vehicle.id, vehicleFilterConfig),
        }))
        .filter((vehicle) => vehicle.visible);
    }
    const newLocations = showServices
      ? [...filteredVehicles, ...services]
      : [...filteredVehicles];
    setDisplayedLocations(newLocations as ServiceLocation[]);
  }, [vehicles, services, vehicleFilterConfig, showServices, machineSerialNo]);

  useEffect(() => {
    if (vehicles.length > 0 || services.length > 0) {
      updateDisplayedLocations();
    }
  }, [
    showServices,
    vehicleFilterConfig,
    vehicles,
    services,
    updateDisplayedLocations,
  ]);



  useEffect(() => {
    if (googleMap) {
      try {
        (googleMap as any).setMapId(isDarkMode ? MAP_IDS[3] : MAP_IDS[0]);

        const projectionTimeout = setTimeout(() => {
          const idleListener = googleMap.addListener("idle", () => {
            if (googleMap.getProjection()) {
              updateDisplayedLocations();
              google.maps.event.removeListener(idleListener);
            }
          });

          setTimeout(() => {
            google.maps.event.removeListener(idleListener);
          }, 5000);
        }, 300);

        return () => {
          clearTimeout(projectionTimeout);
        };
      } catch (error) {
        console.error(
          "Dark mode değişiminde harita güncellenirken hata:",
          error
        );
      }
    }
  }, [isDarkMode, googleMap, updateDisplayedLocations]);

  const isVehicleVisible = (vehicleId: number, filterConfig: any) => {
    const controlData: any[] = [];

    const selectedVehicleIds = filterConfig.map((vehicle: any) =>
      vehicle.children.find(
        (child: any) => child.id == vehicleId && child.checked == true
      )
    );
    selectedVehicleIds.forEach((id: any) => {
      if (id) {
        controlData.push(id);
      }
    });
    return controlData.length > 0;
  };

  const handleFilterChange = (selectedVehicles: any) => {
    setVehicleFilterConfig(selectedVehicles);
  };

  const handleAssignmentChange = async (assignments: Record<string, string[]>) => {
    const entityType = userStore.entityType || "DEVICE";

    // Önceki tüm atanmış makine ID'lerini topla
    const previousMachineIds = new Set<string>();
    Object.values(machineAssignments).forEach((ids: any) => {
      if (Array.isArray(ids)) {
        ids.forEach((id: string) => previousMachineIds.add(id));
      }
    });

    // Yeni tüm atanmış makine ID'lerini topla
    const newMachineIds = new Set<string>();
    Object.values(assignments).forEach((ids) => {
      ids.forEach((id) => newMachineIds.add(id));
    });

    // Çıkarılan makineler (önceki atamalarda var, yeni atamalarda yok)
    const removedMachineIds = Array.from(previousMachineIds).filter(
      (id) => !newMachineIds.has(id)
    );

    setMachineAssignments(assignments);

    setShapeInfos((prevShapes) => {
      const updatedShapes = prevShapes.map((shape) => {
        const assignedMachineSerials = assignments[shape.id] || [];
        return {
          ...shape,
          assignedMachineSerials: assignedMachineSerials,
        };
      });

      // API'ye kaydet
      syncShapesToAPI(updatedShapes);

      // Yeni atamalardaki cihazlar için perimeter güncelle
      updatedShapes.forEach((shape) => {
        if (shape.assignedMachineSerials && shape.assignedMachineSerials.length > 0) {
          const polygon = shape.shape as google.maps.Polygon;
          const path = polygon.getPath().getArray();
          const coordinates = path.map((latLng): [number, number] => [latLng.lat(), latLng.lng()]);

          shape.assignedMachineSerials.forEach((machineId) => {
            saveWorkingAreasToDevice(machineId, JSON.stringify(coordinates), entityType);
          });
        }
      });

      return updatedShapes;
    });

    // Çıkarılan makineler için perimeter'ı temizle
    for (const machineId of removedMachineIds) {
      await saveWorkingAreasToDevice(machineId, JSON.stringify([]), entityType);
    }
  };

  const handleServiceClick = (showServicesFlag: boolean) => {
    setShowServices(showServicesFlag);
  };

  useEffect(() => {
    setRenderMap(true);
  }, []);

  useEffect(() => {
    if (machineSerialNo) {
      const machine = machineStore
        .getAllMachines()
        .find((m) => m.serialNo === machineSerialNo);

      if (machine) {
        setSelectedMachineId(machine.id);

        // Servis noktalarını silme - hem filo hem uyarı ekranından gelince servisler görünür olmalı
        // setServices([]) kaldırıldı

        setInfoMenu({
          serialNo: machine.serialNo,
          entityType: machine.entityType,
          deviceName: machine.deviceName,
          totalHours: machine.totalWorkingHours,
          operator: machine.user_fullname,
          lock: true,
          type: machine.type,
          saseNo: machine.serialNo,
          id: machine.id,
          instantFuel: machine.instantFuel,
          totalUsedFuel: machine.totalUsedFuel,
          title: `- ${machine.model}`,
        });

        if (fromWarning && machine.lat && machine.long) {
          const allServices = service_locations[0].allServices;
          const nearest = findNearestService(machine.lat, machine.long, allServices);

          if (nearest) {
            setNearestService(nearest);

            const nearestServiceLocation = {
              id: String(machineStore.getAllMachines().length + nearest.id) || "0",
              serviceId: nearest.id || 0,
              name: nearest.name || "",
              type: "service",
              visible: true,
              latitude: parseFloat(String(nearest.lat)) || 0,
              longitude: parseFloat(String(nearest.long)) || 0,
              hours: "0",
              contact: nearest.authorizedPerson || "",
              maintenance: nearest.address || "",
              operator: Array.isArray(nearest.phone) ? nearest.phone[0] : nearest.phone || "",
            } as unknown as ServiceLocation;

            setServices([nearestServiceLocation]);

            setServiceInfoMenu({
              title: nearest.name || "",
              operatorName: nearest.authorizedPerson || "",
              address: nearest.address || "",
              phoneNumber: Array.isArray(nearest.phone) ? nearest.phone[0] : nearest.phone || "",
              email: nearest.email || "",
            });
          }
        }
      }
    }
  }, [machineSerialNo, fromWarning]);

  useEffect(() => {
    if (fromWarning && lat && long && !machineSerialNo) {
      const allServices = service_locations[0].allServices;
      const machineLat = parseFloat(lat);
      const machineLng = parseFloat(long);
      const nearest = findNearestService(machineLat, machineLng, allServices);

      if (nearest) {
        setNearestService(nearest);

        const nearestServiceLocation = {
          id: String(machineStore.getAllMachines().length + nearest.id) || "0",
          serviceId: nearest.id || 0,
          name: nearest.name || "",
          type: "service",
          visible: true,
          latitude: parseFloat(String(nearest.lat)) || 0,
          longitude: parseFloat(String(nearest.long)) || 0,
          hours: "0",
          contact: nearest.authorizedPerson || "",
          maintenance: nearest.address || "",
          operator: Array.isArray(nearest.phone) ? nearest.phone[0] : nearest.phone || "",
        } as unknown as ServiceLocation;

        setServices([nearestServiceLocation]);

        setServiceInfoMenu({
          title: nearest.name || "",
          operatorName: nearest.authorizedPerson || "",
          address: nearest.address || "",
          phoneNumber: Array.isArray(nearest.phone) ? nearest.phone[0] : nearest.phone || "",
          email: nearest.email || "",
        });
      }
    }
  }, [fromWarning, lat, long, machineSerialNo]);

  useEffect(() => {
    if (!googleMap) return;

    if (fromWarning && nearestService) {
      const serviceLat = parseFloat(String(nearestService.lat));
      const serviceLng = parseFloat(String(nearestService.long));
      const mLat = lat ? parseFloat(lat) : null;
      const mLng = long ? parseFloat(long) : null;

      const focusOnService = () => {
        if (mLat !== null && mLng !== null) {
          const bounds = new google.maps.LatLngBounds();
          bounds.extend({ lat: serviceLat, lng: serviceLng });
          bounds.extend({ lat: mLat, lng: mLng });
          setTimeout(() => {
            googleMap.fitBounds(bounds, 100);
          }, 500); // Harita boyutlarının tam yüklenmesi için kısa bir gecikme
        } else {
          setTimeout(() => {
            googleMap.setCenter({ lat: serviceLat, lng: serviceLng });
            googleMap.setZoom(17);
          }, 500);
        }
      };

      if (googleMap.getProjection()) {
        focusOnService();
      } else {
        const idleListener = googleMap.addListener("idle", () => {
          focusOnService();
          google.maps.event.removeListener(idleListener);
        });
      }
      return;
    }

    if (machineSerialNo && !fromWarning) {
      const machine = machineStore
        .getAllMachines()
        .find((m) => m.serialNo === machineSerialNo);

      if (machine && machine.lat && machine.long) {
        const focusOnMachine = () => {
          googleMap.setCenter({ lat: machine.lat, lng: machine.long });
          googleMap.setZoom(17);
        };

        if (googleMap.getProjection()) {
          focusOnMachine();
        } else {
          const idleListener = googleMap.addListener("idle", () => {
            focusOnMachine();
            google.maps.event.removeListener(idleListener);
          });
        }
      }
    }
  }, [googleMap, nearestService, machineSerialNo, fromWarning]);

  if (!renderMap) {
    return <div className="relative w-full h-screen">Loading map...</div>;
  }

  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const handleOnLoad = (event: any) => {
    if (event.detail && event.detail.map) {
      setGoogleMap(event.detail.map);
    }
  };

  const toggleShapeVisibility = (id: string) => {
    setShapeInfos((prevShapes) =>
      prevShapes.map((shapeInfo) => {
        if (shapeInfo.id === id) {
          const newVisibility = !shapeInfo.visible;

          try {
            if (shapeInfo.type === "polygon") {
              const shape = shapeInfo.shape as google.maps.Polygon;
              shape.setOptions({
                fillOpacity: newVisibility ? 0.3 : 0,
                strokeOpacity: newVisibility ? 1 : 0,
              });
            }
          } catch (error) {
            console.error("Şekil görünürlüğü değiştirilirken hata:", error);
          }

          return { ...shapeInfo, visible: newVisibility };
        }
        return shapeInfo;
      })
    );
  };

  const deleteShape = (id: string) => {
    const shapeToDelete = shapeInfos.find((s) => s.id === id);
    if (shapeToDelete) {
      shapeToDelete.shape.setMap(null);
      setShapeInfos((prevShapes) => {
        const updated = prevShapes.filter((s) => s.id !== id);
        syncShapesToAPI(updated);
        return updated;
      });
    }
  };

  const renameShape = async (id: string, newName: string) => {
    setShapeInfos((prev) => {
      const updated = prev.map((shape) =>
        shape.id === id ? { ...shape, name: newName } : shape
      );
      syncShapesToAPI(updated);
      return updated;
    });
  };

  const colorChangeShape = (id: string, newColor: string) => {
    setShapeInfos((prev) => {
      const updated = prev.map((shape) => {
        if (shape.id === id) {
          const s = shape.shape;
          if (shape.type === "polygon") {
            (s as any).setOptions({
              fillColor: newColor,
              strokeColor: newColor,
            });
          }
          return { ...shape, color: newColor };
        }
        return shape;
      });

      syncShapesToAPI(updated);

      return updated;
    });
  };

  const getRandomColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 50%)`;
  };

  const markerClick = (
    id: string,
    visible: boolean,
    type?: string,
    serviceId?: number
  ) => {
    if (visible) {
      setInfoMenu(null);
      setServiceInfoMenu(null);
      const machine = machineStore.getAllMachines().find((m) => m.id === id);
      setSelectedMachineId(id);
      if (machine) {
        setInfoMenu({
          serialNo: machine.serialNo,
          deviceName: machine.deviceName,
          totalHours: machine.totalWorkingHours,
          operator: machine.user_fullname,
          lock: true,
          type: machine.type,
          saseNo: machine.serialNo,
          id: machine.id,
          instantFuel: machine.instantFuel,
          totalUsedFuel: machine.totalUsedFuel,
          title: `- ${machine.model}`,
        });
      }

      if (type === "service") {
        const service = service_locations[0].allServices.find(
          (s) => s.id === serviceId
        );
        setServiceInfoMenu({
          title: service?.name || "",
          operatorName: service?.authorizedPerson || "",
          address: service?.address || "",
          phoneNumber: service?.phone.shift() || "",
          email: service?.email || "",
        });
      }
    }
  };

  const engFuelUsed = deviceWorkStore
    .getTelemetry(selectedMachineId, "EngTotalFuelUsed")
    .at(-1)?.value;
  const engHours = deviceWorkStore
    .getTelemetry(selectedMachineId, "EngineTotalHours")
    .at(-1)?.value;

  const avgFuel =
    engFuelUsed && engHours && engHours !== 0
      ? `${(engFuelUsed / engHours).toFixed(2)} ${t("global.L/h")}`
      : "-";
  const instantFuelValue = deviceWorkStore
    .getTelemetry(selectedMachineId, "EngFuelRate")
    .at(-1)?.value;

  const instantFuel =
    typeof instantFuelValue === "number" && !isNaN(instantFuelValue)
      ? `${instantFuelValue.toFixed(2)} ${t("global.L/h")}`
      : "-";

  const totalHours =
    typeof engHours === "number" && !isNaN(engHours)
      ? `${engHours.toFixed(2)} ${t("global.h")}`
      : "-";

  return (
    <div className="flex flex-col w-full h-full">
      <GeneralTitle title={t("mapPage.map")} />
      <div className="bg-white rounded-[20px] h-[inherit] border-[3px] filter drop-shadow-[2px_2px_4px_#00000026] border-white dark:bg-gray10 dark:border-gray10">
        <div className="relative w-full h-full bg-white dark:bg-gray10 rounded-[20px] overflow-hidden">
          <APIProvider apiKey={API_KEY} libraries={["drawing"]} version="3.64">
            <Map
              id="map"
              style={{ width: "auto", height: "100%" }}
              defaultCenter={
                initialNearestService && fromWarning
                  ? {
                    lat: parseFloat(String(initialNearestService.lat)),
                    lng: parseFloat(String(initialNearestService.long))
                  }
                  : lat && long
                    ? { lat: parseFloat(lat), lng: parseFloat(long) }
                    : center
              }
              zoom={zoom}
              keyboardShortcuts={false}
              gestureHandling={"greedy"}
              disableDefaultUI={true}
              clickableIcons={false}
              mapId={isDarkMode ? MAP_IDS[3] : MAP_IDS[0]}
              onZoomChanged={(ev) => setZoom(ev.detail.zoom)}
              onTilesLoaded={handleOnLoad}
              onIdle={handleOnLoad}
              mapTypeControl={true}
              mapTypeId={"hybrid"}
              onClick={() => {
                setServiceInfoMenu(null);
                setInfoMenu(null);
              }}
            >
              <SetupMapControls></SetupMapControls>
              <ClusteredMarkers
                locations={displayedLocations}
                onMarkerClick={(
                  id: number,
                  visible: boolean | undefined,
                  type?: string,
                  serviceId?: number
                ) =>
                  markerClick(
                    id,
                    visible || false,
                    type || undefined,
                    serviceId || undefined
                  )
                }
              />

              <CustomZoomControl
                controlPosition={ControlPosition.INLINE_END_BLOCK_END}
                zoom={zoom}
                onZoomChange={setZoom}
                isEditActive={false}
                onEditClick={() => setIsEditMode(true)}
              />

              <DrawingManagerControl
                ref={drawingManagerRef}
                shapeInfos={shapeInfos}
                isEditMode={isEditMode}
                setShapeInfos={setShapeInfos}
                setPrevShapeInfos={setPrevShapeInfos}
                getRandomColor={getRandomColor}
                newShapeName={newShapeName}
                shapeCountRef={shapeCountRef}
                googleMap={googleMap}
                onEditModeChange={setIsEditMode}
                prevShapeInfos={prevShapeInfos}
              />
            </Map>
          </APIProvider>

          {isEditMode == true && (
            <div className="absolute z-20 top-4 left-4">
              <SpacesWithDevices
                shapeInfos={shapeInfos}
                machineAssignments={machineAssignments}
                machineList={machineStore.getAllMachines()}
                onToggleVisibility={toggleShapeVisibility}
                onDelete={deleteShape}
                onServiceClick={handleServiceClick}
                onRename={renameShape}
                onColorChange={colorChangeShape}
                onAssignmentChange={handleAssignmentChange}
                onStartPolygonDrawing={startPolygonDrawing}
                showServices={showServices}
              />
            </div>
          )}

          {isEditMode == false && (
            <>
              <div className="absolute z-20 top-4 left-4">
                <TreeCheckbox onChange={handleFilterChange} />
              </div>
              <div className="absolute z-20 bottom-4 left-4">
                <WorkSpaceWithShapes
                  shapeInfos={shapeInfos}
                  onToggleVisibility={toggleShapeVisibility}
                  onDelete={deleteShape}
                  onServiceClick={(isService: boolean) =>
                    handleServiceClick(isService)
                  }
                  onRename={renameShape}
                  onColorChange={colorChangeShape}
                  showServices={showServices}
                />
              </div>
            </>
          )}

          <div className="absolute z-20 top-4 right-4 ">
            {infoMenu && (
              <div className="bg-white dark:bg-gray10 p-[20px] rounded-[10px] filter font-inter min-w-[270px] w-full drop-shadow-[2px_2px_4px_#00000026] ">
                <InfoMenu
                  id={infoMenu.id}
                  entityName={infoMenu.entityType}
                  serialNo={infoMenu.serialNo}
                  title={infoMenu.title}
                  totalHours={totalHours}
                  operator={infoMenu.operator}
                  lock={infoMenu.lock}
                  deviceWarnings={vehicleAlarms.filter((alarm) => alarm.severity === 'CRITICAL')}
                  isWarningsLoading={isVehicleAlarmsLoading}
                  avgFuel={avgFuel}
                  instantFuel={instantFuel}
                  trip={
                    (infoMenu?.parameters?.totalFuelConsumption?.toFixed(2) ||
                      "0") +
                    " " +
                    t("global.L/h")
                  }
                  defAmount={infoMenu.defAmount || ""}
                  hydraulicPressure={infoMenu.hydraulicPressure || ""}
                  hydOilHeat={infoMenu.hydOilHeat || ""}
                  engineWaterHeat={infoMenu.engineWaterHeat || ""}
                  saseNo={infoMenu.saseNo || ""}
                  type={infoMenu.type}
                  warnings={[]}
                  className="h-auto border-none"
                  warningClassName="h-auto min-h-[130px] mb-1"
                  onBackButtonClick={() => {
                    navigation(`/vehicle/${infoMenu.id}`);
                  }}
                  deviceName={infoMenu.deviceName}
                  onClose={() => setInfoMenu(null)}
                />
              </div>
            )}

            {serviceInfoMenu && (
              <div className="bg-white dark:bg-gray10 p-[20px] rounded-[10px] filter font-inter min-w-[270px] w-full drop-shadow-[2px_2px_4px_#00000026] ">
                <ServiceInfoCard
                  onBackButtonClick={() => setServiceInfoMenu(null)}
                  className="h-auto border-none"
                  title={serviceInfoMenu.title}
                  address={serviceInfoMenu.address}
                  operatorName={serviceInfoMenu.operatorName}
                  phoneNumber={serviceInfoMenu.phoneNumber}
                  email={serviceInfoMenu.email}
                  website={serviceInfoMenu.website}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;