import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  APIProvider,
  ControlPosition,
  Map,
  MapControl,
} from "@vis.gl/react-google-maps";
import { useDarkMode } from "../../context/DarkModeContext";
import { CustomZoomControl } from "../../components/MapControl";
import TreeCheckbox from "../../components/TreeCheckbox";
import GeneralTitle from "../../components/Title/GeneralTitle";
import InfoMenu from "../../components/InfoMenu/InfoMenu";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import WorkSpaceWithShapes from "../../components/WorkSpaceWithShapes";
import service_locations from "../../data/ServiceData";
import { ClusteredMarkers } from "../../components/ClusteredMarkers";
import { useSearchParams } from "react-router-dom";
import {
  MAP_IDS,
  ServiceLocation,
  ShapeInfo,
  MapInfoMenu,
  MapServiceInfo,
} from "../../utils/map";
import ServiceInfoCard from "../../components/ServiceInfoCard";
import { useNavigate } from "react-router-dom";
import { SvgIcons } from "../../assets/icons/SvgIcons";
import { useTranslation } from "react-i18next";
import machineStore from "../../store/MachineStore";
import deviceWorkStore from "../../store/DeviceTelemetry";
import SetupMapControls from "./SetupMapControls";
import {
  getUserId,
  saveWorkingAreasToAsset,
  getWorkingAreasFromAsset,
  saveWorkingAreasToDevice,
} from "../../services/auth";
import SpacesWithDevices from "../../components/WorkSpaceWithShapes/spacesWithDevices";
import { useNotification } from "../../hooks/useNotification";

// FocusShape helper component - Map içinde useMap hook'unu kullanır
interface FocusShapeHelperProps {
  shapeInfos: ShapeInfo[];
  focusShapeId: string | null;
  onFocusComplete: () => void;
}

const FocusShapeHelper: React.FC<FocusShapeHelperProps> = ({
  shapeInfos,
  focusShapeId,
  onFocusComplete,
}) => {
  const map = useMap();

  useEffect(() => {
    if (!focusShapeId || !map) return;

    try {
      const shape = shapeInfos.find((s) => s.id === focusShapeId);

      if (shape && shape.type === "polygon") {
        const bounds = new google.maps.LatLngBounds();
        const polygon = shape.shape as google.maps.Polygon;
        const path = polygon.getPath();
        
        path.forEach((latLng) => bounds.extend(latLng));
        
        // Önce bounds'a fit et (daha az padding ile daha yakın zoom)
        map.fitBounds(bounds);
        
        // Kısa bir gecikmeyle zoom seviyesini kontrol et ve gerekirse ayarla
        // shahe boyutuna göre zoom seviyesi ayarla

        setTimeout(() => {
          const currentZoom = map.getZoom();
          if (currentZoom && currentZoom < 16) {
            // Minimum zoom 15 olsun
            map.setZoom(16);
          }
        }, 100);
      }
    } catch (error) {
      console.error("FocusShapeHelper hatası:", error);
    }

    onFocusComplete();
  }, [focusShapeId, map, shapeInfos, onFocusComplete]);

  return null;
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
  const [focusShapeId, setFocusShapeId] = useState<string | null>(null);

  const [searchParams] = useSearchParams();
  const [mapKey, setMapKey] = useState(0);
  const lat = searchParams.get("lat");
  const long = searchParams.get("long");
  const fromWarning = searchParams.get("fromWarning") === "true";
  const machineSerialNo = searchParams.get("machineSerialNo");



    const drawingManagerRef = useRef<google.maps.drawing.DrawingManager | null>(null);

    const startPolygonDrawing = () => {
  console.log("startPolygonDrawing çağrıldı, mevcut edit mode:", isEditMode);
  
  // Önce edit modunu aktif hale getirin
  if (!isEditMode) {
    console.log("Edit mode aktifleştiriliyor...");
    setIsEditMode(true);
  }
  
  // DrawingManager'ın hazır olmasını bekleyin
  const activatePolygonMode = () => {
    if (drawingManagerRef.current) {
      console.log("DrawingManager bulundu, polygon modu aktifleştiriliyor");
      try {
        drawingManagerRef.current.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
        return true;
      } catch (error) {
        console.error("Polygon modu aktifleştirilemedi:", error);
        return false;
      }
    }
    console.log("DrawingManager henüz hazır değil");
    return false;
  };

  // Eğer DrawingManager hazırsa hemen aktif et
  if (activatePolygonMode()) {
    return;
  }

  // Değilse kısa aralıklarla kontrol et
  let attempts = 0;
  const maxAttempts = 30; // 3 saniye boyunca dene
  
  const checkDrawingManager = () => {
    attempts++;
    console.log(`DrawingManager kontrolü - Deneme ${attempts}/${maxAttempts}`);
    
    if (activatePolygonMode()) {
      console.log("DrawingManager hazır oldu, polygon modu aktifleştirildi");
      return;
    }
    
    if (attempts < maxAttempts) {
      setTimeout(checkDrawingManager, 100); // 100ms bekle ve tekrar dene
    } else {
      console.warn("DrawingManager hazır olmadı, maksimum deneme sayısına ulaşıldı");
      // Son bir deneme daha yap
      setTimeout(() => {
        console.log("Son deneme yapılıyor...");
        activatePolygonMode();
      }, 500);
    }
  };

  // Kısa bir gecikme ile kontrol etmeye başla
  setTimeout(checkDrawingManager, isEditMode ? 100 : 300);
};

  const [machineAssignments, setMachineAssignments] = useState<
    Record<string, number[]>
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

  // Temel veri state'leri
  const [vehicles, setVehicles] = useState<ServiceLocation[]>([]); // Araç lokasyonları
  const [services, setServices] = useState<ServiceLocation[]>([]); // Servis lokasyonları
  const [displayedLocations, setDisplayedLocations] = useState<
    ServiceLocation[]
  >([]); // Gösterilen lokasyonlar
  const [showServices, setShowServices] = useState<boolean>(false); // Servislerin gösterilip gösterilmeyeceği (varsayılan: gizli)
  const [vehicleFilterConfig, setVehicleFilterConfig] = useState<any>(null); // Araç filtre konfigürasyonu
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null); // Seçilen şekil id'si
  const [renderMap, setRenderMap] = useState(false);
  const [zoom, setZoom] = useState(() => {
    if (fromWarning) return 10;
    if (lat && long) return 16;
    return 7;
  });

  // Araçların alarm verilerini yükle
  const { alarms: vehicleAlarms } = useNotification({
    autoRefresh: true,
    pageSize: 100,
    deviceId: selectedMachineId
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

  useEffect(() => {
    console.log("burada user id", userID);
  }, [userID]);

  const syncShapesToAPI = async (shapes: ShapeInfo[]) => {
    const formattedShapes = shapes.map((shape) => {
      const path = (shape.shape as google.maps.Polygon)
        .getPath()
        .getArray()
        .map((latLng) => ({
          lat: latLng.lat(),
          lng: latLng.lng(),
        }));

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

  // findCenter fonksiyonunu useMemo içinde tanımlayın - koşullu ifadelerden önce
  const center = useMemo(() => {
    if (displayedLocations.length === 0) {
      return { lat: 39.0, lng: 35.0 }; // Varsayılan merkez (Türkiye)
    }

    const lats = displayedLocations
      .map((m) => m.latitude)
      .filter((lat) => lat !== 0);
    const lngs = displayedLocations
      .map((m) => m.longitude)
      .filter((lng) => lng !== 0);

    if (lats.length === 0 || lngs.length === 0) {
      return { lat: 39.0, lng: 35.0 }; // Varsayılan merkez (Türkiye)
    }

    return {
      lat: 39.0,
      lng: 35.0,
    };
  }, [displayedLocations]);

  // İlk veri yükleme
  useEffect(() => {
    // Araçların verilerini yükle
    const vehicleLocations = machineStore.getAllMachines().map((machine) => ({
      id: machine.id || 0,
      deviceName: machine.deviceName,
      type: machine.subtype === "Develon" ? "Develon" : machine.type || "",
      visible: true,
      latitude: machine.lat || 0,
      longitude: machine.long || 0,
      hours: machine.totalWorkingHours
        ? machine.totalWorkingHours.toString()
        : "",
      instantFuel: machine.instantFuel,
      totalUsedFuel: machine.totalUsedFuel,
      contact: machine.model || "",
      maintenance: machine.serialNo || "",
      state: deviceWorkStore.getTelemetry(machine.id, "stat").at(-1)?.value,
      operator: Array.isArray(machine.user_fullname)
        ? machine.user_fullname.join(", ")
        : machine.user_fullname || "",
    }));

    // Servislerin verilerini yükle
    const serviceLocations = service_locations[0].allServices.map(
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

    // Ham verileri kaydet
    setVehicles(vehicleLocations as ServiceLocation[]);
    setServices(serviceLocations as ServiceLocation[]);

    // Başlangıçta tüm lokasyonları göster (ve direk referans olarak kullan)
    const allLocations = [
      ...vehicleLocations,
      ...serviceLocations,
    ] as ServiceLocation[];
    setDisplayedLocations(allLocations);
  }, []);


  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayedLocations((prevLocations) =>
        prevLocations.map((location) => {
          if (location.type !== "service") {
            return {
              ...location,
              state: (deviceWorkStore.getTelemetry(location.id as string, "stat").at(-1)?.value || false) as boolean,
            };
          }
          return location;
        })
      );
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Sadece marker ekleme/silme gibi yapısal değişikliklerde haritayı yenile
  // State değişikliklerinde (marker rengi vs.) haritayı yeniden render etme
  const locationIds = useMemo(() => 
    displayedLocations.map(loc => loc.id).sort().join(','), 
    [displayedLocations]
  );
  
  useEffect(() => {
    setMapKey(prev => prev + 1);
  }, [locationIds]);

  // Filtreleme ve görüntüleme durumları değiştiğinde lokasyonları güncelle
  const updateDisplayedLocations = useCallback(() => {
    // 1. Araçları filtrele
    let filteredVehicles = [...vehicles];
    // Eğer araç filtresi varsa uygula
    if (vehicleFilterConfig) {
      filteredVehicles = vehicles
        .map((vehicle) => ({
          ...vehicle,
          visible: isVehicleVisible(vehicle.id, vehicleFilterConfig),
        }))
        .filter((vehicle) => vehicle.visible);
    }
    // 2. Servisleri ekle veya hariç tut
    const newLocations = showServices
      ? [...filteredVehicles, ...services]
      : [...filteredVehicles];
    // 3. Görüntülenen lokasyonları güncelle
    setDisplayedLocations(newLocations as ServiceLocation[]);
  }, [vehicles, services, vehicleFilterConfig, showServices]);

  // Bu hook'un bağımlılıklarını düzeltin
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

  // Dark mode değişikliğini izleyen bir effect ekleyin
  useEffect(() => {
    if (googleMap) {
      try {
        // Dark mode değiştiğinde haritayı yeniden başlatmak yerine sadece görsel stili değiştir
        // Type assertion for setMapId
        (googleMap as any).setMapId(isDarkMode ? MAP_IDS[3] : MAP_IDS[0]);

        // Projeksiyonun yeniden oluşturulmasını bekle
        const projectionTimeout = setTimeout(() => {
          // Harita içeriğini güncellemek için bir idle event ekleyin
          const idleListener = googleMap.addListener("idle", () => {
            // Projeksiyonun hazır olup olmadığını kontrol et
            if (googleMap.getProjection()) {
              updateDisplayedLocations();
              google.maps.event.removeListener(idleListener);
            }
          });

          // Temizlik fonksiyonu
          setTimeout(() => {
            google.maps.event.removeListener(idleListener);
          }, 5000); // 5 saniye sonra listener'ı temizle
        }, 300); // 300ms bekle

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

  // Bir aracın görünür olup olmadığını kontrol eden yardımcı fonksiyon
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

  // Araç filtresini güncelleyen fonksiyon
  const handleFilterChange = (selectedVehicles: any) => {
    setVehicleFilterConfig(selectedVehicles);
  };

  const handleAssignmentChange = (assignments: Record<string, string[]>) => {
    // Önce state'i güncelle (artık string[] - seri numaraları)
    setMachineAssignments(assignments);

    // Sonra shape bilgilerini güncelle ve API'ye kaydet
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
      return updatedShapes;
    });
  };

  // Servislerin gösterilip gösterilmeyeceğini değiştiren fonksiyon
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
      setSelectedMachineId(machine.id);

      if (machine) {
        setServices([]);
        setInfoMenu({
          serialNo: machine.serialNo,
          deviceName: machine.deviceName,
          totalHours: machine.totalWorkingHours,
          operator: machine.user_fullname,
          lock: true,
          type: machine.subtype === "Develon" ? "Develon" : machine.type || "",
          saseNo: machine.serialNo,
          //parameters: machine.parameters,
          id: machine.id,
          instantFuel: machine.instantFuel,
          totalUsedFuel: machine.totalUsedFuel,
          title: `- ${machine.model}`,
        });
      }
    }
  }, [machineSerialNo]);

  if (!renderMap) {
    return <div className="relative w-full h-screen">Loading map...</div>;
  }

  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Get map instance and store reference
  const handleOnLoad = (event: any) => {
    if (event.detail && event.detail.map) {
      setGoogleMap(event.detail.map);
    }
  };

  // Şekil görünürlüğünü değiştirme fonksiyonu - opaklık kullanarak
  const toggleShapeVisibility = (id: string) => {
    setShapeInfos((prevShapes) =>
      prevShapes.map((shapeInfo) => {
        if (shapeInfo.id === id) {
          const newVisibility = !shapeInfo.visible;

          try {
            // Şekil tipine göre görünürlüğü değiştir
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

  const focusShape = (id: string) => {
    // map üzerinde shape yaklaştır
    console.log("focusShape çağrıldı, id:", id);
    setFocusShapeId(id);
  };

  // Şekli silme fonksiyonu
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

  // Rastgele renk üreten fonksiyon
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
        //ikinci
        setInfoMenu({
          serialNo: machine.serialNo,
          deviceName: machine.deviceName,
          totalHours: machine.totalWorkingHours,
          operator: machine.user_fullname,
          lock: true,
          type: machine.subtype === "Develon" ? "Develon" : machine.type || "",
          saseNo: machine.serialNo,
          //parameters: machine.parameters,
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

  const deviceWarnings = vehicleAlarms.filter((alarm) => alarm.subtype !== "Develon" || alarm.cleared !== true || alarm.acknowledged !== true);

  return (
    <div className="flex flex-col w-full h-full">
      <GeneralTitle title={t("mapPage.map")} />
      <div className="bg-white rounded-[20px] h-[inherit] border-[3px] filter drop-shadow-[2px_2px_4px_#00000026] border-white dark:bg-gray10 dark:border-gray10">
        <div className="relative w-full h-full bg-white dark:bg-gray10 rounded-[20px] overflow-hidden">
          <APIProvider apiKey={API_KEY} libraries={["drawing"]}>
            <Map
               key={`map-${mapKey}-${displayedLocations.length}`}
              id="map"
              style={{ width: "auto", height: "100%" }}
              defaultCenter={
                lat && long
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
              mapTypeId={"roadmap"}
              onClick={() => {
                setServiceInfoMenu(null);
                setInfoMenu(null);
              }}
            >
              <SetupMapControls></SetupMapControls>
              <FocusShapeHelper
                shapeInfos={shapeInfos}
                focusShapeId={focusShapeId}
                onFocusComplete={() => setFocusShapeId(null)}
              />
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
  ref={drawingManagerRef} // Bu satırı ekleyin
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
                onFocusShape={focusShape}
                onDelete={deleteShape}
                onServiceClick={handleServiceClick}
                onRename={renameShape}
                onColorChange={colorChangeShape}
                onAssignmentChange={handleAssignmentChange}
                onStartPolygonDrawing={startPolygonDrawing}
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
                  onFocusShape={focusShape}
                />
              </div>
            </>
          )}

          <div className="absolute z-20 top-4 right-4 ">
            {infoMenu && (
              <div className="bg-white dark:bg-gray10 p-[20px] rounded-[10px] filter font-inter min-w-[270px] w-full drop-shadow-[2px_2px_4px_#00000026] ">
                <InfoMenu
                  id={infoMenu.id}
                  serialNo={infoMenu.serialNo}
                  title={infoMenu.title}
                  totalHours={totalHours}
                  operator={infoMenu.operator}
                  lock={infoMenu.lock}
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
                  deviceWarnings={deviceWarnings} // ✅ Yeni prop

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

// DrawingManagerControl bileşenini forwardRef ile sarın
const DrawingManagerControl = React.forwardRef<
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

  // useEffect içinde drawingManagerRef.current'ı parent ref'e ata
  useEffect(() => {
    if (parentRef && typeof parentRef === 'object' && 'current' in parentRef) {
      parentRef.current = drawingManagerRef.current;
    }
  }, [parentRef]);

  // Her drawingManagerRef değiştiğinde parent ref'i güncelle
  useEffect(() => {
    if (parentRef && typeof parentRef === 'object' && 'current' in parentRef && drawingManagerRef.current) {
      parentRef.current = drawingManagerRef.current;
    }
  }, [parentRef, drawingManagerRef.current]);

  const getSavePayload = (updatedShapes: any[], originalShapes: any[]) => {
    const ignoreKeys = ["createdAt"];
    const machineCoordinateMap: any[] = [];
    const allMachineIds: string[] = [];

    // Build updated machine map
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

    // Shape comparison function
    const isMeaningfullyChanged = () => {
      if (updatedShapes.length !== originalShapes.length) return true;

      for (let i = 0; i < updatedShapes.length; i++) {
        const updated = { ...updatedShapes[i] };
        const original = { ...originalShapes[i] };

        ignoreKeys.forEach((key) => {
          delete updated[key];
          delete original[key];
        });

        // Normalize assignedMachineIds before comparing
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
    prevWorkingAreas: any
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
          saveWorkingAreasToDevice(element.machineId, element.coordinates);
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
        .map((latLng) => ({
          lat: latLng.lat(),
          lng: latLng.lng(),
        }));

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
        const polygon = new google.maps.Polygon({
          paths: item.coordinates,
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
  ) => {
    switch (type) {
      case google.maps.drawing.OverlayType.POLYGON:
        const polygon = overlay as google.maps.Polygon;
        const path = polygon.getPath();
        return path.getArray().map((latLng) => ({
          lat: latLng.lat(),
          lng: latLng.lng(),
        }));
      default:
        return null;
    }
  };

  // Drawing manager'ı oluştur
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
      map.setMapTypeId("roadmap");
    }

    drawingManagerRef.current = newDrawingManager;

    // Parent ref'i güncelle
    if (parentRef && typeof parentRef === 'object' && 'current' in parentRef) {
      parentRef.current = newDrawingManager;
    }

    // Çizim tamamlandığında çalışacak listener - EKSIK OLAN KOD BURASI!
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

        // count shape count
        shapeCountRef.current += 1;

        const newShapeInfo: ShapeInfo = {
          id: `shape-${Date.now()}`,
          name: `${newShapeName} ${shapeCountRef.current}`,
          color: randomColor,
          shape: event.overlay,
          visible: true,
          type: shapeType,
        };

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

  // Edit modu değiştiğinde drawing manager'ı güncelle
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
      saveWorkingAreasToAPI(userID, updatedShapeData, prevShapeInfos);
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

export default MapPage;
