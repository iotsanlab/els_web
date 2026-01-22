/* 
import { useState } from "react";
import { SvgIcons } from "../assets/icons/SvgIcons";
import PieChart from "./PieChart";

interface Props {
    title?: string;
}

const UsingChart = ({ title }: Props) => {
    const options = ["Bugün", "Dün", "Haftalık", "Aylık"];
    const [dropdownOpen, setDropdownOpen] = useState(false); // Dropdown'un açık/kapalı durumu
    const [selectedOption, setSelectedOption] = useState("Haftalık"); // Varsayılan olarak Haftalık seçili
    console.log(title)

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    // Dropdown'dan bir öğe seçildiğinde, seçimi güncelle ve menüyü kapat
    const handleSelectOption = (option: string) => {
        setSelectedOption(option);
        setDropdownOpen(false); // Seçim yapıldıktan sonra menüyü kapat
    };

    return (
        <div className="items-center justify-center h-[410px] w-[410px] rounded-[10px] shadow-lg bg-white px-[15px] py-[15px]">

        <div className="flex items-center justify-between">
            <div className="flex items-center">
                <SvgIcons iconName="Signal" />
                <span className="text-lg font-bold font-sans text-gray4 mr-2 inline-block pl-2">Kullanım</span>
            </div>

            <div className="relative ">
             
                <button 
                    onClick={toggleDropdown} 
                    className="flex items-center p-0 min-w-[80px] justify-between"
                >
                    <span className="text-gray1 text-xs font-sans font-bold pl-2">{selectedOption}</span>
                    <SvgIcons iconName="ArrowBottom"/>
                </button>

               
                {dropdownOpen && (
                    <div className="absolute z-50right-0 mt-2 w-32 bg-white rounded-[10px] shadow-lg border border-gray-300">
                        <ul className="py-2 text-sm text-gray-700">
                          
                            {options.map((option) => (
                                <li key={option}>
                                    <a 
                                        href="#"
                                        className="block px-4 py-2 hover:bg-gray-100"
                                        onClick={() => handleSelectOption(option)} // Seçenek tıklanınca handleSelectOption çağrılır
                                    >
                                        {option}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>


        <PieChart />
    </div>
    );
};
export default UsingChart;
*/