import { useEffect } from "react";
import { SvgIcons } from "../../assets/icons/SvgIcons";

interface Props {
    title: string;
    value: number;
}

const DataCard1 = ({ title, value }: Props) => {

   

    useEffect(() => {
        console.log(title)
        
    },[])



    return (
        <div className="card bg-white  h-[200px] shadow-xl overflow-hidden w-[200px]">


            <div className="flex w-full pl-3 pt-2 bg-white">
                <SvgIcons iconName="Bag" fill="#CBD1D7" />
            </div>



            <div className="flex w-full bg-white justify-center items-center pl-10">

                <div className="flex items-center justify-center" >

                    <div className="w-[35px] h-[105px] bg-gray3 rounded-[10px] flex flex-col-reverse overflow-hidden mr-2">
                        <div
                            className="w-[35px] bg-green rounded-[10px]"
                            style={{ height: `${value}%` }}
                        />
                    </div>

                </div>

                <div className="flex w-full bg-white flex-col items-start">
                    <span className="mb-8 text-gray2 text-xs font-sans font-normal">565 Lt max</span>
                    <span className="text-gray5 text-4xl font-sans font-bold">{value}%</span>
                    <span className="text-gray2 text-xs font-sans font-normal">463 Lt</span>
                </div>

            </div>

            <div className="flex flex-col w-full h-12  bg-white items-center justify-center mt-2 absolute bottom-0">
                <span className="text-gray5 text-sm font-sans font-bold tracking-wider">Yakıt Miktarı</span>
                <span className="text-gray2 text-xs font-sans font-normal">son güncelleme 15:42 </span>

            </div>

        </div>
    );
};

export default DataCard1;
