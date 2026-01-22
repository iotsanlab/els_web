import { SvgIcons } from "../../assets/icons/SvgIcons";

interface Props {
    title: string;
    value: number;
}

const DataCard2 = ({ title, value }: Props) => {

    console.log(title,value)



    return (
        <div className="card bg-white w-[200px] h-[200px] shadow-xl overflow-hidden">

            <div className="flex w-full pl-3 pt-2 bg-white">
                <SvgIcons iconName="Bag" />
            </div>

            <div className="flex flex-col w-full bg-white justify-center items-center pt-3">
                <span className="text-gray5 text-4xl font-sans font-bold">42</span>
                <span className="text-gray5 text-2xl font-sans font-bold">litre / son hafta</span>
            </div>

            <div className="flex flex-col w-full h-12  bg-white items-center justify-center mt-2 absolute bottom-0 ">
                <span className="text-gray5 text-sm font-sans font-bold tracking-wider">Rölantide Harcanan Yakıt</span>
                <span className="text-gray2 text-xs font-sans font-normal">son güncelleme 15:42 </span>
            </div>

        </div>
    );
};

export default DataCard2;
