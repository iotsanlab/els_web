import { MachineParameter } from "../utils/machine";

const machineParametersByType: Record<string, MachineParameter[]> = {
  Excavator: [
    {
      type: "empty",
      lang_key: "parameterName.excavator.DrivDemEngPercTorq",
      parameter: "DrivDemEngPercTorq",
      chartType: "linear",
      title: "parameterName.excavator.DrivDemEngPercTorq",
      valueTitle: "%",
      maxValue: 100,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.excavator.ActEngPercTorq",
      parameter: "ActEngPercTorq",
      chartType: "linear",
      title: "parameterName.excavator.ActEngPercTorq",
      valueTitle: "%",
      maxValue: 100,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "RPM",
      parameter: "RPM",
      chartType: "radial",
      title: "RPM",
      valueTitle: "RPM",
      maxValue: 5000,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.excavator.SourcAddOfContDevForEngCont",
      parameter: "SourcAddOfContDevForEngCont",
      chartType: "empty",
      title: "parameterName.excavator.SourcAddOfContDevForEngCont",
      valueTitle: "",
      maxValue: 100,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.excavator.EngStarterMode",
      parameter: "EngStarterMode",
      chartType: "empty",
      title: "parameterName.excavator.EngStarterMode",
      valueTitle: "",
      maxValue: 15,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.excavator.AccPedPos1",
      parameter: "AccPedPos1",
      chartType: "linear",
      title: "parameterName.excavator.AccPedPos1",
      valueTitle: "",
      maxValue: 100,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.excavator.EngDesiOpSpeed",
      parameter: "EngDesiOpSpeed",
      chartType: "radial",
      title: "parameterName.excavator.EngDesiOpSpeed",
      valueTitle: "RPM",
      maxValue: 5000,
      minValue: 0
    },

    {
      type: "empty",
      lang_key: "parameterName.excavator.EngFuelDelPress",
      parameter: "EngFuelDelPress",
      chartType: "radial",
      title: "parameterName.excavator.EngFuelDelPress",
      valueTitle: "kPa",
      maxValue: 1020,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.excavator.EngOilPress",
      parameter: "EngOilPress",
      chartType: "radial",
      title: "parameterName.excavator.EngOilPress",
      valueTitle: "kPa",
      maxValue: 1020,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.excavator.EngIntManPress",
      parameter: "EngIntManPress",
      chartType: "radial",
      title: "parameterName.excavator.EngIntManPress",
      valueTitle: "kPa",
      maxValue: 510,
      minValue: 0
    },
    {
      type: "temperature",
      lang_key: "parameterName.excavator.EngExhGasTemp",
      parameter: "EngExhGasTemp",
      chartType: "linear",
      title: "parameterName.excavator.EngExhGasTemp",
      valueTitle: "°C",
      maxValue: 400,
      minValue: 0
    },
    {
      type: "temperature",
      lang_key: "parameterName.excavator.AmbAirTemp",
      parameter: "AmbAirTemp",
      chartType: "linear",
      title: "parameterName.excavator.AmbAirTemp",
      valueTitle: "°C",
      maxValue: 50,
      minValue: 0
    },
    {
      type: "temperature",
      lang_key: "parameterName.excavator.EngCoolTemp",
      parameter: "EngCoolTemp",
      chartType: "linear",
      title: "parameterName.excavator.EngCoolTemp",
      valueTitle: "°C",
      maxValue: 130,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.excavator.KeySwiBattPot",
      parameter: "KeySwiBattPot",
      chartType: "empty",
      title: "parameterName.excavator.KeySwiBattPot",
      valueTitle: "V",
      maxValue: 32,
      minValue: 18
    },
    {
      type: "empty",
      lang_key: "parameterName.excavator.EngFuelRate",
      parameter: "EngFuelRate",
      chartType: "empty",
      title: "parameterName.excavator.EngFuelRate",
      valueTitle: "L/H",
      maxValue: 100,
      minValue: 0
    },
    {
      type: "fuel",
      lang_key: "global.totalFuel",
      parameter: "EngTotalFuelUsed",
      chartType: "empty",
      title: "global.totalFuel",
      valueTitle: "global.lt",
      maxValue: 250000,
      minValue: 0
    },
    {
      type: 'services',
      lang_key: "documentPage.totalWorkingTime",
      parameter: "EngineTotalHours",
      chartType: "empty",
      title: "documentPage.totalWorkingTime",
      valueTitle: "global.hour",
      maxValue: 100000,
      minValue: 0
    },



    {
      type: "empty",
      lang_key: "parameterName.excavator.SoftId",
      parameter: "SoftId",
      chartType: "empty",
      title: "parameterName.excavator.SoftId",
      valueTitle: "",
      maxValue: 100,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.excavator.EngSpeedMEAS1",
      parameter: "EngSpeedMEAS1",
      chartType: "radial",
      title: "parameterName.excavator.EngSpeedMEAS1",
      valueTitle: "RPM",
      maxValue: 5000,
      minValue: 0
    },
    {
      type: "temperature",
      lang_key: "parameterName.excavator.EngCoolTempMEAS1",
      parameter: "EngCoolTempMEAS1",
      chartType: "linear",
      title: "parameterName.excavator.EngCoolTempMEAS1",
      valueTitle: "°C",
      maxValue: 130,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.excavator.EngOilPresMEAS1",
      parameter: "EngOilPresMEAS1",
      chartType: "radial",
      title: "parameterName.excavator.EngOilPresMEAS1",
      valueTitle: "kPa",
      maxValue: 800,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.excavator.EngSpeedSens1",
      parameter: "EngSpeedSens1",
      chartType: "radial",
      title: "parameterName.excavator.EngSpeedSens1",
      valueTitle: "RPM",
      maxValue: 5000,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.excavator.EngSpeedSens2",
      parameter: "EngSpeedSens2",
      chartType: "radial",
      title: "parameterName.excavator.EngSpeedSens2",
      valueTitle: "RPM",
      maxValue: 5000,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.excavator.MaxAvaEngTorqAtCurrSpe",
      parameter: "MaxAvaEngTorqAtCurrSpe",
      chartType: "linear",
      title: "parameterName.excavator.MaxAvaEngTorqAtCurrSpe",
      valueTitle: "%",
      maxValue: 100,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.excavator.MaxAvaEngSpe",
      parameter: "MaxAvaEngSpe",
      chartType: "radial",
      title: "parameterName.excavator.MaxAvaEngSpe",
      valueTitle: "RPM",
      maxValue: 5000,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.excavator.RailFuelPress",
      parameter: "RailFuelPress",
      chartType: "radial",
      title: "parameterName.excavator.RailFuelPress",
      valueTitle: "Mpa",
      maxValue: 200,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.excavator.EngStopSwi",
      parameter: "EngStopSwi",
      chartType: "boolean",
      title: "parameterName.excavator.EngStopSwi",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.excavator.EngWarnLamp",
      parameter: "EngWarnLamp",
      chartType: "boolean",
      title: "parameterName.excavator.EngWarnLamp",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.excavator.PowReduLIM",
      parameter: "PowReduLIM",
      chartType: "boolean",
      title: "parameterName.excavator.PowReduLIM",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.excavator.EngMaxSpeLim",
      parameter: "EngMaxSpeLim",
      chartType: "boolean",
      title: "parameterName.excavator.EngMaxSpeLim",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.excavator.EngMaxTorqLim",
      parameter: "EngMaxTorqLim",
      chartType: "boolean",
      title: "parameterName.excavator.EngMaxTorqLim",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.excavator.LowBaroPressLim",
      parameter: "LowBaroPressLim",
      chartType: "boolean",
      title: "parameterName.excavator.LowBaroPressLim",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.excavator.SmokeLim",
      parameter: "SmokeLim",
      chartType: "boolean",
      title: "parameterName.excavator.SmokeLim",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.excavator.RailPressErr",
      parameter: "RailPressErr",
      chartType: "boolean",
      title: "parameterName.excavator.RailPressErr",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.excavator.StopSwi",
      parameter: "StopSwi",
      chartType: "boolean",
      title: "parameterName.excavator.StopSwi",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.excavator.Term50StarSig",
      parameter: "Term50StarSig",
      chartType: "boolean",
      title: "parameterName.excavator.Term50StarSig",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.excavator.StartOut",
      parameter: "StartOut",
      chartType: "boolean",
      title: "parameterName.excavator.StartOut",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.excavator.EngOilWarnLamp",
      parameter: "EngOilWarnLamp",
      chartType: "boolean",
      title: "parameterName.excavator.EngOilWarnLamp",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },

    ////

    {
      type: "empty",
      lang_key: "parameterName.excavator.UreaTankLvl",
      parameter: "UreaTankLvl",
      chartType: "linear",
      title: "parameterName.excavator.UreaTankLvl",
      valueTitle: "%",
      maxValue: 100,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.excavator.UreaTemp",
      parameter: "UreaTemp",
      chartType: "linear",
      title: "parameterName.excavator.UreaTemp",
      valueTitle: "°C",
      maxValue: 70,
      minValue: -40
    },
    {
      type: "empty",
      lang_key: "parameterName.excavator.AfterSCROpIndSev",
      parameter: "AfterSCROpIndSev",
      chartType: "boolean",
      title: "parameterName.excavator.AfterSCROpIndSev",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.excavator.DPFSootLoadPerc",
      parameter: "DPFSootLoadPerc",
      chartType: "linear",
      title: "parameterName.excavator.DPFSootLoadPerc",
      valueTitle: "%",
      maxValue: 100,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.excavator.DPFAshLoadPerc",
      parameter: "DPFAshLoadPerc",
      chartType: "linear",
      title: "parameterName.excavator.DPFAshLoadPerc",
      valueTitle: "%",
      maxValue: 100,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.excavator.ECOHOUR1",
      parameter: "ECOHOUR1",
      chartType: "empty",
      title: "parameterName.excavator.ECOHOUR1",
      valueTitle: "h",
      maxValue: 20000,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.excavator.STDHOUR1",
      parameter: "STDHOUR1",
      chartType: "empty",
      title: "parameterName.excavator.STDHOUR1",
      valueTitle: "h",
      maxValue: 20000,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.excavator.PWRHOUR1",
      parameter: "PWRHOUR1",
      chartType: "empty",
      title: "parameterName.excavator.PWRHOUR1",
      valueTitle: "h",
      maxValue: 20000,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.excavator.PWR_PLUSHOUR1",
      parameter: "PWR_PLUSHOUR1",
      chartType: "empty",
      title: "parameterName.excavator.PWR_PLUSHOUR1",
      valueTitle: "h",
      maxValue: 20000,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.excavator.BREAKERHOUR1",
      parameter: "BREAKERHOUR1",
      chartType: "empty",
      title: "parameterName.excavator.BREAKERHOUR1",
      valueTitle: "h",
      maxValue: 20000,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.excavator.AUGERHOUR1",
      parameter: "AUGERHOUR1",
      chartType: "empty",
      title: "parameterName.excavator.AUGERHOUR1",
      valueTitle: "h",
      maxValue: 20000,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.excavator.Alternator",
      parameter: "Alternator",
      chartType: "boolean",
      title: "parameterName.excavator.Alternator",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.excavator.HavaFiltresi",
      parameter: "HavaFiltresi",
      chartType: "boolean",
      title: "parameterName.excavator.HavaFiltresi",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.excavator.AkuGerilimi",
      parameter: "AkuGerilimi",
      chartType: "radial",
      title: "parameterName.excavator.AkuGerilimi",
      valueTitle: "V",
      maxValue: 34,
      minValue: 5
    },
    {
      type: "empty",
      lang_key: "parameterName.excavator.HidrolikYagSicakligi",
      parameter: "HidrolikYagSicakligi",
      chartType: "linear",
      title: "parameterName.excavator.HidrolikYagSicakligi",
      valueTitle: "°C",
      maxValue: 100,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.excavator.PTBasincBilgi",
      parameter: "PTBasincBilgi",
      chartType: "boolean",
      title: "parameterName.excavator.PTBasincBilgi",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.excavator.PABasincBilgi",
      parameter: "PABasincBilgi",
      chartType: "boolean",
      title: "parameterName.excavator.PABasincBilgi",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.excavator.ISCBilgi",
      parameter: "ISCBilgi",
      chartType: "boolean",
      title: "parameterName.excavator.ISCBilgi",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.excavator.YuruyusHiziValfi",
      parameter: "YuruyusHiziValfi",
      chartType: "boolean",
      title: "parameterName.excavator.YuruyusHiziValfi",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.excavator.KopartmaValfi",
      parameter: "KopartmaValfi",
      chartType: "boolean",
      title: "parameterName.excavator.KopartmaValfi",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.excavator.DonusOncelikValfi",
      parameter: "DonusOncelikValfi",
      chartType: "boolean",
      title: "parameterName.excavator.DonusOncelikValfi",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.excavator.ArmOncelikValfi",
      parameter: "ArmOncelikValfi",
      chartType: "boolean",
      title: "parameterName.excavator.ArmOncelikValfi",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.excavator.KiriciValf",
      parameter: "KiriciValf",
      chartType: "boolean",
      title: "parameterName.excavator.KiriciValf",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.excavator.BurguValfi",
      parameter: "BurguValfi",
      chartType: "boolean",
      title: "parameterName.excavator.BurguValfi",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.excavator.HidrolikPompaBasinci1",
      parameter: "HidrolikPompaBasinci1",
      chartType: "radial",
      title: "parameterName.excavator.HidrolikPompaBasinci1",
      valueTitle: "bar",
      maxValue: 300,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.excavator.HidrolikPompaBasinci2",
      parameter: "HidrolikPompaBasinci2",
      chartType: "radial",
      title: "parameterName.excavator.HidrolikPompaBasinci2",
      valueTitle: "bar",
      maxValue: 300,
      minValue: 0
    },







    //////



    {
      type: "fuel",
      lang_key: "global.fuelLevel",
      parameter: "FuelLevel",
      chartType: "linear",
      title: "global.fuelLevel",
      valueTitle: "%",
      maxValue: 100,
      minValue: 0
    }





  ],


  //TELEHANDLER

  Telehandler: [
    {
      type: "temperature",
      lang_key: "parameterName.telehandler.EngCoolTemp",
      parameter: "EngCoolTemp",
      chartType: "linear",
      title: "parameterName.telehandler.EngCoolTemp",
      valueTitle: "°C",
      maxValue: 130,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.telehandler.EngOilPres",
      parameter: "EngOilPres",
      chartType: "radial",
      title: "parameterName.telehandler.EngOilPres",
      valueTitle: "bar",
      maxValue: 800,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.telehandler.Selenoid_VY",
      parameter: "Selenoid_VY",
      chartType: "boolean",
      title: "parameterName.telehandler.Selenoid_VY",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.telehandler.Selenoid_VB",
      parameter: "Selenoid_VB",
      chartType: "boolean",
      title: "parameterName.telehandler.Selenoid_VB",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.telehandler.Selenoid_Vt",
      parameter: "Selenoid_Vt",
      chartType: "boolean",
      title: "parameterName.telehandler.Selenoid_Vt",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.telehandler.Selenoid_Vyb",
      parameter: "Selenoid_Vyb",
      chartType: "boolean",
      title: "parameterName.telehandler.Selenoid_Vyb",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.telehandler.CRABMode",
      parameter: "CRABMode",
      chartType: "boolean",
      title: "parameterName.telehandler.CRABMode",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.telehandler.CIRCLEMode",
      parameter: "CIRCLEMode",
      chartType: "boolean",
      title: "parameterName.telehandler.CIRCLEMode",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.telehandler.GLB_2WSMode",
      parameter: "GLB_2WSMode",
      chartType: "boolean",
      title: "parameterName.telehandler.GLB_2WSMode",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.telehandler.CrabModeSwi",
      parameter: "CrabModeSwitch",
      chartType: "boolean",
      title: "parameterName.telehandler.CrabModeSwi",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.telehandler.CircleModeSwi",
      parameter: "CircleModeSwi",
      chartType: "boolean",
      title: "parameterName.telehandler.CircleModeSwi",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.telehandler.RearAxleSwi",
      parameter: "RearAxleSwi",
      chartType: "boolean",
      title: "parameterName.telehandler.RearAxleSwi",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.telehandler.FrontAxleSwi",
      parameter: "FrontAxleSwi",
      chartType: "boolean",
      title: "parameterName.telehandler.FrontAxleSwi",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.telehandler.AutoManual",
      parameter: "AutoManual",
      chartType: "boolean",
      title: "parameterName.telehandler.AutoManual",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "fuel",
      lang_key: "global.fuelLevel",
      parameter: "FuelLevel",
      chartType: "linear",
      title: "global.fuelLevel",
      valueTitle: "%",
      maxValue: 100,
      minValue: 0
    },



    {
    type:"empty",
    lang_key: "parameterName.telehandler.LeftStab",
    parameter: "LeftStab",
    chartType:"boolean",
    title: "parameterName.telehandler.LeftStab",
    valueTitle: "",
    maxValue: 1,
    minValue: 0
  },
  {
    type:"empty",
    lang_key: "parameterName.telehandler.RightStab",
    parameter: "RightStab",
    chartType:"boolean",
    title: "parameterName.telehandler.RightStab",
    valueTitle: "",
    maxValue: 1,
    minValue: 0
  },
  {
    type:"empty",
    lang_key: "parameterName.telehandler.VehicleType",
    parameter: "VehicleType",
    chartType:"empty",
    title: "parameterName.telehandler.VehicleType",
    valueTitle: "Type",
    maxValue: 10,
    minValue: 0
  },
  {
    type:"empty",
    lang_key: "parameterName.telehandler.AutoReverseFan",
    parameter: "AutoReverseFan",
    chartType:"boolean",
    title: "parameterName.telehandler.AutoReverseFan",
    valueTitle: "",
    maxValue: 1,
    minValue: 0
  },
  {
    type:"empty",
    lang_key: "parameterName.telehandler.IsUSA1044",
    parameter: "IsUSA1044",
    chartType:"boolean",
    title: "parameterName.telehandler.IsUSA1044",
    valueTitle: "",
    maxValue: 1,
    minValue: 0
  },
  {
    type:"empty",
    lang_key: "parameterName.telehandler.EOL_3AEngine",
    parameter: "EOL_3AEngine",
    chartType:"boolean",
    title: "parameterName.telehandler.EOL_3AEngine",
    valueTitle: "",
    maxValue: 1,
    minValue: 0
  },
  {
    type:"empty",
    lang_key: "parameterName.telehandler.ZASS",
    parameter: "ZASS",
    chartType:"boolean",
    title: "parameterName.telehandler.ZASS",
    valueTitle: "",
    maxValue: 1,
    minValue: 0
  },
  {
    type:"empty",
    lang_key: "parameterName.telehandler.TempSensor",
    parameter: "TempSensor",
    chartType:"boolean",
    title: "parameterName.telehandler.TempSensor",
    valueTitle: "",
    maxValue: 1,
    minValue: 0
  },
  {
    type:"empty",
    lang_key: "parameterName.telehandler.Camera",
    parameter: "Camera",
    chartType:"boolean",
    title: "parameterName.telehandler.Camera",
    valueTitle: "",
    maxValue: 1,
    minValue: 0
  },
  {
    type:"empty",
    lang_key: "parameterName.telehandler.SideCamera",
    parameter: "SideCamera",
    chartType:"boolean",
    title: "parameterName.telehandler.SideCamera",
    valueTitle: "",
    maxValue: 1,
    minValue: 0
  },
  {
    type:"empty",
    lang_key: "parameterName.telehandler.EOL_18Meter",
    parameter: "EOL_18Meter",
    chartType:"boolean",
    title: "parameterName.telehandler.EOL_18Meter",
    valueTitle: "",
    maxValue: 1,
    minValue: 0
  },
  {
    type:"empty",
    lang_key: "parameterName.telehandler.Tier3B",
    parameter: "Tier3B",
    chartType:"boolean",
    title: "parameterName.telehandler.Tier3B",
    valueTitle: "",
    maxValue: 1,
    minValue: 0
  },
  {
    type:"empty",
    lang_key: "parameterName.telehandler.DoorAjar",
    parameter: "DoorAjar",
    chartType:"boolean",
    title: "parameterName.telehandler.DoorAjar",
    valueTitle: "",
    maxValue: 1,
    minValue: 0
  },
  {
    type:"empty",
    lang_key: "parameterName.telehandler.RexrothSteering",
    parameter: "RexrothSteering",
    chartType:"boolean",
    title: "parameterName.telehandler.RexrothSteering",
    valueTitle: "",
    maxValue: 1,
    minValue: 0
  },
  {
    type:"empty",
    lang_key: "parameterName.telehandler.DanfossDrive",
    parameter: "DanfossDrive",
    chartType:"boolean",
    title: "parameterName.telehandler.DanfossDrive",
    valueTitle: "",
    maxValue: 1,
    minValue: 0
  },
  {
    type:"empty",
    lang_key: "parameterName.telehandler.OverloadType",
    parameter: "OverloadType",
    chartType:"empty",
    title: "parameterName.telehandler.OverloadType",
    valueTitle: "Type",
    maxValue: 5,
    minValue: 0
  },
  {
    type:"empty",
    lang_key: "parameterName.telehandler.TracUnit",
    parameter: "TracUnit",
    chartType:"boolean",
    title: "parameterName.telehandler.TracUnit",
    valueTitle: "",
    maxValue: 1,
    minValue: 0
  },
  {
    type:"empty",
    lang_key: "parameterName.telehandler.FuelLevellingType",
    parameter: "FuelLevellingType",
    chartType:"boolean",
    title: "parameterName.telehandler.FuelLevellingType",
    valueTitle: "",
    maxValue: 5,
    minValue: 0
  },
  {
    type:"empty",
    lang_key: "parameterName.telehandler.ADBlue",
    parameter: "ADBlue",
    chartType:"linear",
    title: "parameterName.telehandler.ADBlue",
    valueTitle: "%",
    maxValue: 100,
    minValue: 0
  },
   {
    type:"empty",
    lang_key: "parameterName.telehandler.RPM",
    parameter: "RPM",
    chartType:"radial",
    title: "parameterName.telehandler.RPM",
    valueTitle: "RPM",
    maxValue: 3500,
    minValue: 0
  },


    {
      type: 'services',
      lang_key: "documentPage.totalWorkingTime",
      parameter: "EngineTotalHours",
      chartType: "empty",
      title: "documentPage.totalWorkingTime",
      valueTitle: "global.hour",
      maxValue: 100000,
      minValue: 0
    },
//
   {
    type:"empty",
    lang_key: "parameterName.telehandler.EngOilLamp",
    parameter: "EngOilLamp",
    chartType:"boolean",
    title: "parameterName.telehandler.EngOilLamp",
    valueTitle: "",
    maxValue: 1,
    minValue: 0
  },
  {
    type:"empty",
    lang_key: "parameterName.telehandler.DiePartFiltStat",
    parameter: "DiePartFiltStat",
    chartType:"boolean",
    title: "parameterName.telehandler.DiePartFiltStat",
    valueTitle: "",
    maxValue: 1,
    minValue: 0
  },
  {
    type:"empty",
    lang_key: "parameterName.telehandler.SanzımanCurrentGear",
    parameter: "SanzımanCurrentGear",
    chartType:"empty",
    title: "parameterName.telehandler.SanzımanCurrentGear",
    valueTitle: "",
    maxValue: 6,
    minValue: 0
  },
  {
    type:"empty",
    lang_key: "parameterName.telehandler.VehicleSpeed",
    parameter: "VehicleSpeed",
    chartType:"radial",
    title: "parameterName.telehandler.VehicleSpeed",
    valueTitle: "km/h",
    maxValue: 100,
    minValue: 0
  },
  {
    type:"temperature",
    lang_key: "parameterName.telehandler.TransOilTemp",
    parameter: "TransOilTemp",
    chartType:"linear",
    title: "parameterName.telehandler.TransOilTemp",
    valueTitle: "°C",
    maxValue: 150,
    minValue: 0
  },
  {
    type:"empty",
    lang_key: "parameterName.telehandler.SootLoadPerc",
    parameter: "SootLoadPerc",
    chartType:"linear",
    title: "parameterName.telehandler.SootLoadPerc",
    valueTitle: "%",
    maxValue: 100,
    minValue: 0
  },
  //
      {
      type: "fuel",
      lang_key: "global.totalFuel",
      parameter: "EngTotalFuelUsed",
      chartType: "empty",
      title: "global.totalFuel",
      valueTitle: "global.lt",
      maxValue: 250000,
      minValue: 0
    },
     {
      type: "empty",
      lang_key: "global.AkuGerilimiTrack",
      parameter: "Ext Voltage",
      chartType: "radial",
      title: "global.AkuGerilimiTrack",
      valueTitle: "V",
      maxValue: 30,
      minValue: 0
    },
  ],






  Develon: [
    {
      type: "empty",
      lang_key: "parameterName.develon.RPM",
      parameter: "RPM",
      chartType: "radial",
      title: "parameterName.develon.RPM",
      valueTitle: "RPM",
      maxValue: 2500,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.develon.FuelRate",
      parameter: "FuelRate",
      chartType: "empty",
      title: "parameterName.develon.FuelRate",
      valueTitle: "L/H",
      maxValue: 100,
      minValue: 0
    },
    {
      type: "fuel",
      lang_key: "parameterName.develon.TotalFuelConsumption",
      parameter: "TotalFuelConsumption",
      chartType: "empty",
      title: "parameterName.develon.TotalFuelConsumption",
      valueTitle: "global.lt",
      maxValue: 250000,
      minValue: 0
    },
    {
      type: "temperature",
      lang_key: "parameterName.develon.EngineCoolantTemp",
      parameter: "EngineCoolantTemp",
      chartType: "linear",
      title: "parameterName.develon.EngineCoolantTemp",
      valueTitle: "°C",
      maxValue: 130,
      minValue: 0
    },
    {
      type: "temperature",
      lang_key: "parameterName.develon.EngineOilTemp",
      parameter: "EngineOilTemp",
      chartType: "linear",
      title: "parameterName.develon.EngineOilTemp",
      valueTitle: "°C",
      maxValue: 150,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.develon.BarometricPressure",
      parameter: "BarometricPressure",
      chartType: "radial",
      title: "parameterName.develon.BarometricPressure",
      valueTitle: "kPa",
      maxValue: 110,
      minValue: 0
    },
    {
      type: "temperature",
      lang_key: "parameterName.develon.AirTemp",
      parameter: "AirTemp",
      chartType: "linear",
      title: "parameterName.develon.AirTemp",
      valueTitle: "°C",
    }
  ],


  USA : [
    {
      type: "temperature",
      lang_key: "parameterName.telehandler.EngCoolTemp",
      parameter: "EngCoolTemp",
      chartType: "linear",
      title: "parameterName.telehandler.EngCoolTemp",
      valueTitle: "°C",
      maxValue: 130,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.telehandler.EngOilPres",
      parameter: "EngOilPres",
      chartType: "radial",
      title: "parameterName.telehandler.EngOilPres",
      valueTitle: "bar",
      maxValue: 800,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.backhoeloader.EngineSpeed",
      parameter: "RPM",
      chartType: "radial",
      title: "parameterName.backhoeloader.EngineSpeed",
      valueTitle: "RPM",
      maxValue: 3500,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.telehandler.Selenoid_VY",
      parameter: "Selenoid_VY",
      chartType: "boolean",
      title: "parameterName.telehandler.Selenoid_VY",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.telehandler.Selenoid_VB",
      parameter: "Selenoid_VB",
      chartType: "boolean",
      title: "parameterName.telehandler.Selenoid_VB",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.telehandler.Selenoid_Vt",
      parameter: "Selenoid_Vt",
      chartType: "boolean",
      title: "parameterName.telehandler.Selenoid_Vt",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.telehandler.Selenoid_Vyb",
      parameter: "Selenoid_Vyb",
      chartType: "boolean",
      title: "parameterName.telehandler.Selenoid_Vyb",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.telehandler.CRABMode",
      parameter: "CRABMode",
      chartType: "boolean",
      title: "parameterName.telehandler.CRABMode",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.telehandler.CIRCLEMode",
      parameter: "CIRCLEMode",
      chartType: "boolean",
      title: "parameterName.telehandler.CIRCLEMode",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.telehandler.GLB_2WSMode",
      parameter: "GLB_2WSMode",
      chartType: "boolean",
      title: "parameterName.telehandler.GLB_2WSMode",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.telehandler.CrabModeSwi",
      parameter: "CrabModeSwitch",
      chartType: "boolean",
      title: "parameterName.telehandler.CrabModeSwi",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.telehandler.CircleModeSwi",
      parameter: "CircleModeSwi",
      chartType: "boolean",
      title: "parameterName.telehandler.CircleModeSwi",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.telehandler.RearAxleSwi",
      parameter: "RearAxleSwi",
      chartType: "boolean",
      title: "parameterName.telehandler.RearAxleSwi",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.telehandler.FrontAxleSwi",
      parameter: "FrontAxleSwi",
      chartType: "boolean",
      title: "parameterName.telehandler.FrontAxleSwi",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.telehandler.AutoManual",
      parameter: "AutoManual",
      chartType: "boolean",
      title: "parameterName.telehandler.AutoManual",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "fuel",
      lang_key: "global.fuelLevel",
      parameter: "FuelLevel",
      chartType: "linear",
      title: "global.fuelLevel",
      valueTitle: "%",
      maxValue: 100,
      minValue: 0
    },


  {
    type:"empty",
    lang_key: "parameterName.telehandler.VehicleType",
    parameter: "VehicleType",
    chartType:"empty",
    title: "parameterName.telehandler.VehicleType",
    valueTitle: "Type",
    maxValue: 10,
    minValue: 0
  },
  {
    type:"empty",
    lang_key: "parameterName.telehandler.AutoReverseFan",
    parameter: "AutoReverseFan",
    chartType:"boolean",
    title: "parameterName.telehandler.AutoReverseFan",
    valueTitle: "",
    maxValue: 1,
    minValue: 0
  },
  {
    type:"empty",
    lang_key: "parameterName.telehandler.IsUSA1044",
    parameter: "IsUSA1044",
    chartType:"boolean",
    title: "parameterName.telehandler.IsUSA1044",
    valueTitle: "",
    maxValue: 1,
    minValue: 0
  },
  {
    type:"empty",
    lang_key: "parameterName.telehandler.OverloadType",
    parameter: "OverloadType",
    chartType:"empty",
    title: "parameterName.telehandler.OverloadType",
    valueTitle: "Type",
    maxValue: 5,
    minValue: 0
  },
  {
    type:"empty",
    lang_key: "parameterName.telehandler.TracUnit",
    parameter: "TracUnit",
    chartType:"boolean",
    title: "parameterName.telehandler.TracUnit",
    valueTitle: "",
    maxValue: 1,
    minValue: 0
  },
  {
    type:"empty",
    lang_key: "parameterName.telehandler.FuelLevellingType",
    parameter: "FuelLevellingType",
    chartType:"boolean",
    title: "parameterName.telehandler.FuelLevellingType",
    valueTitle: "",
    maxValue: 5,
    minValue: 0
  },
   {
    type:"empty",
    lang_key: "parameterName.telehandler.RPM",
    parameter: "RPM",
    chartType:"radial",
    title: "parameterName.telehandler.RPM",
    valueTitle: "RPM",
    maxValue: 3500,
    minValue: 0
  },


    {
      type: 'services',
      lang_key: "documentPage.totalWorkingTime",
      parameter: "EngineTotalHours",
      chartType: "empty",
      title: "documentPage.totalWorkingTime",
      valueTitle: "global.hour",
      maxValue: 100000,
      minValue: 0
    },
//
   {
    type:"empty",
    lang_key: "parameterName.telehandler.EngOilLamp",
    parameter: "EngOilLamp",
    chartType:"boolean",
    title: "parameterName.telehandler.EngOilLamp",
    valueTitle: "",
    maxValue: 1,
    minValue: 0
  },
  {
    type:"empty",
    lang_key: "parameterName.telehandler.VehicleSpeed",
    parameter: "VehicleSpeed",
    chartType:"radial",
    title: "parameterName.telehandler.VehicleSpeed",
    valueTitle: "km/h",
    maxValue: 100,
    minValue: 0
  },
  {
    type:"temperature",
    lang_key: "parameterName.telehandler.TransOilTemp",
    parameter: "TransOilTemp",
    chartType:"linear",
    title: "parameterName.telehandler.TransOilTemp",
    valueTitle: "°C",
    maxValue: 150,
    minValue: 0
  },
  //
      {
      type: "fuel",
      lang_key: "global.totalFuel",
      parameter: "EngTotalFuelUsed",
      chartType: "empty",
      title: "global.totalFuel",
      valueTitle: "global.lt",
      maxValue: 250000,
      minValue: 0
    },
     {
      type: "empty",
      lang_key: "global.AkuGerilimiTrack",
      parameter: "Ext Voltage",
      chartType: "radial",
      title: "global.AkuGerilimiTrack",
      valueTitle: "V",
      maxValue: 30,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.telehandler.ForwardActive",
      parameter: "ForwAct",
      chartType: "boolean",
      title: "parameterName.telehandler.ForwardActive",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.telehandler.ReverseActive",
      parameter: "RevAct",
      chartType: "boolean",
      title: "parameterName.telehandler.ReverseActive",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.telehandler.AngleOffset",
      parameter: "AngleOffset",
      chartType: "empty",
      title: "parameterName.telehandler.AngleOffset",
      valueTitle: "°",
      maxValue: 360,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.telehandler.StabilizerFlag",
      parameter: "StabilizerFlag",
      chartType: "boolean",
      title: "parameterName.telehandler.StabilizerFlag",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.telehandler.YuchaiEngineState",
      parameter: "EOL_YuchaiEng",
      chartType: "boolean",
      title: "parameterName.telehandler.YuchaiEngineState",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.telehandler.HSISpare",
      parameter: "HSISpare",
      chartType: "empty",
      title: "parameterName.telehandler.HSISpare",
      valueTitle: "",
      maxValue: 100,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.telehandler.bOneTime",
      parameter: "bOneTime",
      chartType: "boolean",
      title: "parameterName.telehandler.bOneTime",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.telehandler.CameraActive",
      parameter: "CameraActive",
      chartType: "boolean",
      title: "parameterName.telehandler.CameraActive",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.telehandler.ActiveScreen",
      parameter: "ActiveScreen",
      chartType: "empty",
      title: "parameterName.telehandler.ActiveScreen",
      valueTitle: "",
      maxValue: 10,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.telehandler.ReverseSelected",
      parameter: "ReverseSelected",
      chartType: "boolean",
      title: "parameterName.telehandler.ReverseSelected",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.telehandler.DynaRequest",
      parameter: "dynarequest",
      chartType: "boolean",
      title: "parameterName.telehandler.DynaRequest",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.telehandler.NeutralSignal1",
      parameter: "NeutralSignal1",
      chartType: "boolean",
      title: "parameterName.telehandler.NeutralSignal1",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.telehandler.NeutralSignal2",
      parameter: "NeutralSignal2",
      chartType: "boolean",
      title: "parameterName.telehandler.NeutralSignal2",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.telehandler.RevoCurrentGear",
      parameter: "RevoCurrentGear",
      chartType: "empty",
      title: "parameterName.telehandler.RevoCurrentGear",
      valueTitle: "",
      maxValue: 6,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.telehandler.RevoSelectedGear",
      parameter: "RevoSelectedGear",
      chartType: "empty",
      title: "parameterName.telehandler.RevoSelectedGear",
      valueTitle: "",
      maxValue: 6,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.telehandler.EOL_OverloadType",
      parameter: "EOL_OverloadType",
      chartType: "empty",
      title: "parameterName.telehandler.EOL_OverloadType",
      valueTitle: "Type",
      maxValue: 5,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.telehandler.EOL_Dyna_VehicleType",
      parameter: "EOL_Dyna_VehicleType",
      chartType: "empty",
      title: "parameterName.telehandler.EOL_Dyna_VehicleType",
      valueTitle: "Type",
      maxValue: 10,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.telehandler.EOL_TrackUnit",
      parameter: "EOL_TrackUnit",
      chartType: "boolean",
      title: "parameterName.telehandler.EOL_TrackUnit",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.telehandler.EOL_FuelLvlType",
      parameter: "EOL_FuelLvlType",
      chartType: "empty",
      title: "parameterName.telehandler.EOL_FuelLvlType",
      valueTitle: "Type",
      maxValue: 5,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.telehandler.EOL_RexrothSteer",
      parameter: "EOL_RexrothSteer",
      chartType: "boolean",
      title: "parameterName.telehandler.EOL_RexrothSteer",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
  ],




  // BACKHOE
  Backhoeloader: [
    {
      type: "empty",
      lang_key: "parameterName.backhoeloader.EngineSpeed",
      parameter: "RPM",
      chartType: "radial",
      title: "parameterName.backhoeloader.EngineSpeed",
      valueTitle: "RPM",
      maxValue: 3500,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.backhoeloader.EngPreHeat",
      parameter: "EngPreHeat",
      chartType: "boolean",
      title: "parameterName.backhoeloader.EngPreHeat",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.backhoeloader.EngineOillamp",
      parameter: "EngineOillamp",
      chartType: "boolean",
      title: "parameterName.backhoeloader.EngineOillamp",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.backhoeloader.UreaTankLevel",
      parameter: "UreaTankLevel",
      chartType: "linear",
      title: "parameterName.backhoeloader.UreaTankLevel",
      valueTitle: "%",
      maxValue: 100,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.backhoeloader.EOL_T5",
      parameter: "EOL_T5",
      chartType: "boolean",
      title: "parameterName.backhoeloader.EOL_T5",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.backhoeloader.EOL_Alternator",
      parameter: "EOL_Alternator",
      chartType: "boolean",
      title: "parameterName.backhoeloader.EOL_Alternator",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.backhoeloader.EOL_6S",
      parameter: "EOL_6S",
      chartType: "boolean",
      title: "parameterName.backhoeloader.EOL_6S",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.backhoeloader.EOL_HemaUnloader",
      parameter: "EOL_HemaUnloader",
      chartType: "boolean",
      title: "parameterName.backhoeloader.EOL_HemaUnloader",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.backhoeloader.EOL_RexrothUnloader",
      parameter: "EOL_RexrothUnloader",
      chartType: "boolean",
      title: "parameterName.backhoeloader.EOL_RexrothUnloader",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.backhoeloader.EOL_Ecodig",
      parameter: "EOL_Ecodig",
      chartType: "boolean",
      title: "parameterName.backhoeloader.EOL_Ecodig",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.backhoeloader.EOL_iSLinkasPresent",
      parameter: "EOL_iSLinkasPresent",
      chartType: "boolean",
      title: "parameterName.backhoeloader.EOL_iSLinkasPresent",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.backhoeloader.EOL_TersYuruyus",
      parameter: "EOL_TersYuruyus",
      chartType: "boolean",
      title: "parameterName.backhoeloader.EOL_TersYuruyus",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.backhoeloader.GLB_MaintenanceWarning",
      parameter: "GLB_MaintenanceWarning",
      chartType: "boolean",
      title: "parameterName.backhoeloader.GLB_MaintenanceWarning",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: 'services',
      lang_key: "documentPage.totalWorkingTime",
      parameter: "EngineTotalHours",
      chartType: "empty",
      title: "documentPage.totalWorkingTime",
      valueTitle: "global.hour",
      maxValue: 100000,
      minValue: 0
    },



    ///
    {
      type: "empty",
      lang_key: "parameterName.backhoeloader.TransCurrentGear",
      parameter: "TransCurrentGear",
      chartType: "empty",
      title: "parameterName.backhoeloader.TransCurrentGear",
      valueTitle: "parameterName.backhoeloader.TransCurrentGear",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.backhoeloader.FourWheelDrive",
      parameter: "FourWheelDrive",
      chartType: "boolean",
      title: "parameterName.backhoeloader.FourWheelDrive",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.backhoeloader.VehicleSpeed",
      parameter: "VehicleSpeed",
      chartType: "radial",
      title: "parameterName.backhoeloader.VehicleSpeed",
      valueTitle: "km/h",
      maxValue: 100,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.backhoeloader.AutoManual",
      parameter: "AutoManual",
      chartType: "empty",
      title: "parameterName.backhoeloader.AutoManual",
      valueTitle: "Mode",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.backhoeloader.EOL_IsYuchaiPresent",
      parameter: "EOL_IsYuchaiPresent",
      chartType: "boolean",
      title: "parameterName.backhoeloader.EOL_IsYuchaiPresent",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.backhoeloader.GLB_IGNITIONTime",
      parameter: "GLB_IGNITIONTime",
      chartType: "empty",
      title: "parameterName.backhoeloader.GLB_IGNITIONTime",
      valueTitle: "h",
      maxValue: 100000,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.backhoeloader.GLB_Tripmeter",
      parameter: "GLB_Tripmeter",
      chartType: "empty",
      title: "parameterName.backhoeloader.GLB_Tripmeter",
      valueTitle: "km",
      maxValue: 2500,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.backhoeloader.GLB_Odometer",
      parameter: "GLB_Odometer",
      chartType: "empty",
      title: "parameterName.backhoeloader.GLB_Odometer",
      valueTitle: "km",
      maxValue: 500000,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.backhoeloader.GLB_CrabModeTime",
      parameter: "GLB_CrabModeTime",
      chartType: "empty",
      title: "parameterName.backhoeloader.GLB_CrabModeTime",
      valueTitle: "h",
      maxValue: 250000,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.backhoeloader.GLB_4WModeTime",
      parameter: "GLB_4WModeTime",
      chartType: "empty",
      title: "parameterName.backhoeloader.GLB_4WModeTime",
      valueTitle: "h",
      maxValue: 250000,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.backhoeloader.GLB_ECOModeTime",
      parameter: "GLB_ECOModeTime",
      chartType: "empty",
      title: "parameterName.backhoeloader.GLB_ECOModeTime",
      valueTitle: "h",
      maxValue: 100000,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.backhoeloader.GLB_STDModeTime",
      parameter: "GLB_STDModeTime",
      chartType: "empty",
      title: "parameterName.backhoeloader.GLB_STDModeTime",
      valueTitle: "h",
      maxValue: 100000,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.backhoeloader.GLB_F1Time",
      parameter: "GLB_F1Time",
      chartType: "empty",
      title: "parameterName.backhoeloader.GLB_F1Time",
      valueTitle: "h",
      maxValue: 100000,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.backhoeloader.GLB_F2Time",
      parameter: "GLB_F2Time",
      chartType: "empty",
      title: "parameterName.backhoeloader.GLB_F2Time",
      valueTitle: "h",
      maxValue: 100000,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.backhoeloader.GLB_F3Time",
      parameter: "GLB_F3Time",
      chartType: "empty",
      title: "parameterName.backhoeloader.GLB_F3Time",
      valueTitle: "h",
      maxValue: 100000,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.backhoeloader.GLB_F4Time",
      parameter: "GLB_F4Time",
      chartType: "empty",
      title: "parameterName.backhoeloader.GLB_F4Time",
      valueTitle: "h",
      maxValue: 100000,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.backhoeloader.GLB_Ntime",
      parameter: "GLB_NTime",
      chartType: "empty",
      title: "parameterName.backhoeloader.GLB_Ntime",
      valueTitle: "h",
      maxValue: 100000,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.backhoeloader.GLB_R1Time",
      parameter: "GLB_R1Time",
      chartType: "empty",
      title: "parameterName.backhoeloader.GLB_R1Time",
      valueTitle: "h",
      maxValue: 100000,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.backhoeloader.GLB_R2Time",
      parameter: "GLB_R2Time",
      chartType: "empty",
      title: "parameterName.backhoeloader.GLB_R2Time",
      valueTitle: "h",
      maxValue: 100000,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.backhoeloader.GLB_R3Time",
      parameter: "GLB_R3Time",
      chartType: "empty",
      title: "parameterName.backhoeloader.GLB_R3Time",
      valueTitle: "h",
      maxValue: 100000,
      minValue: 0
    },
    {
      type: "empty",
      lang_key: "parameterName.backhoeloader.GLB_AutoTime",
      parameter: "GLB_AutoTime",
      chartType: "empty",
      title: "parameterName.backhoeloader.GLB_AutoTime",
      valueTitle: "h",
      maxValue: 100000,
      minValue: 0
    },
    {
      lang_key: "parameterName.backhoeloader.EngineCoolantTemp",
      type: "temperature",
      parameter: "EngineCoolantTemp",
      title: "parameterName.backhoeloader.EngineCoolantTemp",
      chartType: "linear",
      valueTitle: "°C",
      maxValue: 130,
      minValue: 0
    },
    {
      lang_key: "parameterName.backhoeloader.DieselParticulateFilterStatus",
      type: "empty",
      parameter: "DieselParticulateFilterStatus",
      chartType: "boolean",
      title: "parameterName.backhoeloader.DieselParticulateFilterStatus",
      valueTitle: "",
      maxValue: 1,
      minValue: 0
    },
    {
      lang_key: "parameterName.backhoeloader.DPF_Soot_Load_Percent",
      type: "empty",
      parameter: "DPF_Soot_Load_Percent",
      chartType: "linear",
      title: "parameterName.backhoeloader.DPF_Soot_Load_Percent",
      valueTitle: "%",
      maxValue: 100,
      minValue: 0
    },
    {
      type: "fuel",
      lang_key: "global.fuelLevel",
      parameter: "FuelLevel",
      chartType: "linear",
      title: "global.fuelLevel",
      valueTitle: "%",
      maxValue: 100,
      minValue: 0
    },
     {
      type: "fuel",
      lang_key: "global.totalFuel",
      parameter: "EngTotalFuelUsed",
      chartType: "empty",
      title: "global.totalFuel",
      valueTitle: "global.lt",
      maxValue: 250000,
      minValue: 0
    },
     {
      type: "empty",
      lang_key: "global.AkuGerilimiTrack",
      parameter: "Ext Voltage",
      chartType: "radial",
      title: "global.AkuGerilimiTrack",
      valueTitle: "V",
      maxValue: 30,
      minValue: 0
    },
  ],

  Lift: [
    {
      type: "empty",
      lang_key: "parameterName.lift.BatteryLevel",
      parameter: "BatteryLevel",
      reverseColor: true,
      chartType: "linear",
      title: "parameterName.lift.BatteryLevel",
      valueTitle: "%",
      maxValue: 100,
      minValue: 0
    },

    {
      type: "empty",
      lang_key: "parameterName.lift.WorkingHours",
      parameter: "WorkingHours",
      chartType: "empty",
      title: "parameterName.lift.WorkingHours",
      valueTitle: "global.hour",
      maxValue: 1000,
      minValue: 0
    },

    {
      type: "empty",
      lang_key: "parameterName.lift.PlatformMODE",
      parameter: "PlatformMODE",
      chartType: "empty",
      title: "parameterName.lift.PlatformMODE",
      valueTitle: "",
      maxValue: 1000,
      minValue: 0
    },

    {
      type: "empty",
      lang_key: "parameterName.lift.FlashCode",
      parameter: "FlashCode",
      chartType: "empty",
      title: "parameterName.lift.FlashCode",
      valueTitle: "",
      maxValue: 1000,
      minValue: 0
    },

    {
      type: "empty",
      lang_key: "parameterName.lift.Height",
      parameter: "Height",
      chartType: "linear",
      title: "parameterName.lift.Height",
      valueTitle: "%",
      maxValue: 100,
      minValue: 0
    },

    {
      type: "empty",
      lang_key: "parameterName.lift.Load",
      parameter: "Load",
      chartType: "linear",
      title: "parameterName.lift.Load",
      valueTitle: "%",
      maxValue: 100,
      minValue: 0
    },

    {
      type: "empty",
      lang_key: "parameterName.lift.TILTX",
      parameter: "TILTX",
      chartType: "radial",
      title: "parameterName.lift.TILTX",
      valueTitle: "",
      maxValue: 100,
      minValue: -100
    },

    {
      type: "empty",
      lang_key: "parameterName.lift.TILTY",
      parameter: "TILTY",
      chartType: "radial",
      title: "parameterName.lift.TILTY",
      valueTitle: "",
      maxValue: 100,
      minValue: -100
    },
  ]
};


export default machineParametersByType;
