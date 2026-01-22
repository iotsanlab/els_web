// hooks/useMachineWarnings.ts
import { useEffect, useState } from "react";
import deviceWarningStore from "../../store/Warnings";
import deviceAttributes from "../../store/DeviceAttributes";
import deviceWorkStore from "../../store/DeviceTelemetry";

export interface Warnings {
  warning_name_2: string;
  warning_type: string;
  warning_code: string;
  warning_date: string;
  description: string;
  source: string;
}

export const useMachineWarnings = (machineId: string) => {
  const [warnings, setWarnings] = useState<Warnings[]>([]);

  useEffect(() => {
    if (!machineId) return;

    const telemetry = deviceWarningStore.filteredWarnings[machineId];
    if (!telemetry) {
      setWarnings([]);
      return;
    }

    const pairKeys = [
      ['SPN1Eng', 'FMI1Eng'], ['SPN2Eng', 'FMI2Eng'], ['SPN3Eng', 'FMI3Eng'], ['SPN4Eng', 'FMI4Eng'],
      ['SPN1Gear', 'FMI1Gear'], ['SPN2Gear', 'FMI2Gear'], ['SPN3Gear', 'FMI3Gear'], ['SPN4Gear', 'FMI4Gear'],
      ['SPN1', 'FMI1'], ['SPN2', 'FMI2'], ['SPN3', 'FMI3'], ['SPN4', 'FMI4'],
    ];

    const warningEntries: Warnings[] = [];

    for (const [spnKey, fmiKey] of pairKeys) {
      const spnVals = telemetry[spnKey] || [];
      const fmiVals = telemetry[fmiKey] || [];
      const minLen = Math.min(spnVals.length, fmiVals.length);

      for (let i = 0; i < minLen; i++) {
        const spnVal = spnVals[i].value;
        const fmiVal = fmiVals[i].value;
        const ts = spnVals[i].ts;
        const hoursAgo = Math.floor((Date.now() - ts) / (1000 * 60 * 60));

        if (spnVal === 0 && fmiVal === 0) continue;

        const source = spnKey.includes("Eng") ? "Engine" : spnKey.includes("Gear") ? "Gear" : "General";
        const spnNum = spnKey.match(/\d+/)?.[0] || "";
        const fmiNum = fmiKey.match(/\d+/)?.[0] || "";

        warningEntries.push({
          warning_name_2: `${spnKey} + ${fmiKey}`,
          warning_type: `SPN${spnNum} - FMI${fmiNum}`,
          warning_code: `${spnVal} - ${fmiVal}`,
          warning_date: `${hoursAgo} saat`,
          description: "-",
          source,
        });
      }
    }

    setWarnings(warningEntries);
  }, [machineId, deviceWarningStore.filteredWarnings, deviceAttributes.all, deviceWorkStore.all]);

  return warnings;
};
