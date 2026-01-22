export enum DrawingActionKind {
  ADD_OVERLAY = 'ADD_OVERLAY',
  UPDATE_OVERLAY = 'UPDATE_OVERLAY',
  DELETE_OVERLAY = 'DELETE_OVERLAY',
  UNDO = 'UNDO',
  REDO = 'REDO',
  CLEAR = 'CLEAR'
}

export interface DrawingAction {
  type: DrawingActionKind;
  payload?: any;
}

export interface DrawingState {
  past: google.maps.MVCObject[][];
  now: google.maps.MVCObject[];
  future: google.maps.MVCObject[][];
} 