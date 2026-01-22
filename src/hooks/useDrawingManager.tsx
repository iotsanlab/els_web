    import {useMap, useMapsLibrary} from '@vis.gl/react-google-maps';
import {useEffect, useState, useCallback} from 'react';

export function useDrawingManager(
  initialValue: google.maps.drawing.DrawingManager | null = null,
  isActive: boolean = false
) {
  const map = useMap();
  const drawing = useMapsLibrary('drawing');

  const [drawingManager, setDrawingManager] =
    useState<google.maps.drawing.DrawingManager | null>(initialValue);

  useEffect(() => {
    if (!map || !drawing) return;

    // https://developers.google.com/maps/documentation/javascript/reference/drawing
    const newDrawingManager = new drawing.DrawingManager({
      map: isActive ? map : null,
      drawingMode: null,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
            google.maps.drawing.OverlayType.POLYGON,
        ]
      },
      markerOptions: {
        draggable: true
      },
      circleOptions: {
        fillColor: '#ffbc00',
        fillOpacity: 0.3,
        strokeWeight: 2,
        strokeColor: '#ffbc00',
        editable: true
      },
      polygonOptions: {
        fillColor: '#ffbc00',
        fillOpacity: 0.3,
        strokeWeight: 2,
        strokeColor: '#ffbc00',
        editable: true,
        draggable: true
      },
      rectangleOptions: {
        fillColor: '#ffbc00',
        fillOpacity: 0.3,
        strokeWeight: 2,
        strokeColor: '#ffbc00',
        editable: true,
        draggable: true
      },
      polylineOptions: {
        strokeColor: '#ffbc00',
        strokeWeight: 2,
        editable: true,
        draggable: true
      }
    });

    setDrawingManager(newDrawingManager);

    return () => {
      newDrawingManager.setMap(null);
    };
  }, [drawing, map, isActive]);

  // Çizim modunu değiştirmek için yardımcı fonksiyon
  const setDrawingMode = useCallback((mode: google.maps.drawing.OverlayType | null) => {
    if (drawingManager) {
      drawingManager.setDrawingMode(mode);
    }
  }, [drawingManager]);

  // Çizim yöneticisini aktif/pasif yapmak için
  const toggleDrawingManager = useCallback((active: boolean) => {
    if (drawingManager && map) {
      drawingManager.setMap(active ? map : null);
    }
  }, [drawingManager, map]);

  return { drawingManager, setDrawingMode, toggleDrawingManager };
}