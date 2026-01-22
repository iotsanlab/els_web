import markerExc from "../../assets/images/markerExc.png";
import markerBachoe from "../../assets/images/markerBachoe.png";
import markerTele from "../../assets/images/markerTele.png";
import Logo from "../../assets/images/mst_marker.png"
import React from "react";
import serviceMarker from "../../assets/images/markerService.png"

import greenMarkerExc from "../../assets/markers/greenExcMarker.png";
import greenMarkerTele from "../../assets/markers/greenTeleMarker.png";
import greenMarkerBackhoe from "../../assets/markers/greenBackhoeMarker.png";

import greenDevelon from "../../assets/markers/greenDevelonExcMarker.svg";
import develon from "../../assets/markers/redDevelonExcMarkar.svg";

interface MapIconProps {
    type: string;
    state?: boolean;
}

const CustomMapMarker: React.ComponentType<MapIconProps> = ({type, state}) => {
    const imageStyle = {
        objectFit: 'contain' as const
    };
    
    return (
        <div>
            {type === "MST Ekskavatör" && <img style={imageStyle} src={state == true ? greenMarkerExc : markerExc} alt="markerExc" />}
            {type === "MST Bekoloader" && <img style={imageStyle} src={state == true ? greenMarkerBackhoe : markerBachoe} alt="markerBachoe" />}
            {type === "MST Telehandler" && <img style={imageStyle} src={state == true ? greenMarkerTele : markerTele} alt="markerTele" />}
            {type === "mst_dummy" && <img style={imageStyle} src={markerTele} alt="markerTele" />}
            {type === "Excavator" && <img style={imageStyle} src={state == true ? greenMarkerExc : markerExc} alt="markerExc" />}
            {type === "Forklift" && <img style={imageStyle} src={state == true ? greenMarkerTele : markerTele} alt="markerTele" />}
            {type === "Backhoeloader" && <img style={imageStyle} width={65} height={'auto'} src={state == true ? greenMarkerBackhoe : markerBachoe} alt="markerBachoe" />}
            {type === "Telehandler" && <img style={imageStyle}  src={state == true ? greenMarkerTele : markerTele} alt="markerTele" />}
            {type === "LOGO" && <img style={imageStyle} width={40} height={40} src={Logo} alt="LOGO" />}
            {type === "service" && <img style={imageStyle} width={65} height={'auto'} src={serviceMarker} alt="serviceMarker" />}
            {type === "Develon" && <img style={imageStyle} src={state == true ? greenDevelon : develon} alt="develon" />}
        </div>
    )
}

export default CustomMapMarker;
