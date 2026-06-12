import smExc from "../assets/images/smExcDev.png";
import smTele from "../assets/images/smTele.png";
import smBackhoe from "../assets/images/smBackhoe.png";
import mdExc from "../assets/images/mdExc.png";
import mdTele from "../assets/images/mdTele.png";
import mdBackhoe from "../assets/images/mdBackhoe.png";
import mdTeleV2 from "../assets/images/mdTeleV2.png";
import mstExc from "../assets/images/exc_mst.png";
import mdMstExc from "../assets/images/mdExc_mst.png";
import elsLift from "../assets/images/els.png";
import el12 from "../assets/images/el12.png";
import vm6 from "../assets/images/elsv16.png";

const getMachineImage = (type: string, size = "sm", subtype?: string) => {
  const modelType = (subtype || type || "").toUpperCase();

  if (modelType.startsWith("EL")) {
    return size === "md" ? el12 : el12;
  }
  if (modelType.startsWith("VM")) {
    return size === "md" ? vm6 : vm6;
  }
  if (modelType.startsWith("AE")) {
    return size === "md" ? elsLift : elsLift;
  }
  if (modelType.includes("TELEHANDLER_V2")) {
    return size === "md" ? mdTeleV2 : smTele;
  }
  if (modelType.includes("TELEHANDLER")) {
    return size === "md" ? mdTele : smTele;
  }
  if (modelType.includes("BACKHOE")) {
    return size === "md" ? mdBackhoe : smBackhoe;
  }
  if (modelType.includes("DEVELON") || modelType.includes("EXCAVATOR")) {
    return size === "md" ? mdExc : smExc;
  }
  if (modelType.includes("MST")) {
    return size === "md" ? mdMstExc : mstExc;
  }
  
  // Default fallback image
  return smExc;
};

export default getMachineImage;
