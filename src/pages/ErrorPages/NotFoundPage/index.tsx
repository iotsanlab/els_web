import React from "react";
import mstLogin from "../../../assets/images/mstLogin.png";
import mstLoginLogo from "../../../assets/images/mstLoginLogo.png";
import { useNavigate } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="relative flex items-center w-screen h-screen bg-black">
      {/* Sol Görsel */}
      <div className="flex items-center justify-center w-full h-screen bg-black bg-center bg-cover">
        <div className="absolute top-0 left-0 w-full h-full bg-gray-900 opacity-50"></div>
        <img alt="Your Company" src={mstLogin} className="w-full h-full " />

        <div className="px-[60px] py-[80px] lg:px-[80px] lg:py-[100px] md:px-[70px] md:py-[90px] absolute z-10 p-10  bg-black rounded-[10px] drop-shadow-[2px_2px_4px_#00000026] flex flex-col items-center justify-center">
          <img
            src={mstLoginLogo}
            className="w-[150px] h-auto mb-5 lg:w-[400px] md:w-[300px]"
          />
          <h1 className="text-6xl font-bold text-white lg:text-8xl md:text-7xl">
            404
          </h1>
          <h2 className="mt-2 text-2xl text-gray-400">Sayfa Bulunamadı</h2>
          <button
            onClick={() => navigate('/home')}
            className="w-full bg-[#FFA600] text-black font-bold py-2 px-4 rounded-[10px] mt-10"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
