

interface Props {
    title: string;
}

const GeneralTitle = ({title} : Props) => {
    return(
        <div className="mb-2">
          <span className="text-gray6 font-bold text-[24px] leading-relaxed tracking-wide select-none">{title}</span>
        </div>
    );
};

export default GeneralTitle;