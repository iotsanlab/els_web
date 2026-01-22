import { useEffect } from 'react';
import { DrawingAction, DrawingActionKind, DrawingState } from './types';

// Reducer fonksiyonu
export default function reducer(state: DrawingState, action: DrawingAction): DrawingState {
  const { past, now, future } = state;

  switch (action.type) {
    case DrawingActionKind.ADD_OVERLAY:
      return {
        past: [...past, [...now]],
        now: [...now, action.payload],
        future: []
      };
    case DrawingActionKind.UPDATE_OVERLAY:
      return {
        past: [...past, [...now]],
        now: [...now],
        future: []
      };
    case DrawingActionKind.DELETE_OVERLAY:
      return {
        past: [...past, [...now]],
        now: now.filter(overlay => overlay !== action.payload),
        future: []
      };
    case DrawingActionKind.UNDO:
      if (past.length === 0) return state;
      const previous = past[past.length - 1];
      return {
        past: past.slice(0, past.length - 1),
        now: previous,
        future: [now, ...future]
      };
    case DrawingActionKind.REDO:
      if (future.length === 0) return state;
      const next = future[0];
      return {
        past: [...past, now],
        now: next,
        future: future.slice(1)
      };
    case DrawingActionKind.CLEAR:
      return {
        past: [...past, [...now]],
        now: [],
        future: []
      };
    default:
      return state;
  }
}

// Drawing Manager olaylarını dinleyen hook
export function useDrawingManagerEvents(
  drawingManager: google.maps.drawing.DrawingManager | null,
  overlaysShouldUpdateRef: React.MutableRefObject<boolean>,
  dispatch: React.Dispatch<DrawingAction>
) {
  useEffect(() => {
    if (!drawingManager) return;

    const overlayCompleteListener = google.maps.event.addListener(
      drawingManager,
      'overlaycomplete',
      (event: google.maps.drawing.OverlayCompleteEvent) => {
        const overlay = event.overlay;
        dispatch({ type: DrawingActionKind.ADD_OVERLAY, payload: overlay });

        // Şekil değişikliklerini dinle
        if (overlay instanceof google.maps.Circle) {
          google.maps.event.addListener(overlay, 'radius_changed', () => {
            if (overlaysShouldUpdateRef.current) {
              dispatch({ type: DrawingActionKind.UPDATE_OVERLAY });
            }
          });
          google.maps.event.addListener(overlay, 'center_changed', () => {
            if (overlaysShouldUpdateRef.current) {
              dispatch({ type: DrawingActionKind.UPDATE_OVERLAY });
            }
          });
        } else if (
          overlay instanceof google.maps.Polygon ||
          overlay instanceof google.maps.Polyline
        ) {
          google.maps.event.addListener(overlay.getPath(), 'set_at', () => {
            if (overlaysShouldUpdateRef.current) {
              dispatch({ type: DrawingActionKind.UPDATE_OVERLAY });
            }
          });
          google.maps.event.addListener(overlay.getPath(), 'insert_at', () => {
            if (overlaysShouldUpdateRef.current) {
              dispatch({ type: DrawingActionKind.UPDATE_OVERLAY });
            }
          });
          google.maps.event.addListener(overlay.getPath(), 'remove_at', () => {
            if (overlaysShouldUpdateRef.current) {
              dispatch({ type: DrawingActionKind.UPDATE_OVERLAY });
            }
          });
        } else if (overlay instanceof google.maps.Rectangle) {
          google.maps.event.addListener(overlay, 'bounds_changed', () => {
            if (overlaysShouldUpdateRef.current) {
              dispatch({ type: DrawingActionKind.UPDATE_OVERLAY });
            }
          });
        } else if (overlay instanceof google.maps.Marker) {
          google.maps.event.addListener(overlay, 'position_changed', () => {
            if (overlaysShouldUpdateRef.current) {
              dispatch({ type: DrawingActionKind.UPDATE_OVERLAY });
            }
          });
        }
      }
    );

    return () => {
      google.maps.event.removeListener(overlayCompleteListener);
    };
  }, [drawingManager, dispatch, overlaysShouldUpdateRef]);
}

// Overlay snapshot'larını uygulayan hook
export function useOverlaySnapshots(
  map: google.maps.Map | null,
  state: DrawingState,
  overlaysShouldUpdateRef: React.MutableRefObject<boolean>
) {
  useEffect(() => {
    if (!map) return;

    // Mevcut tüm şekilleri haritadan kaldır
    state.now.forEach(overlay => {
      overlay.setMap(null);
    });

    // Şekilleri güncelleme işlemini devre dışı bırak
    overlaysShouldUpdateRef.current = false;

    // Yeni şekilleri haritaya ekle
    state.now.forEach(overlay => {
      overlay.setMap(map);
    });

    // Şekilleri güncelleme işlemini tekrar etkinleştir
    setTimeout(() => {
      overlaysShouldUpdateRef.current = true;
    }, 100);
  }, [map, state.now, overlaysShouldUpdateRef]);
} 