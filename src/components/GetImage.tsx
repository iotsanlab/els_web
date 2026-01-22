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

const getMachineImage = (type: string, size = "sm", subtype: string) => {
  if(subtype === "Develon"){
    return size === "md" ? mdExc : smExc;
  }

  if(subtype === "VM6"){
    return size === "md" ? vm6 : vm6;
  }

  if(subtype === "EL12"){
    return size === "md" ? el12 : el12;
  }

  if(subtype === "AE15"){
    return size === "md" ? elsLift : elsLift;
  }

  switch (type) {
    case "Excavator":
      return size === "md" ? mstExc : mdMstExc;
    case "Telehandler":
      return size === "md" ? mdTele : smTele;
    case "Backhoeloader":
      return size === "md" ? mdBackhoe : smBackhoe;
    case "mst_dummy":
      return size === "md" ? mdExc : smExc;
    case "Telehandler_v2":
      return size === "md" ? mdTeleV2 : mdTeleV2;
    case "ELS_Lift":
      return size === "md" ? elsLift : elsLift;
    default:
      return elsLift; // Varsayılan olarak küçük (sm) Excavator resmini döndürüyoruz
  }
};

export default getMachineImage;
