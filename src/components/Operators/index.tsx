import { useState } from "react";
import profileImage from '../../assets/images/profile.png';
import OperatorDetail from "./index2";

interface Operator {
    name: string;
    location: string;
    phone: string;
    machine: string;
  }
  

const OperatorList = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null);

    // Modal'ı açmak için fonksiyon
    const openModal = (operator: Operator) => {
        setSelectedOperator(operator);
        setIsModalOpen(true);
    };

    // Modal'ı kapatmak için fonksiyon
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedOperator(null);
    };

    // Operatör verileri
    const operators: Operator[] = [
        {
            name: "Mehmet Yılmaz",
            location: "İstanbul",
            phone: "0555 123 45 67",
            machine: "Excavator - 4",
        },
        {
            name: "Ali Can",
            location: "Ankara",
            phone: "0555 987 65 43",
            machine: "Excavator - 3",
        },
        {
            name: "Hasan Demir",
            location: "Ankara",
            phone: "0555 112 34 56",
            machine: "Excavator - 2",
        },
        {
            name: "Ali Can",
            location: "Ankara",
            phone: "0555 987 65 43",
            machine: "Excavator - 3",
        },
        {
            name: "Ömer Faruk",
            location: "Mersin",
            phone: "0555 998 77 66",
            machine: "Excavator - 1",
        },
        {
            name: "Ali Can",
            location: "Ankara",
            phone: "0555 987 65 43",
            machine: "Excavator - 3",
        },
    ];

    return (
        <div className="bg-white">
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                {/* Başlık ve "Tüm Operatörler" butonu */}
                {!isModalOpen && (
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">Operatör Listesi</h2>
                )}

                {isModalOpen && (
                    <button
                        onClick={closeModal}
                        className="text-sm font-semibold text-indigo-600 mb-4 inline-block"
                    >
                        Tüm Operatörleri Göster
                    </button>
                )}

                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    {!isModalOpen && operators.map((operator, index) => (
                        <div key={index} className="group relative bg-gray-50 p-4 rounded-[10px] shadow-sm hover:shadow-lg transition-shadow duration-200">
                            <div className="flex items-center space-x-4">
                                {/* Profil Fotoğrafı */}
                                <img
                                    src={profileImage}
                                    alt="Operatör"
                                    className="w-16 h-16 rounded-full object-cover"
                                />
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900">{operator.name}</h3>
                                    <h3 className="text-sm font-medium text-gray-900">{operator.location}</h3>
                                    <p className="text-sm text-gray-500">Tel: {operator.phone}</p>
                                    <p className="text-sm text-gray-500">{operator.machine}</p>
                                </div>
                            </div>
                            <div className="mt-4">
                                {/* Detaylar Butonu */}
                                <button
                                    onClick={() => openModal(operator)}
                                    className="inline-block mt-4 px-4 py-2 text-sm font-semibold text-indigo-600 border border-indigo-600 rounded-[10px] hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    Detaylar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && selectedOperator && (
                <OperatorDetail operator={selectedOperator} />
            )}
        </div>
    );
};

export default OperatorList;
