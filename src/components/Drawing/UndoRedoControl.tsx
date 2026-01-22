import React, { useReducer, useRef } from 'react';
import { useMap, MapControl, ControlPosition } from '@vis.gl/react-google-maps';
import reducer, { useDrawingManagerEvents, useOverlaySnapshots } from './undo-redo';
import { DrawingActionKind } from './types';
import { SvgIcons } from '../../assets/icons/SvgIcons';

interface UndoRedoControlProps {
  drawingManager: google.maps.drawing.DrawingManager | null;
  isEditMode: boolean;
}

export const UndoRedoControl: React.FC<UndoRedoControlProps> = ({ drawingManager, isEditMode }) => {
  const map = useMap();
  const [state, dispatch] = useReducer(reducer, {
    past: [],
    now: [],
    future: []
  });

  // Sonsuz döngüleri önlemek için ref kullanıyoruz
  const overlaysShouldUpdateRef = useRef<boolean>(false);

  useDrawingManagerEvents(drawingManager, overlaysShouldUpdateRef, dispatch);
  useOverlaySnapshots(map, state, overlaysShouldUpdateRef);

  if (!isEditMode) return null;

  return (
    <MapControl position={ControlPosition.TOP_RIGHT}>
      <div className="flex gap-2 p-2 m-2 bg-white rounded-[10px] shadow-md dark:bg-gray-800">
        <button
          className={`px-3 py-1 rounded-[10px] text-sm flex items-center justify-center ${
            state.past.length ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          onClick={() => dispatch({ type: DrawingActionKind.UNDO })}
          disabled={!state.past.length}
          title="Geri Al"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20"
            viewBox="0 -960 960 960"
            width="20"
            fill="currentColor"
          >
            <path d="M280-200v-80h284q63 0 109.5-40T720-420q0-60-46.5-100T564-560H312l104 104-56 56-200-200 200-200 56 56-104 104h252q97 0 166.5 63T800-420q0 94-69.5 157T564-200H280Z" />
          </svg>
          <span className="ml-1">Geri Al</span>
        </button>
        
        <button
          className={`px-3 py-1 rounded-[10px] text-sm flex items-center justify-center ${
            state.future.length ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          onClick={() => dispatch({ type: DrawingActionKind.REDO })}
          disabled={!state.future.length}
          title="İleri Al"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20"
            viewBox="0 -960 960 960"
            width="20"
            fill="currentColor"
          >
            <path d="M396-200q-97 0-166.5-63T160-420q0-94 69.5-157T396-640h252L544-744l56-56 200 200-200 200-56-56 104-104H396q-63 0-109.5 40T240-420q0 60 46.5 100T396-280h284v80H396Z" />
          </svg>
          <span className="ml-1">İleri Al</span>
        </button>
        
        <button
          className="flex items-center justify-center px-3 py-1 text-sm text-white bg-red-500 rounded-[10px] hover:bg-red-600"
          onClick={() => dispatch({ type: DrawingActionKind.CLEAR })}
          title="Tümünü Temizle"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20"
            viewBox="0 0 24 24"
            width="20"
            fill="currentColor"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
          </svg>
          <span className="ml-1">Temizle</span>
        </button>
      </div>
    </MapControl>
  );
}; 