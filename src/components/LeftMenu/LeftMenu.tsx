import { useState, useEffect } from "react";
import { SvgIcons } from "../../assets/icons/SvgIcons";
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';



const LeftMenu = () => {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [selected, setSelected] = useState<string>("");
  const [hovered, setHovered] = useState<string | null>(null); // Hover state ekledik

  useEffect(() => {
    const currentPath = location.pathname;
    
    if (currentPath === "/" || currentPath === "/home") {
      setSelected("HomePage");
      return;
    }

    const cleanPath = currentPath.substring(1);
    setSelected(cleanPath);
  }, [location.pathname]);

  const MiniBox = ({ title, svg, name, onPress }: { title: string; svg: string; name: string, onPress?: () => void; }) => {
    const isSelected = selected === name;
    const isHovered = hovered === name; // Hover durumu kontrolü

    return (
      <div
        className={`h-[85px] flex flex-col items-center justify-center cursor-pointer border-y-[1px] dark:border-gray9 ${isSelected ? "bg-gray4 text-white dark:bg-gray8" : "hover:bg-mstYellow hover:border-gray10"}`}
        onClick={() => { setSelected(name); if (onPress) onPress(); }}
        onMouseEnter={() => setHovered(name)} // Hover başladığında
        onMouseLeave={() => setHovered(null)} // Hover bittiğinde
      >
        <div className="mb-2">
          {/* İkonun rengini hover durumuna göre değiştirelim */}
          <SvgIcons iconName={svg} fill={isSelected ? "#FFF" : isHovered ? "#28333E" : "#B9C2CA"} />
        </div>

        <h4 className={`font-verdana font-bold text-sm leading-[24px] tracking-[0.38px] text-center ${isSelected ? "text-white" : isHovered ? "text-gray10" : "text-gray4"} select-none`}>
          {title}
        </h4>
      </div>
    );
  };

  return (
    <div className="space-y-0 bg-white dark:bg-gray10 border-r-[1px] border-gray2 dark:border-gray9 h-full drop-shadow-[2px_2px_4px_rgba(0,0,0,0.2)] dark:drop-shadow-none">
      <MiniBox title={t("leftMenu.homePage")} svg="HomePage" name="HomePage" onPress={() => navigate("/home")} />
      <MiniBox title={t("leftMenu.machines")} svg="Vehicles" name="Vehicles" onPress={() => navigate("/Vehicles")}/>
      <MiniBox title={t("leftMenu.notify")} svg="Warning" name="Warning" onPress={() => navigate("/Warning")}/>
      <MiniBox title={t("leftMenu.report")} svg="Reports" name="Report" onPress={() => navigate("/Report")} />
      <MiniBox title={t("leftMenu.map")} svg="Map" name="Map" onPress={() => navigate("/Map")} />
      <MiniBox title={t("leftMenu.service")} svg="Services" name="Services" onPress={() => navigate("/Services")}/>
    </div>
  );
};

export default LeftMenu;
