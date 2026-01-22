import  { useState } from 'react';
import DataCard1 from './DataCard';
import { SvgIcons } from '../assets/icons/SvgIcons';

const GridWithToggle = () => {
    const [showAll, setShowAll] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false); // Dropdown'un açık/kapalı durumu
    const typeArray = ["Type1", "Type2", "Type3", "Type4"]; // Type'lar dizisi
    const [selectedType, setSelectedType] = useState<string>(typeArray[0]); // Başlangıçta ilk tür seçili

    const toggleShow = () => {
        setShowAll(!showAll);
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    // Kart verisi
    const cards = [
        <DataCard1 title="emin" value={80} />,
        <DataCard1 title="emin" value={80} />,
        <DataCard1 title="emin" value={80} />,
        <DataCard1 title="emin" value={80} />,
        <DataCard1 title="emin" value={80} />,
        <DataCard1 title="emin" value={80} />,
        <DataCard1 title="emin" value={80} />,
        <DataCard1 title="emin" value={80} />,

       
    ];

    // Her satırda 4 kart var, ve her defasında 2 satır gösterilecek
    const cardsPerRow = 4; // Her satırda 4 kart
    const rowsToShow = showAll ? Math.ceil(cards.length / cardsPerRow) : 2; // Başlangıçta 2 satır gösterilecek
    const visibleCards = cards.slice(0, rowsToShow * cardsPerRow); // Gösterilecek kartları slice et

    // Dropdown öğesine tıklandığında türü seç
    const handleSelectType = (type: string) => {
        setSelectedType(type);
        setDropdownOpen(false); // Tür seçildikten sonra dropdown menüsünü kapat
    };

    return (
        <div className='bg-white sm:min-w-400px] md:min-w-[500px] lg:min-w-[1000px] '>
            {/* Header */}
            <div className="flex bg-green-400 w-full h-[16px] items-center justify-between mb-4">
                <h1 className="text-2xl font-bold font-sans text-gray4">Sensör Verileri</h1>

                <div className="flex items-center">
                    {/* Sıralama: Tür kısmı */}
                    <div className="flex relative bg-transparent">
                        <button className="flex bg-transparent " onClick={toggleDropdown}>
                            <h1 className="bg-transparent text-base font-bold font-sans text-gray4 mr-2 inline-block">
                                Sıralama: {selectedType}
                            </h1> {/* Seçilen tür burada gösterilecek */}
                            <SvgIcons iconName="Filter" />
                        </button>

                        {/* Dropdown menüsü */}
                        {dropdownOpen && (
                            <div
                                className="absolute z-10 mt-14 w-40 bg-white rounded-[10px] shadow-lg dark:bg-gray-700 "
                                onClick={(e) => e.stopPropagation()} // İçeriye tıklayınca kapanmaması için
                            >
                                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                                    {typeArray.map((type, index) => (
                                        <li key={index}>
                                            <a
                                                href="#"
                                                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                                onClick={() => handleSelectType(type)} // Tür seçildiğinde handleSelectType çağrılır
                                            >
                                                {type}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Grid Kartları */}
            <div
                className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 bg-white justify-between overflow-auto "

            >
                {/* Gösterilecek kartları state'e göre kontrol et */}
                {visibleCards.map((card, index) => (
                    <div key={index} className="mb-[10px] ">
                        {card}
                    </div>
                ))}
            </div>

            {/* "Daha Fazla Göster" butonu */}
            <button
                onClick={toggleShow}
                className="px-6 py-2 bg-blue-500 text-white rounded-[10px] hover:bg-blue-600 transition duration-300 mt-4"
            >
                {showAll ? 'Daha Az Göster' : 'Daha Fazla Göster'}
            </button>
        </div>
    );
};

export default GridWithToggle;
