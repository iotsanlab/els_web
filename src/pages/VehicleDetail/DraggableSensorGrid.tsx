import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import SensorBox from '../../components/SensorBox';
import { MachineParameter } from '../../utils/machine';

interface DraggableSensorBoxProps {
  param: MachineParameter;
  telemetryData: Record<string, any>;
  onTranslation: (key: string) => string;
  openInfoModal?: (parameter: string) => void;
}

// Sürüklenebilir SensorBox wrapper'ı
const DraggableSensorBox: React.FC<DraggableSensorBoxProps> = ({ 
  param, 
  telemetryData, 
  onTranslation,
  openInfoModal
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: param.parameter });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const rawValue = telemetryData[param.parameter]?.value;
  const ts = telemetryData[param.parameter]?.ts;
  
  const formattedDate = ts
    ? new Date(ts).toLocaleString("tr-TR", {
        day: "2-digit",
        month: "2-digit", 
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

  const getValue = () => {
    if (rawValue === undefined || rawValue === null) return "–";
    if (isNaN(Number(rawValue))) return rawValue;
    
    const parsed = parseFloat(rawValue);
    return param.parameter === "Ext Voltage" 
      ? (parsed / 1000).toFixed(0) 
      : parsed.toFixed(0);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab active:cursor-grabbing"
    >
      <SensorBox
        key={param.parameter}
        title={onTranslation(param.title)}
        value={getValue()}
        type={param.type as "fuel" | "service" | "add" | "temperature"}
        valueTitle={onTranslation(param.valueTitle)}
        valueSubTitle=""
        chartType={param.chartType as "boolean" | "linear" | "empty" | "radial"}
        maxValue={param.maxValue}
        minValue={param.minValue}
        reverseColor={param.reverseColor ?? false}
        lastUpdateTime={formattedDate}
        onClickInfo={() => openInfoModal?.(param.parameter ?? "")}
      />
    </div>
  );
};

interface DraggableSensorGridProps {
  sensorData: MachineParameter[];
  telemetryData: Record<string, any>;
  onSensorOrderChange: (newOrder: MachineParameter[]) => void;
  onAddClick: () => void;
  onTranslation: (key: string) => string;
  openInfoModal?: (parameter: string) => void;
}

const DraggableSensorGrid: React.FC<DraggableSensorGridProps> = ({
  sensorData,
  telemetryData,
  onSensorOrderChange,
  onAddClick,
  onTranslation,
  openInfoModal,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px hareket ettikten sonra drag başlasın
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = sensorData.findIndex((item) => item.parameter === active.id);
      const newIndex = sensorData.findIndex((item) => item.parameter === over?.id);
      
      const newOrder = arrayMove(sensorData, oldIndex, newIndex);
      onSensorOrderChange(newOrder);
    }
  };

  // SensorBox'ların ID'lerini alıyoruz
  const sensorIds = sensorData.map(param => param.parameter);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={sensorIds} strategy={rectSortingStrategy}>
        <div className="grid items-start justify-start w-full grid-cols-3 gap-5 lg:grid-cols-3 sm:grid-cols-3 4xl:grid-cols-4 rounded-[10px] drop-shadow-[2px_2px_4px_#00000026]">
          {sensorData.map((param) => (
            <DraggableSensorBox
              key={param.parameter}
              param={param}
              telemetryData={telemetryData}
              onTranslation={onTranslation}
              openInfoModal={openInfoModal}
            />
          ))}
          
          {/* Add butonu - sürüklenemez */}
          <SensorBox type="add" onClick={onAddClick} />
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default DraggableSensorGrid;