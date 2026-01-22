export interface WorkingTypes {
  eco: number;
  standart: number;
  power: number;
  powerplus: number;
}

export interface DateData {
  date: string;
  totalWorking: number;
  working_time: number;
  working?: number;
  rolanti: number;
  fuel_: number;
  working_types: WorkingTypes;
}

export interface Warning {
  warning_name: string;
  warning_type: string;
  warning_code: string;
  warning_date: string;
  description: string;
}

export interface MachineParameters {
  def_amaount: number;
  EngineCoolantTemp: number;
  HydraOilTemp: number;
  InstantFuelConsumption: number;
  AverageFuelConsumption: number;
  keyswitchBatteryPotential?: number;
  EngineSpeed?: number;
  GLB_Odometer?: string;
  GLB_IgnitionTime?: string;
  CrabModeTime?: number;
  GLB_4WModeTime?: string;
  GLB_ECOModeTime?: number;
  GLB_STDModeTime?: string;
  GLB_F1Time?: string;
  GLB_F2Time?: string;
  GLB_F3Time?: string;
  GLB_F4Time?: string;
  GLB_NTime?: string;
  GLB_R1Time?: string;
  GLB_R2Time?: string;
  GLB_R3Time?: string;
  GLB_AutoTime?: string;
  EOL_HemaUnloader?: string;
}

export interface MachineParameter {
  type: string;
  lang_key: string;
  parameter: string;
  chartType: string;
  title: string;
  valueTitle: string;
  valueSubTitle?: string;
  maxValue?: number;
  minValue?: number;
  value?: number;
  lastUpdateTime?: string;
}

export interface Machine {
  id: number;
  isFav: boolean;
  name: string;
  type: string;
  totalWorkingHours: number;
  totalFuelConsumption: number;
  serialNo: string;
  model: string;
  active: boolean;
  warnings: Warning[];
  fuel_level: string;
  remaining_for_service: string;
  lat: number;
  long: number;
  location: string;
  user_fullname: string;
  sachet_number: number;
  dates: DateData[];
  parameters: MachineParameters;
}


export interface WarningCode {
    id: string;
    code: string;
    description: string;
}

// map için yeni eklediğim
export interface MachineData {
  id: string;
  name: string;
  type: string;
  lat: number;
  long: number;
  totalWorkingHours: number;
  model: string;
  serialNo: string;
  subtype: string;
  user_fullname: string;
  isTelehandlerV2Image: boolean;
  instantFuel: any;
  totalUsedFuel: any;
  state: any;
  deviceName: string;
}

  